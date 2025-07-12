import React from 'react';
import { Bot, Clock } from 'lucide-react';

const MentionItem = ({ mention }) => {
  const {
    aiPlatform,
    prompt,
    position,
    timeAgo,
    snippet,
    competitorLogos,
    aiPlatformIcon
  } = mention;

  const getAIPlatformIcon = (platform) => {
    // For now, using Bot icon as placeholder for AI platforms
    // In production, you'd have specific icons for OpenAI, Claude, etc.
    return <Bot className="w-6 h-6 text-blue-600" />;
  };

  return (
    <div className="p-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors">
      <div className="flex items-start space-x-4">
        {/* AI Platform Icon */}
        <div className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
          {getAIPlatformIcon(aiPlatform)}
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Prompt Title */}
          <h3 className="text-sm font-semibold text-gray-900 mb-1 line-clamp-1">
            {prompt}
          </h3>

          {/* Position and Time */}
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-xs text-gray-500">#{position} position</span>
            <span className="text-xs text-gray-400">•</span>
            <div className="flex items-center space-x-1">
              <Clock className="w-3 h-3 text-gray-400" />
              <span className="text-xs text-gray-500">{timeAgo}</span>
            </div>
          </div>

          {/* AI Response Snippet */}
          <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
            {snippet}
          </p>
        </div>

        {/* Competitor Logos Cluster */}
        <div className="flex-shrink-0">
          <div className="flex items-center -space-x-2">
            {competitorLogos.map((logo, index) => (
              <div
                key={index}
                className="w-6 h-6 bg-white rounded-full border-2 border-white shadow-sm flex items-center justify-center relative z-10"
                style={{ zIndex: competitorLogos.length - index }}
              >
                <img
                  src={logo.src}
                  alt={logo.alt}
                  className="w-4 h-4 rounded-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <div className="w-4 h-4 bg-gray-200 rounded-full flex items-center justify-center text-xs font-medium text-gray-600" style={{ display: 'none' }}>
                  {logo.alt.charAt(0)}
                </div>
              </div>
            ))}
            {competitorLogos.length > 3 && (
              <div className="w-6 h-6 bg-gray-100 rounded-full border-2 border-white flex items-center justify-center relative z-0">
                <span className="text-xs font-medium text-gray-600">+{competitorLogos.length - 3}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentionItem;