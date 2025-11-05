'use client';

import { X, ExternalLink, BookOpen } from 'lucide-react';
import Image from 'next/image';

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
  summary_text?: string;
  generated_image_url?: string;
}

interface PaperModalProps {
  paper: Paper;
  onClose: () => void;
}

export default function PaperModal({ paper, onClose }: PaperModalProps) {
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-start p-6 border-b">
          <div className="flex-1 pr-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{paper.title}</h2>
            <p className="text-gray-600 text-sm">{paper.authors.join(', ')}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-200px)]">
          <div className="p-6">
            {/* Generated Image */}
            {paper.generated_image_url && (
              <div className="mb-6">
                <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-100">
                  <Image
                    src={paper.generated_image_url}
                    alt={paper.title}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            )}

            {/* AI Summary */}
            {paper.summary_text ? (
              <div className="mb-6">
                <div className="flex items-center mb-3">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    ✨ AI Summary (Student-Friendly)
                  </span>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-gray-900 leading-relaxed">{paper.summary_text}</p>
                </div>
              </div>
            ) : (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Abstract</h3>
                <p className="text-gray-700 leading-relaxed">{paper.abstract}</p>
              </div>
            )}

            {/* Categories */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-2">Categories</h3>
              <div className="flex flex-wrap gap-2">
                {paper.arxiv_categories.map((cat) => (
                  <span key={cat} className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full">
                    {cat}
                  </span>
                ))}
              </div>
            </div>

            {/* Published Date */}
            <div className="text-sm text-gray-500 mb-4">
              Published: {new Date(paper.published_date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="border-t p-6 bg-gray-50">
          <div className="flex space-x-4">
            <a
              href={paper.arxiv_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              <ExternalLink className="h-5 w-5 mr-2" />
              View on ArXiv
            </a>
            <a
              href={paper.pdf_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors font-medium"
            >
              <BookOpen className="h-5 w-5 mr-2" />
              Download PDF
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
