import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

interface ArXivPaper {
  id: string;
  title: string;
  summary: string;
  authors: string[];
  categories: string[];
  published: string;
  updated: string;
  links: Array<{
    href: string;
    rel: string;
    type?: string;
  }>;
}

async function searchArXiv(query: string, maxResults: number = 20): Promise<ArXivPaper[]> {
  const baseUrl = 'http://export.arxiv.org/api/query';
  const searchQuery = `cat:cs.HC OR cat:cs.AI OR cat:cs.CY OR cat:cs.CV OR cat:cs.LG AND ${query}`;
  const url = `${baseUrl}?search_query=${encodeURIComponent(searchQuery)}&start=0&max_results=${maxResults}&sortBy=submittedDate&sortOrder=descending`;

  try {
    const response = await fetch(url);
    const xmlText = await response.text();

    // Simple XML parsing for ArXiv API response
    const entries: ArXivPaper[] = [];
    const entryRegex = /<entry>(.*?)<\/entry>/g;
    const idRegex = /<id>(.*?)<\/id>/;
    const titleRegex = /<title>(.*?)<\/title>/;
    const summaryRegex = /<summary>(.*?)<\/summary>/;
    const authorRegex = /<author><name>(.*?)<\/name><\/author>/g;
    const categoryRegex = /<category term="(.*?)"\/>/g;
    const publishedRegex = /<published>(.*?)<\/published>/;
    const linkRegex = /<link href="(.*?)" rel="(.*?)"(?: type="(.*?)")?\/>/g;

    let match;
    while ((match = entryRegex.exec(xmlText)) !== null) {
      const entryXml = match[1];

      const idMatch = entryXml.match(idRegex);
      const titleMatch = entryXml.match(titleRegex);
      const summaryMatch = entryXml.match(summaryRegex);
      const publishedMatch = entryXml.match(publishedRegex);

      if (!idMatch || !titleMatch || !summaryMatch) continue;

      const arxivId = idMatch[1].split('/').pop() || '';
      const title = titleMatch[1].replace(/<!\[CDATA\[|\]\]>/g, '').trim();
      const summary = summaryMatch[1].replace(/<!\[CDATA\[|\]\]>/g, '').trim();
      const published = publishedMatch ? publishedMatch[1] : '';

      // Extract authors
      const authors: string[] = [];
      let authorMatch;
      while ((authorMatch = authorRegex.exec(entryXml)) !== null) {
        authors.push(authorMatch[1]);
      }

      // Extract categories
      const categories: string[] = [];
      let categoryMatch;
      while ((categoryMatch = categoryRegex.exec(entryXml)) !== null) {
        categories.push(categoryMatch[1]);
      }

      // Extract links
      const links: Array<{href: string; rel: string; type?: string}> = [];
      let linkMatch;
      while ((linkMatch = linkRegex.exec(entryXml)) !== null) {
        links.push({
          href: linkMatch[1],
          rel: linkMatch[2],
          type: linkMatch[3]
        });
      }

      entries.push({
        id: arxivId,
        title,
        summary,
        authors,
        categories,
        published,
        updated: published,
        links
      });
    }

    return entries;
  } catch (error) {
    console.error('Error fetching from ArXiv:', error);
    return [];
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { maxResults = 20 } = body;

    // Search for HCI papers
    const papers = await searchArXiv('human computer interaction OR HCI OR human-computer interaction', maxResults);

    // Store papers in database
    for (const paper of papers) {
      try {
        const pdfUrl = paper.links.find(link => link.rel === 'related' && link.type === 'application/pdf')?.href ||
                      `https://arxiv.org/pdf/${paper.id}.pdf`;
        const arxivUrl = `https://arxiv.org/abs/${paper.id}`;

        await sql`
          INSERT INTO papers (arxiv_id, title, authors, abstract, arxiv_categories, published_date, arxiv_url, pdf_url)
          VALUES (${paper.id}, ${paper.title}, ${JSON.stringify(paper.authors)}, ${paper.summary},
                  ${JSON.stringify(paper.categories)}, ${new Date(paper.published).toISOString().split('T')[0]},
                  ${arxivUrl}, ${pdfUrl})
          ON CONFLICT (arxiv_id) DO NOTHING
        `;

        // Extract basic keywords from categories
        for (const category of paper.categories) {
          await sql`
            INSERT INTO keywords (paper_id, keyword, source, confidence, category)
            SELECT p.id, ${category}, 'arxiv', 1.0, 'category'
            FROM papers p
            WHERE p.arxiv_id = ${paper.id}
            ON CONFLICT DO NOTHING
          `;
        }
      } catch (error) {
        console.error(`Error storing paper ${paper.id}:`, error);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Fetched and stored ${papers.length} papers`,
      data: papers
    });
  } catch (error) {
    console.error('Error in ArXiv search:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to search ArXiv' },
      { status: 500 }
    );
  }
}