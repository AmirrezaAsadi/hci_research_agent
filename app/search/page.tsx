'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Search, BookOpen, ExternalLink, Calendar } from 'lucide-react';
import Footer from '../components/Footer';

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

function SearchContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const [papers, setPapers] = useState<Paper[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState(initialQuery);

  useEffect(() => {
    if (initialQuery) {
      performSearch(initialQuery);
    }
  }, [initialQuery]);

  const performSearch = async (query: string) => {
    if (!query.trim()) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      const data = await response.json();

      if (data.success) {
        setPapers(data.data);
      }
    } catch (error) {
      console.error('Error searching:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    // Update URL
    window.history.replaceState({}, '', `/search?q=${encodeURIComponent(searchQuery)}`);

    await performSearch(searchQuery);
  };

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
              <Link href="/papers" className="text-gray-600 hover:text-gray-900">Papers</Link>
              <Link href="/trends" className="text-gray-600 hover:text-gray-900">Trends</Link>
              <Link href="/about" className="text-gray-600 hover:text-gray-900">About</Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Search Section */}
      <section className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Search Research Papers</h1>

            <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
              <div className="flex">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by title, author, keywords, or abstract..."
                  className="flex-1 px-6 py-4 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 text-white px-8 py-4 rounded-r-lg hover:bg-blue-700 disabled:opacity-50 flex items-center"
                >
                  <Search className="h-6 w-6" />
                </button>
              </div>
            </form>

            <p className="mt-4 text-gray-600">
              Search through HCI research papers from ArXiv
            </p>
          </div>
        </div>
      </section>

      {/* Results */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Searching...</span>
          </div>
        )}

        {!loading && papers.length > 0 && (
          <>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Found {papers.length} paper{papers.length !== 1 ? 's' : ''} for &quot;{searchQuery}&quot;
              </h2>
            </div>

            <div className="space-y-6">
              {papers.map((paper) => (
                <div key={paper.id} className="bg-white p-6 rounded-lg shadow-sm border">
                  <div className="flex flex-col lg:flex-row gap-6">
                    {paper.generated_image_url && (
                      <div className="lg:w-48 lg:flex-shrink-0">
                        <img
                          src={paper.generated_image_url}
                          alt={paper.title}
                          className="w-full h-32 object-cover rounded"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      </div>
                    )}

                    <div className="flex-1">
                      <h3 className="font-semibold text-xl mb-2">
                        <a
                          href={paper.arxiv_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800"
                        >
                          {paper.title}
                        </a>
                      </h3>

                      <p className="text-gray-600 mb-2">
                        {paper.authors.join(', ')}
                      </p>

                      <div className="flex items-center text-gray-500 text-sm mb-3">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(paper.published_date).toLocaleDateString()}
                        <span className="mx-2">•</span>
                        <span>ArXiv: {paper.arxiv_id}</span>
                      </div>

                      <p className="text-gray-700 mb-4 line-clamp-3">
                        {paper.summary_text || paper.abstract}
                      </p>

                      <div className="flex flex-wrap gap-1 mb-4">
                        {paper.arxiv_categories.map((cat) => (
                          <span key={cat} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                            {cat}
                          </span>
                        ))}
                      </div>

                      <div className="flex space-x-4">
                        <a
                          href={paper.arxiv_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center text-blue-600 hover:text-blue-800 font-medium"
                        >
                          <ExternalLink className="h-4 w-4 mr-1" />
                          View on ArXiv
                        </a>
                        <a
                          href={paper.pdf_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center text-red-600 hover:text-red-800 font-medium"
                        >
                          <BookOpen className="h-4 w-4 mr-1" />
                          Download PDF
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {!loading && papers.length === 0 && searchQuery && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No papers found</h3>
            <p className="text-gray-600 mb-4">
              We couldn&apos;t find any papers matching &quot;{searchQuery}&quot;
            </p>
            <p className="text-gray-500 text-sm">
              Try different keywords or check the spelling
            </p>
          </div>
        )}

        {!loading && !searchQuery && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Search for HCI Research</h3>
            <p className="text-gray-600">
              Enter keywords, author names, or topics to find relevant research papers
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}