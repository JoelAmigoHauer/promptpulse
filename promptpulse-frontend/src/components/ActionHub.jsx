import React, { useState, useEffect } from 'react';
import { Plus, Trophy, Target, ArrowRight, Sparkles, FileText } from 'lucide-react';
import ContentGapCard from './ContentGapCard';
import OptimizationInsightCard from './OptimizationInsightCard';
import WinInsightCard from './WinInsightCard';
import BriefGenerationModal from './BriefGenerationModal';

const isDev = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';

const ActionHub = ({ onboardingData }) => {
  const [activeTab, setActiveTab] = useState('create');
  const [contentGaps, setContentGaps] = useState([]);
  const [optimizations, setOptimizations] = useState([]);
  const [wins, setWins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showBriefModal, setShowBriefModal] = useState(false);
  const [selectedGap, setSelectedGap] = useState(null);

  useEffect(() => {
    if (onboardingData && onboardingData.selectedPrompts) {
      // Map onboardingData.selectedPrompts to contentGaps format
      setContentGaps(onboardingData.selectedPrompts.map((p, idx) => ({
        id: p.id || idx + 1,
        prompt: p.prompt,
        priority: p.priority || 'high',
        searchVolume: p.searchVolume || 10000,
        competitorCount: p.competitorCount || 3,
        opportunity: p.opportunity || '',
        description: p.rationale || '',
      })));
    } else {
      // Fallback to mock data
      setContentGaps([
        {
          id: 1,
          prompt: "how to finance an electric vehicle",
          priority: "high",
          searchVolume: 8900,
          competitorCount: 3,
          opportunity: "Low competition, high search intent",
          description: "This is a high-priority prompt to establish your authority in EV financing."
        },
        {
          id: 2,
          prompt: "electric vehicle tax incentives 2024",
          priority: "high",
          searchVolume: 12400,
          competitorCount: 2,
          opportunity: "Trending topic with government policy changes",
          description: "High-value content opportunity around new tax incentive regulations."
        },
        {
          id: 3,
          prompt: "EV charging station etiquette",
          priority: "medium",
          searchVolume: 5600,
          competitorCount: 1,
          opportunity: "Emerging topic with first-mover advantage",
          description: "Growing concern as EV adoption increases, minimal competition."
        },
        {
          id: 4,
          prompt: "electric vehicle maintenance costs",
          priority: "high",
          searchVolume: 15200,
          competitorCount: 4,
          opportunity: "High volume with room for expert content",
          description: "Key decision factor for EV buyers with technical depth opportunity."
        }
      ]);
    }
  }, [onboardingData]);

  const handleGenerateBrief = (gap) => {
    setSelectedGap(gap);
    setShowBriefModal(true);
  };

  const handleCloseBriefModal = () => {
    setShowBriefModal(false);
    setSelectedGap(null);
  };

  const tabs = [
    {
      id: 'optimize',
      label: 'Optimize',
      icon: Target,
      count: optimizations.length
    },
    {
      id: 'create',
      label: 'Create',
      icon: Plus,
      count: contentGaps.length
    },
    {
      id: 'wins',
      label: 'Wins & Insights',
      icon: Trophy,
      count: wins.length
    }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'optimize':
        return (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Target className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Ready to Optimize Your Content
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
              Once your content is live and we detect it in AI answers, your optimization tasks will appear here. 
              Let's get your first piece created!
            </p>
            <button 
              onClick={() => setActiveTab('create')}
              className="inline-flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span>Go to Create Hub</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        );

      case 'create':
        return (
          <div>
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Content Opportunities
              </h3>
              <p className="text-gray-600">
                High-priority content gaps identified during your onboarding analysis
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {contentGaps.map((gap) => (
                <ContentGapCard
                  key={gap.id}
                  gap={gap}
                  onGenerateBrief={handleGenerateBrief}
                />
              ))}
            </div>
          </div>
        );

      case 'wins':
        return (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Trophy className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Your Wins Are Coming!
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
              As you capture top ranks and earn citations, your wins and performance reports will show up here. 
              Stay focused!
            </p>
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
              <Sparkles className="w-4 h-4" />
              <span>First win unlocks detailed analytics</span>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Your Action Hub</h2>
          <p className="text-gray-600 mt-1">Strategic content opportunities to dominate AI search</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-500">Updated 5 minutes ago</div>
          {isDev && (
            <button
              className="ml-4 px-4 py-2 bg-yellow-100 text-yellow-800 rounded hover:bg-yellow-200 border border-yellow-300 text-xs font-semibold"
              onClick={() => {
                localStorage.removeItem('onboardingComplete');
                window.location.reload();
              }}
            >
              Try Onboarding Again
            </button>
          )}
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  isActive
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{tab.label}</span>
                {tab.count > 0 && (
                  <span className={`inline-flex items-center justify-center px-2 py-1 text-xs font-bold rounded-full ${
                    isActive 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {renderTabContent()}
      </div>

      {/* Brief Generation Modal */}
      <BriefGenerationModal
        isOpen={showBriefModal}
        onClose={handleCloseBriefModal}
        gap={selectedGap}
      />
    </div>
  );
};

export default ActionHub;