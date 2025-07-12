import React from 'react';
import { Download } from 'lucide-react';
import MentionItem from './MentionItem';

const RecentMentions = () => {
  const mentionsData = [
    {
      id: 1,
      aiPlatform: 'OpenAI',
      prompt: 'Best new car deals with government incentives?',
      position: '3rd',
      timeAgo: '1 hr ago',
      snippet: 'For the best new car deals with government incentives, consider the Tesla Model 3 which qualifies for the federal EV tax credit of up to $7,500. The Hyundai Ioniq 6 also offers excellent value with similar incentives...',
      competitorLogos: [
        { src: '/api/placeholder/24/24', alt: 'Tesla' },
        { src: '/api/placeholder/24/24', alt: 'Toyota' },
        { src: '/api/placeholder/24/24', alt: 'Ford' },
        { src: '/api/placeholder/24/24', alt: 'Hyundai' }
      ]
    },
    {
      id: 2,
      aiPlatform: 'Claude',
      prompt: 'Most reliable electric vehicles under $50k?',
      position: '1st',
      timeAgo: '2 hrs ago',
      snippet: 'The most reliable electric vehicles under $50k include the Tesla Model 3, which has consistently high reliability ratings and excellent build quality. The Hyundai Ioniq 5 is another standout option...',
      competitorLogos: [
        { src: '/api/placeholder/24/24', alt: 'Tesla' },
        { src: '/api/placeholder/24/24', alt: 'Hyundai' },
        { src: '/api/placeholder/24/24', alt: 'Kia' }
      ]
    },
    {
      id: 3,
      aiPlatform: 'Gemini',
      prompt: 'Best family SUV with advanced safety features?',
      position: '2nd',
      timeAgo: '3 hrs ago',
      snippet: 'For families prioritizing safety, the Tesla Model Y stands out with its 5-star safety rating and advanced Autopilot features. The BMW iX also offers exceptional safety technology including...',
      competitorLogos: [
        { src: '/api/placeholder/24/24', alt: 'Tesla' },
        { src: '/api/placeholder/24/24', alt: 'BMW' },
        { src: '/api/placeholder/24/24', alt: 'Volvo' },
        { src: '/api/placeholder/24/24', alt: 'Mercedes' }
      ]
    },
    {
      id: 4,
      aiPlatform: 'OpenAI',
      prompt: 'Luxury cars with best resale value?',
      position: '4th',
      timeAgo: '4 hrs ago',
      snippet: 'Luxury cars with the best resale value include Tesla vehicles, which maintain their value exceptionally well due to high demand and limited supply. BMW and Mercedes-Benz also perform well...',
      competitorLogos: [
        { src: '/api/placeholder/24/24', alt: 'Tesla' },
        { src: '/api/placeholder/24/24', alt: 'BMW' },
        { src: '/api/placeholder/24/24', alt: 'Mercedes' }
      ]
    },
    {
      id: 5,
      aiPlatform: 'Claude',
      prompt: 'Best truck for towing and hauling?',
      position: '5th',
      timeAgo: '5 hrs ago',
      snippet: 'For towing and hauling, the Ford F-150 Lightning offers impressive capabilities with up to 10,000 lbs towing capacity. The Tesla Cybertruck, when available, promises even higher towing capacity...',
      competitorLogos: [
        { src: '/api/placeholder/24/24', alt: 'Ford' },
        { src: '/api/placeholder/24/24', alt: 'Tesla' },
        { src: '/api/placeholder/24/24', alt: 'Chevrolet' }
      ]
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-1">Recent Tesla Mentions</h2>
            <p className="text-sm text-gray-500">Latest AI responses mentioning your brand</p>
          </div>
          <button className="inline-flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">
            <Download className="w-4 h-4" />
            <span>Download</span>
          </button>
        </div>
      </div>

      {/* Mentions List */}
      <div className="divide-y divide-gray-100">
        {mentionsData.map((mention) => (
          <MentionItem key={mention.id} mention={mention} />
        ))}
      </div>

      {/* Load More */}
      <div className="p-4 text-center">
        <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
          Load more mentions
        </button>
      </div>
    </div>
  );
};

export default RecentMentions;