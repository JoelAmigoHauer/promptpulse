import React from 'react';
import { TrendingDown, ArrowRight, AlertTriangle } from 'lucide-react';

const OptimizationInsightCard = ({ insight, onGenerateBrief }) => {
  const {
    title,
    currentRank,
    previousRank,
    targetPrompt,
    issueType,
    description,
    urgency = 'medium'
  } = insight;

  const getUrgencyColor = () => {
    switch (urgency) {
      case 'high': return 'border-red-200 bg-red-50';
      case 'medium': return 'border-orange-200 bg-orange-50';
      default: return 'border-yellow-200 bg-yellow-50';
    }
  };

  const getUrgencyIconColor = () => {
    switch (urgency) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-orange-600';
      default: return 'text-yellow-600';
    }
  };

  return (
    <div className={`p-6 rounded-lg border-2 ${getUrgencyColor()} hover:shadow-lg transition-all duration-200`}>
      {/* Header with Icon and Urgency */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg bg-white shadow-sm ${getUrgencyIconColor()}`}>
            <TrendingDown className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm font-medium text-gray-600">Content Optimization</div>
            <div className={`text-xs px-2 py-1 rounded-full font-medium ${
              urgency === 'high' ? 'bg-red-100 text-red-800' :
              urgency === 'medium' ? 'bg-orange-100 text-orange-800' :
              'bg-yellow-100 text-yellow-800'
            }`}>
              {urgency === 'high' ? 'Urgent' : urgency === 'medium' ? 'Important' : 'Monitor'}
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs text-gray-500">Current Rank</div>
          <div className="flex items-center space-x-1">
            <span className="text-2xl font-bold text-gray-900">#{currentRank}</span>
            <ArrowRight className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-500">#{previousRank}</span>
          </div>
        </div>
      </div>

      {/* Content Title */}
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {title}
      </h3>

      {/* Target Prompt */}
      <div className="mb-3">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Target Prompt</span>
        <p className="text-sm text-gray-700 font-medium mt-1">"{targetPrompt}"</p>
      </div>

      {/* Issue Description */}
      <div className="mb-4">
        <div className="flex items-start space-x-2">
          <AlertTriangle className={`w-4 h-4 mt-0.5 ${getUrgencyIconColor()}`} />
          <p className="text-sm text-gray-700 leading-relaxed">
            {description}
          </p>
        </div>
      </div>

      {/* Action Button */}
      <button
        onClick={() => onGenerateBrief(insight)}
        className="w-full bg-white border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 flex items-center justify-center space-x-2 group"
      >
        <span>Generate Optimization Brief</span>
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
      </button>
    </div>
  );
};

export default OptimizationInsightCard;