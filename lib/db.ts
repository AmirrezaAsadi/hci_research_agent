import { sql } from '@vercel/postgres';

export interface Paper {
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
}

export interface Keyword {
  id: number;
  paper_id: number;
  keyword: string;
  source: string;
  confidence: number;
  category?: string;
  created_at: string;
}

export interface Summary {
  id: number;
  paper_id: number;
  summary_text: string;
  word_count: number;
  difficulty_level?: string;
  generated_image_url?: string;
  created_at: string;
}

export interface Trend {
  id: number;
  keyword: string;
  week_start: string;
  frequency: number;
  trending_score: number;
  growth_rate?: number;
  created_at: string;
}

// Database operations
export async function createTables() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS papers (
        id SERIAL PRIMARY KEY,
        arxiv_id VARCHAR(20) UNIQUE NOT NULL,
        title TEXT NOT NULL,
        authors JSONB NOT NULL,
        abstract TEXT NOT NULL,
        arxiv_categories JSONB NOT NULL,
        published_date DATE NOT NULL,
        arxiv_url VARCHAR(255) NOT NULL,
        pdf_url VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS keywords (
        id SERIAL PRIMARY KEY,
        paper_id INTEGER REFERENCES papers(id),
        keyword VARCHAR(100) NOT NULL,
        source VARCHAR(20) NOT NULL,
        confidence FLOAT DEFAULT 1.0,
        category VARCHAR(50),
        created_at TIMESTAMP DEFAULT NOW()
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS summaries (
        id SERIAL PRIMARY KEY,
        paper_id INTEGER REFERENCES papers(id),
        summary_text TEXT NOT NULL,
        word_count INTEGER NOT NULL,
        difficulty_level VARCHAR(20),
        generated_image_url VARCHAR(255),
        created_at TIMESTAMP DEFAULT NOW()
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS trends (
        id SERIAL PRIMARY KEY,
        keyword VARCHAR(100) NOT NULL,
        week_start DATE NOT NULL,
        frequency INTEGER NOT NULL,
        trending_score FLOAT NOT NULL,
        growth_rate FLOAT,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `;

    console.log('Tables created successfully');
  } catch (error) {
    console.error('Error creating tables:', error);
    throw error;
  }
}

export async function getRecentPapers(limit: number = 10): Promise<Paper[]> {
  try {
    const result = await sql`
      SELECT * FROM papers
      ORDER BY published_date DESC
      LIMIT ${limit}
    `;
    return result.rows as Paper[];
  } catch (error) {
    console.error('Error fetching recent papers:', error);
    return [];
  }
}

export async function getTrendingKeywords(limit: number = 20): Promise<Trend[]> {
  try {
    const result = await sql`
      SELECT * FROM trends
      WHERE week_start >= CURRENT_DATE - INTERVAL '30 days'
      ORDER BY trending_score DESC
      LIMIT ${limit}
    `;
    return result.rows as Trend[];
  } catch (error) {
    console.error('Error fetching trending keywords:', error);
    return [];
  }
}

export async function searchPapers(query: string): Promise<Paper[]> {
  try {
    const result = await sql`
      SELECT p.*, s.summary_text, s.generated_image_url
      FROM papers p
      LEFT JOIN summaries s ON p.id = s.paper_id
      WHERE p.title ILIKE ${'%' + query + '%'}
         OR p.abstract ILIKE ${'%' + query + '%'}
         OR EXISTS (
           SELECT 1 FROM keywords k
           WHERE k.paper_id = p.id AND k.keyword ILIKE ${'%' + query + '%'}
         )
      ORDER BY p.published_date DESC
      LIMIT 50
    `;
    return result.rows as Paper[];
  } catch (error) {
    console.error('Error searching papers:', error);
    return [];
  }
}