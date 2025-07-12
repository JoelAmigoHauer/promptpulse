import React from 'react';
import { Trophy, Star, ArrowRight, Sparkles } from 'lucide-react';

const WinInsightCard = ({ insight, onViewPerformance }) => {
  const {
    achievement,
    targetPrompt,
    rank,
    previousRank,
    visibilityScore,
    mentionsIncrease,
    description,
    celebrationLevel = 'major'
  } = insight;

  const getCelebrationStyle = () => {
    switch (celebrationLevel) {
      case 'major': return 'border-yellow-200 bg-gradient-to-br from-yellow-50 to-orange-50';
      case 'milestone': return 'border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50';
      default: return 'border-green-200 bg-gradient-to-br from-green-50 to-emerald-50';
    }
  };

  const getCelebrationIcon = () => {
    switch (celebrationLevel) {
      case 'major': return <Trophy className="w-6 h-6 text-yellow-600" />;
      case 'milestone': return <Star className="w-6 h-6 text-blue-600" />;
      default: return <Sparkles className="w-6 h-6 text-green-600" />;
    }
  };

  const getCelebrationBadge = () => {
    switch (celebrationLevel) {
      case 'major': return 'bg-yellow-100 text-yellow-800';
      case 'milestone': return 'bg-blue-100 text-blue-800';
      default: return 'bg-green-100 text-green-800';
    }
  };

  return (
    <div className={`p-6 rounded-lg border-2 ${getCelebrationStyle()} hover:shadow-lg transition-all duration-200 relative overflow-hidden`}>
      {/* Celebration Background */}
      <div className="absolute top-0 right-0 w-40 h-40 opacity-10">
        <Trophy className="w-full h-full" />
      </div>

      {/* Header with Achievement Badge */}
      <div className="flex items-start justify-between mb-4 relative z-10">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-white shadow-sm">
            {getCelebrationIcon()}
          </div>
          <div>
            <div className="text-sm font-medium text-gray-600">Achievement</div>
            <div className={`text-xs px-2 py-1 rounded-full font-medium ${getCelebrationBadge()}`}>
              {celebrationLevel === 'major' ? '🎉 Major Win' : 
               celebrationLevel === 'milestone' ? '⭐ Milestone' : 
               '✨ Success'}
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs text-gray-500">Rank</div>
          <div className="flex items-center space-x-1">
            <span className="text-3xl font-bold text-yellow-600">#{rank}</span>
            {previousRank && previousRank !== rank && (
              <>
                <ArrowRight className="w-4 h-4 text-gray-400 rotate-45" />
                <span className="text-sm text-gray-500 line-through">#{previousRank}</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Achievement Title */}
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        🎊 Congratulations! {achievement}
      </h3>

      {/* Target Prompt */}
      <div className="mb-3">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Winning Prompt</span>
        <p className="text-sm text-gray-700 font-medium mt-1">"{targetPrompt}"</p>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-white rounded-lg p-3 shadow-sm border border-yellow-200">
          <div className="text-xs text-gray-500 font-medium">Visibility Score</div>
          <div className="text-lg font-bold text-yellow-600">{visibilityScore}%</div>
        </div>
        <div className="bg-white rounded-lg p-3 shadow-sm border border-green-200">
          <div className="text-xs text-gray-500 font-medium">Mentions +</div>
          <div className="text-lg font-bold text-green-600">{mentionsIncrease}%</div>
        </div>
      </div>

      {/* Success Description */}
      <div className="mb-4">
        <p className="text-sm text-gray-700 leading-relaxed">
          {description}
        </p>
      </div>

      {/* Success Highlight */}
      <div className="mb-4 p-3 bg-white rounded-lg border border-yellow-200">
        <div className="flex items-start space-x-2">
          <Star className="w-4 h-4 text-yellow-600 mt-0.5" />
          <div>
            <div className="text-xs font-medium text-yellow-700 uppercase tracking-wide">Impact</div>
            <p className="text-sm text-yellow-800 font-medium">
              You're now the top-cited source for this prompt across all major AI platforms
            </p>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <button
        onClick={() => onViewPerformance(insight)}
        className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-4 rounded-lg font-medium hover:from-yellow-600 hover:to-orange-600 transition-all duration-200 flex items-center justify-center space-x-2 group shadow-sm"
      >
        <Trophy className="w-4 h-4" />
        <span>View Performance Details</span>
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
      </button>
    </div>
  );
};

export default WinInsightCard;