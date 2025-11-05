'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, TrendingUp, BookOpen } from 'lucide-react';

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
}

interface Trend {
  id: number;
  keyword: string;
  week_start: string;
  frequency: number;
  trending_score: number;
  growth_rate?: number;
  created_at: string;
}

export default function Home() {
  const [recentPapers, setRecentPapers] = useState<Paper[]>([]);
  const [trendingKeywords, setTrendingKeywords] = useState<Trend[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [papersRes, trendsRes] = await Promise.all([
        fetch('/api/papers?limit=10'),
        fetch('/api/trends?limit=10')
      ]);

      const papersData = await papersRes.json();
      const trendsData = await trendsRes.json();

      if (papersData.success) setRecentPapers(papersData.data);
      if (trendsData.success) setTrendingKeywords(trendsData.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    // Navigate to search results page
    window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
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
              <h1 className="ml-2 text-2xl font-bold text-gray-900">
                HCI Research Trends
              </h1>
            </div>
            <nav className="flex space-x-8">
              <Link href="/" className="text-gray-900 font-medium">Home</Link>
              <Link href="/papers" className="text-gray-600 hover:text-gray-900">Papers</Link>
              <Link href="/trends" className="text-gray-600 hover:text-gray-900">Trends</Link>
              <Link href="/about" className="text-gray-600 hover:text-gray-900">About</Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h2 className="text-4xl font-bold mb-4">
              Discover HCI Research Trends
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Stay updated with the latest Human-Computer Interaction research from ArXiv.
              Explore trending topics, read student-friendly summaries, and discover emerging areas.
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="max-w-md mx-auto">
              <div className="flex">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search papers, keywords..."
                  className="flex-1 px-4 py-2 rounded-l-lg border-0 text-gray-900"
                />
                <button
                  type="submit"
                  className="bg-white text-blue-600 px-6 py-2 rounded-r-lg hover:bg-gray-100 flex items-center"
                >
                  <Search className="h-5 w-5" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Recent Papers */}
          <div>
            <div className="flex items-center mb-6">
              <BookOpen className="h-6 w-6 text-blue-600 mr-2" />
              <h3 className="text-2xl font-bold text-gray-900">Recent Papers</h3>
            </div>

            <div className="space-y-4">
              {recentPapers.slice(0, 5).map((paper) => (
                <div key={paper.id} className="bg-white p-6 rounded-lg shadow-sm border">
                  <h4 className="font-semibold text-lg mb-2 line-clamp-2">
                    <a
                      href={paper.arxiv_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      {paper.title}
                    </a>
                  </h4>
                  <p className="text-gray-600 text-sm mb-2">
                    {paper.authors.join(', ')}
                  </p>
                  <p className="text-gray-500 text-sm mb-3">
                    {new Date(paper.published_date).toLocaleDateString()}
                  </p>
                  <p className="text-gray-700 line-clamp-3">
                    {paper.abstract}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-1">
                    {paper.arxiv_categories.slice(0, 3).map((cat) => (
                      <span key={cat} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                        {cat}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6">
              <Link
                href="/papers"
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                View all papers →
              </Link>
            </div>
          </div>

          {/* Trending Keywords */}
          <div>
            <div className="flex items-center mb-6">
              <TrendingUp className="h-6 w-6 text-purple-600 mr-2" />
              <h3 className="text-2xl font-bold text-gray-900">Trending Topics</h3>
            </div>

            <div className="space-y-4">
              {trendingKeywords.slice(0, 10).map((trend) => (
                <div key={trend.id} className="bg-white p-4 rounded-lg shadow-sm border">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-900">{trend.keyword}</span>
                    <div className="flex items-center">
                      <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                      <span className="text-sm text-green-600 font-medium">
                        {trend.trending_score.toFixed(1)}
                      </span>
                    </div>
                  </div>
                  <div className="mt-2 flex justify-between text-sm text-gray-500">
                    <span>{trend.frequency} papers</span>
                    <span>Week of {new Date(trend.week_start).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6">
              <Link
                href="/trends"
                className="text-purple-600 hover:text-purple-800 font-medium"
              >
                View all trends →
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <BookOpen className="h-6 w-6 text-blue-400 mr-2" />
              <span className="text-xl font-bold">SIGCHI UC</span>
            </div>
            <p className="text-gray-400 mb-4">
              Human-Computer Interaction Research Trends Platform
            </p>
            <p className="text-sm text-gray-500">
              Powered by ArXiv API • Built with Next.js • Hosted on Vercel
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
