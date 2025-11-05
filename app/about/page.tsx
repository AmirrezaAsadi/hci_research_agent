import Link from 'next/link';
import { BookOpen, Users, TrendingUp, Zap, Target, Heart } from 'lucide-react';

export default function AboutPage() {
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
              <Link href="/about" className="text-gray-900 font-medium">About</Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">About SIGCHI UC</h1>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Empowering the next generation of HCI researchers through automated research discovery and trend analysis
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mission</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              To make cutting-edge HCI research accessible to undergraduate students by automatically
              discovering, summarizing, and analyzing research trends from ArXiv.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Research Discovery</h3>
              <p className="text-gray-600">
                Automatically scan ArXiv daily for new HCI papers across multiple categories
              </p>
            </div>

            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Trend Analysis</h3>
              <p className="text-gray-600">
                Identify emerging topics and track keyword popularity over time
              </p>
            </div>

            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Student Access</h3>
              <p className="text-gray-600">
                Provide undergraduate-friendly summaries and visual content
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">What We Do</h2>
            <p className="text-xl text-gray-600">
              A comprehensive platform for HCI research discovery and analysis
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center mb-4">
                <Zap className="h-6 w-6 text-yellow-500 mr-3" />
                <h3 className="text-xl font-semibold text-gray-900">Automated Discovery</h3>
              </div>
              <p className="text-gray-600">
                Daily scanning of ArXiv for HCI papers in categories like cs.HC, cs.AI, cs.CV, and cs.LG.
                Smart filtering ensures relevance to human-computer interaction research.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center mb-4">
                <Target className="h-6 w-6 text-red-500 mr-3" />
                <h3 className="text-xl font-semibold text-gray-900">Intelligent Analysis</h3>
              </div>
              <p className="text-gray-600">
                Extract keywords, calculate trending scores, and identify emerging research areas.
                Track how topics evolve over time and predict future directions.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center mb-4">
                <Heart className="h-6 w-6 text-pink-500 mr-3" />
                <h3 className="text-xl font-semibold text-gray-900">Student-Friendly Content</h3>
              </div>
              <p className="text-gray-600">
                Generate 100-word summaries optimized for undergraduates. Create visual illustrations
                and assess difficulty levels to help students navigate complex research.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center mb-4">
                <TrendingUp className="h-6 w-6 text-green-500 mr-3" />
                <h3 className="text-xl font-semibold text-gray-900">Trend Visualization</h3>
              </div>
              <p className="text-gray-600">
                Interactive charts showing keyword popularity, growth rates, and research hotspots.
                Weekly reports highlight the most significant developments in HCI.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Technology Stack</h2>
            <p className="text-xl text-gray-600">
              Built with modern web technologies and hosted on Vercel
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-blue-600 font-bold text-lg">N</span>
              </div>
              <h4 className="font-semibold text-gray-900">Next.js</h4>
              <p className="text-sm text-gray-600">React Framework</p>
            </div>

            <div className="text-center">
              <div className="bg-cyan-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-cyan-600 font-bold text-lg">T</span>
              </div>
              <h4 className="font-semibold text-gray-900">TypeScript</h4>
              <p className="text-sm text-gray-600">Type Safety</p>
            </div>

            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-purple-600 font-bold text-lg">T</span>
              </div>
              <h4 className="font-semibold text-gray-900">Tailwind</h4>
              <p className="text-sm text-gray-600">CSS Framework</p>
            </div>

            <div className="text-center">
              <div className="bg-black w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-white font-bold text-lg">V</span>
              </div>
              <h4 className="font-semibold text-gray-900">Vercel</h4>
              <p className="text-sm text-gray-600">Hosting & Database</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-16">
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
              Built with ❤️ for HCI students • Powered by ArXiv API
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}