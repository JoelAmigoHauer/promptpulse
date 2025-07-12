import React from 'react';
import { Plus, ArrowRight, Target, TrendingUp } from 'lucide-react';
import { QuickChallengeButton } from './ChallengeCompetitorButton';

const ContentGapCard = ({ gap, onGenerateBrief }) => {
  const {
    prompt,
    priority = 'high',
    searchVolume,
    competitorCount,
    opportunity,
    description
  } = gap;

  const getPriorityColor = () => {
    switch (priority) {
      case 'high': return 'border-blue-200 bg-blue-50';
      case 'medium': return 'border-green-200 bg-green-50';
      default: return 'border-purple-200 bg-purple-50';
    }
  };

  const getPriorityBadgeColor = () => {
    switch (priority) {
      case 'high': return 'bg-blue-100 text-blue-800';
      case 'medium': return 'bg-green-100 text-green-800';
      default: return 'bg-purple-100 text-purple-800';
    }
  };

  const getPriorityText = () => {
    switch (priority) {
      case 'high': return 'High Priority';
      case 'medium': return 'Medium Priority';
      default: return 'Low Priority';
    }
  };

  return (
    <div className={`p-6 rounded-lg border-2 ${getPriorityColor()} hover:shadow-lg transition-all duration-200 relative overflow-hidden`}>
      {/* Background Plus Icon */}
      <div className="absolute top-0 right-0 w-32 h-32 opacity-5">
        <Plus className="w-full h-full" />
      </div>

      {/* Header */}
      <div className="flex items-start justify-between mb-4 relative z-10">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-white shadow-sm">
            <Plus className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <div className="text-sm font-medium text-gray-600">Content Gap</div>
            <div className={`text-xs px-2 py-1 rounded-full font-medium ${getPriorityBadgeColor()}`}>
              {getPriorityText()}
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs text-gray-500">Authority</div>
          <div className="flex items-center space-x-1">
            <Target className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-bold text-blue-600">Builder</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Content Gap: "{prompt}"
        </h3>
        <p className="text-sm text-gray-700 leading-relaxed">
          {description || `This is a high-priority prompt to establish your authority.`}
        </p>
      </div>

      {/* Metrics */}
      {(searchVolume || competitorCount) && (
        <div className="grid grid-cols-2 gap-4 mb-4">
          {searchVolume && (
            <div className="bg-white rounded-lg p-3 shadow-sm">
              <div className="text-xs text-gray-500 font-medium">Monthly Volume</div>
              <div className="text-lg font-bold text-gray-900">{searchVolume?.toLocaleString()}</div>
            </div>
          )}
          {competitorCount !== undefined && (
            <div className="bg-white rounded-lg p-3 shadow-sm">
              <div className="text-xs text-gray-500 font-medium">Competitors</div>
              <div className="text-lg font-bold text-gray-900">{competitorCount}</div>
            </div>
          )}
        </div>
      )}

      {/* Opportunity Highlight */}
      {opportunity && (
        <div className="mb-4 p-3 bg-white rounded-lg border border-blue-200">
          <div className="flex items-start space-x-2">
            <TrendingUp className="w-4 h-4 text-blue-600 mt-0.5" />
            <div>
              <div className="text-xs font-medium text-blue-700 uppercase tracking-wide">Opportunity</div>
              <p className="text-sm text-blue-800 font-medium">{opportunity}</p>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="space-y-3">
        <button
          onClick={() => onGenerateBrief(gap)}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-all duration-200 flex items-center justify-center space-x-2 group shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Generate Content Brief</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
        </button>
        
        {/* Challenge Competitor Button */}
        <div className="flex justify-center">
          <QuickChallengeButton
            competitor="Top Competitor"
            prompt={prompt}
            onChallenge={(challengeData) => {
              console.log('Content gap challenge:', challengeData);
              // This could trigger the content creation workflow
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ContentGapCard;