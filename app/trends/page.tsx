'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { TrendingUp, BookOpen, BarChart3 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface Trend {
  id: number;
  keyword: string;
  week_start: string;
  frequency: number;
  trending_score: number;
  growth_rate?: number;
  created_at: string;
}

export default function TrendsPage() {
  const [trends, setTrends] = useState<Trend[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrends();
  }, []);

  const fetchTrends = async () => {
    try {
      const response = await fetch('/api/trends?limit=50');
      const data = await response.json();

      if (data.success) {
        setTrends(data.data);
      }
    } catch (error) {
      console.error('Error fetching trends:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  // Prepare data for chart
  const chartData = trends.slice(0, 10).map(trend => ({
    keyword: trend.keyword.length > 15 ? trend.keyword.substring(0, 15) + '...' : trend.keyword,
    frequency: trend.frequency,
    score: trend.trending_score
  }));

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
              <Link href="/trends" className="text-gray-900 font-medium">Trends</Link>
              <Link href="/about" className="text-gray-600 hover:text-gray-900">About</Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <TrendingUp className="h-12 w-12 mr-3" />
              <h1 className="text-4xl font-bold">Research Trends</h1>
            </div>
            <p className="text-xl max-w-2xl mx-auto">
              Discover the hottest topics and emerging areas in Human-Computer Interaction research
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Chart Section */}
          <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center mb-6">
                <BarChart3 className="h-6 w-6 text-purple-600 mr-2" />
                <h2 className="text-2xl font-bold text-gray-900">Trending Keywords</h2>
              </div>

              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="keyword"
                      angle={-45}
                      textAnchor="end"
                      height={80}
                      fontSize={12}
                    />
                    <YAxis />
                    <Tooltip
                      formatter={(value, name) => [
                        name === 'frequency' ? `${value} papers` : value,
                        name === 'frequency' ? 'Frequency' : 'Score'
                      ]}
                    />
                    <Bar dataKey="frequency" fill="#8b5cf6" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-64 text-gray-500">
                  <p>No trend data available yet. Run the trend analysis to populate this chart.</p>
                </div>
              )}
            </div>
          </div>

          {/* Trends List */}
          <div>
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Top Keywords</h3>

              <div className="space-y-4">
                {trends.slice(0, 15).map((trend, index) => (
                  <div key={trend.id} className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center">
                        <span className="bg-purple-100 text-purple-800 text-sm font-medium px-2 py-1 rounded mr-2">
                          #{index + 1}
                        </span>
                        <span className="font-medium text-gray-900">{trend.keyword}</span>
                      </div>
                      <div className="mt-1 text-sm text-gray-500">
                        {trend.frequency} papers • Score: {trend.trending_score.toFixed(1)}
                      </div>
                    </div>
                    <div className="ml-4">
                      <TrendingUp className={`h-5 w-5 ${
                        trend.growth_rate && trend.growth_rate > 0
                          ? 'text-green-500'
                          : 'text-gray-400'
                      }`} />
                    </div>
                  </div>
                ))}
              </div>

              {trends.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <p>No trending keywords found.</p>
                  <p className="text-sm mt-2">Keywords will appear here after papers are processed.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Weekly Insights */}
        <div className="mt-12 bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Weekly Insights</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {trends.length}
              </div>
              <div className="text-gray-600">Tracked Keywords</div>
            </div>

            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {trends.filter(t => t.trending_score > 5).length}
              </div>
              <div className="text-gray-600">Hot Topics</div>
            </div>

            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {Math.max(...trends.map(t => t.frequency), 0)}
              </div>
              <div className="text-gray-600">Max Frequency</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}