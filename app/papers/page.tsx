'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, BookOpen, ExternalLink, Calendar } from 'lucide-react';
import PaperModal from '../components/PaperModal';

interface Paper {
  id: number;
  arxiv_id: string;
  title: string;
  authors: string[];
  abstract: string;
  arxiv_categories: string[];
  published_date: string;
  arxiv_url: string;
  pdf_url: string;
  created_at: string;
  summary_text?: string;
  generated_image_url?: string;
}

export default function PapersPage() {
  const [papers, setPapers] = useState<Paper[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPapers, setFilteredPapers] = useState<Paper[]>([]);
  const [selectedPaper, setSelectedPaper] = useState<Paper | null>(null);

  useEffect(() => {
    fetchPapers();
  }, []);

  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = papers.filter(paper =>
        paper.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        paper.abstract.toLowerCase().includes(searchQuery.toLowerCase()) ||
        paper.authors.some(author => author.toLowerCase().includes(searchQuery.toLowerCase())) ||
        paper.arxiv_categories.some(cat => cat.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setFilteredPapers(filtered);
    } else {
      setFilteredPapers(papers);
    }
  }, [searchQuery, papers]);

  const fetchPapers = async () => {
    try {
      // Fetch papers from Railway backend
      const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'https://hciresearchagent-production.up.railway.app';
      const papersResponse = await fetch(`${backendUrl}/papers?limit=50`);
      const papersData = await papersResponse.json();

      if (papersData.success) {
        const papersWithSummaries = papersData.data;

        // Fetch summaries for each paper
        const summariesPromises = papersWithSummaries.map(async (paper: Paper) => {
          try {
            const summaryResponse = await fetch(`${backendUrl}/summaries/${paper.id}`);
            const summaryData = await summaryResponse.json();
            
            if (summaryData.success && summaryData.data) {
              return {
                ...paper,
                summary_text: summaryData.data.summary_text,
                generated_image_url: summaryData.data.generated_image_url
              };
            }
          } catch {
            // Silently skip papers without summaries
          }
          return paper;
        });

        const enrichedPapers = await Promise.all(summariesPromises);
        setPapers(enrichedPapers);
        setFilteredPapers(enrichedPapers);
      }
    } catch (error) {
      console.error('Error fetching papers:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <BookOpen className="h-8 w-8 text-blue-600" />
              <Link href="/" className="ml-2 text-2xl font-bold text-gray-900">
                HCI Research Trends
              </Link>
            </div>
            <nav className="flex space-x-8">
              <Link href="/" className="text-gray-600 hover:text-gray-900">Home</Link>
              <Link href="/papers" className="text-gray-900 font-medium">Papers</Link>
              <Link href="/trends" className="text-gray-600 hover:text-gray-900">Trends</Link>
              <Link href="/about" className="text-gray-600 hover:text-gray-900">About</Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Search and Filters */}
      <section className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900">Research Papers</h1>

            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search papers..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          <div className="mt-4 text-sm text-gray-600">
            Showing {filteredPapers.length} of {papers.length} papers
          </div>
        </div>
      </section>

      {/* Papers Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPapers.map((paper) => (
            <div key={paper.id} className="bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-md transition-shadow">
              {paper.generated_image_url && (
                <div className="aspect-video bg-gray-100 flex items-center justify-center">
                  <Image
                    src={paper.generated_image_url}
                    alt={paper.title}
                    width={400}
                    height={225}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
              )}

              <div className="p-6">
                <h3 className="font-semibold text-lg mb-2 line-clamp-3">
                  <button
                    onClick={() => setSelectedPaper(paper)}
                    className="text-blue-600 hover:text-blue-800 text-left w-full"
                  >
                    {paper.title}
                  </button>
                </h3>

                <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                  {paper.authors.join(', ')}
                </p>

                <div className="flex items-center text-gray-500 text-sm mb-3">
                  <Calendar className="h-4 w-4 mr-1" />
                  {new Date(paper.published_date).toLocaleDateString()}
                </div>

                {paper.summary_text ? (
                  <div className="mb-4">
                    <div className="mb-2">
                      <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">
                        ✨ AI Summary (Student-Friendly)
                      </span>
                    </div>
                    <p className="text-gray-900 text-sm leading-relaxed bg-green-50 p-3 rounded border border-green-200">
                      {paper.summary_text}
                    </p>
                  </div>
                ) : (
                  <p className="text-gray-700 text-sm line-clamp-4 mb-4">
                    {paper.abstract}
                  </p>
                )}

                <div className="flex flex-wrap gap-1 mb-4">
                  {paper.arxiv_categories.slice(0, 3).map((cat) => (
                    <span key={cat} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                      {cat}
                    </span>
                  ))}
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => setSelectedPaper(paper)}
                    className="flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    <ExternalLink className="h-4 w-4 mr-1" />
                    View Details
                  </button>
                  <a
                    href={paper.pdf_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-red-600 hover:text-red-800 text-sm font-medium"
                  >
                    <BookOpen className="h-4 w-4 mr-1" />
                    PDF
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredPapers.length === 0 && searchQuery && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No papers found matching &quot;{searchQuery}&quot;</p>
            <button
              onClick={() => setSearchQuery('')}
              className="mt-4 text-blue-600 hover:text-blue-800 font-medium"
            >
              Clear search
            </button>
          </div>
        )}
      </main>

      {/* Paper Detail Modal */}
      {selectedPaper && (
        <PaperModal
          paper={selectedPaper}
          onClose={() => setSelectedPaper(null)}
        />
      )}
    </div>
  );
}