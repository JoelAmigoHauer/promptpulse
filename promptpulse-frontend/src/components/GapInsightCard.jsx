import React from 'react';
import { Plus, TrendingUp, ArrowRight, Zap } from 'lucide-react';

const GapInsightCard = ({ insight, onGenerateBrief }) => {
  const {
    gapTopic,
    trendingScore,
    searchVolume,
    competitorCount,
    opportunity,
    description,
    priority = 'high'
  } = insight;

  const getPriorityColor = () => {
    switch (priority) {
      case 'high': return 'border-green-200 bg-green-50';
      case 'medium': return 'border-blue-200 bg-blue-50';
      default: return 'border-purple-200 bg-purple-50';
    }
  };

  const getPriorityBadgeColor = () => {
    switch (priority) {
      case 'high': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-blue-100 text-blue-800';
      default: return 'bg-purple-100 text-purple-800';
    }
  };

  return (
    <div className={`p-6 rounded-lg border-2 ${getPriorityColor()} hover:shadow-lg transition-all duration-200 relative overflow-hidden`}>
      {/* Background Pattern */}
      <div className="absolute top-0 right-0 w-32 h-32 opacity-5">
        <Plus className="w-full h-full" />
      </div>

      {/* Header with Icon and Priority */}
      <div className="flex items-start justify-between mb-4 relative z-10">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-white shadow-sm">
            <Zap className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <div className="text-sm font-medium text-gray-600">Content Gap</div>
            <div className={`text-xs px-2 py-1 rounded-full font-medium ${getPriorityBadgeColor()}`}>
              {priority === 'high' ? 'High Opportunity' : priority === 'medium' ? 'Good Opportunity' : 'Consider'}
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs text-gray-500">Trending</div>
          <div className="flex items-center space-x-1">
            <TrendingUp className="w-4 h-4 text-green-600" />
            <span className="text-lg font-bold text-green-600">{trendingScore}%</span>
          </div>
        </div>
      </div>

      {/* Gap Topic */}
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        New Content Opportunity: "{gapTopic}"
      </h3>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-white rounded-lg p-3 shadow-sm">
          <div className="text-xs text-gray-500 font-medium">Est. Monthly Volume</div>
          <div className="text-lg font-bold text-gray-900">{searchVolume?.toLocaleString() || 'N/A'}</div>
        </div>
        <div className="bg-white rounded-lg p-3 shadow-sm">
          <div className="text-xs text-gray-500 font-medium">Competitors</div>
          <div className="text-lg font-bold text-gray-900">{competitorCount || 0}</div>
        </div>
      </div>

      {/* Description */}
      <div className="mb-4">
        <p className="text-sm text-gray-700 leading-relaxed">
          {description}
        </p>
      </div>

      {/* Opportunity Highlight */}
      <div className="mb-4 p-3 bg-white rounded-lg border border-green-200">
        <div className="flex items-start space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
          <div>
            <div className="text-xs font-medium text-green-700 uppercase tracking-wide">Opportunity</div>
            <p className="text-sm text-green-800 font-medium">{opportunity}</p>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <button
        onClick={() => onGenerateBrief(insight)}
        className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 transition-all duration-200 flex items-center justify-center space-x-2 group shadow-sm"
      >
        <Plus className="w-4 h-4" />
        <span>Generate Content Brief</span>
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
      </button>
    </div>
  );
};

export default GapInsightCard;