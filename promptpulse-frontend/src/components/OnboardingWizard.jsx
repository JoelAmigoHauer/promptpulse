import React, { useState, useEffect } from 'react';
import { 
  ChevronRight, 
  ChevronLeft, 
  Check, 
  Building2, 
  Users, 
  Target, 
  Zap, 
  Brain,
  Loader2,
  Plus,
  X,
  Search,
  TrendingUp,
  Globe,
  Crown
} from 'lucide-react';
import CelebrationAnimations from './CelebrationAnimations';
import { useCelebration } from '../hooks/useCelebration';

const OnboardingWizard = ({ isOpen, onComplete, onSkip }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    brandName: '',
    brandDescription: '',
    industry: '',
    website: '',
    competitors: [],
    targetAudience: '',
    primaryGoals: []
  });
  const [loading, setLoading] = useState(false);
  const [discoveredPrompts, setDiscoveredPrompts] = useState([]);
  const [selectedPrompts, setSelectedPrompts] = useState([]);
  const [competitorInput, setCompetitorInput] = useState('');
  
  const { 
    celebration, 
    celebrateFirstWin, 
    hideCelebration 
  } = useCelebration();

  const steps = [
    {
      number: 1,
      title: "Tell us about your brand",
      description: "Help us understand your business so we can create a tailored AEO strategy",
      icon: Building2
    },
    {
      number: 2, 
      title: "Identify your competitors",
      description: "We'll analyze your competitive landscape to find content opportunities",
      icon: Users
    },
    {
      number: 3,
      title: "Discover content opportunities", 
      description: "Our AI will find high-value prompts where you can establish authority",
      icon: Brain
    },
    {
      number: 4,
      title: "Review your strategy",
      description: "Confirm your AEO game plan and start dominating AI search results",
      icon: Target
    }
  ];

  const industries = [
    'Automotive', 'Technology', 'Healthcare', 'Finance', 'Retail', 
    'Real Estate', 'Education', 'Manufacturing', 'Energy', 'Other'
  ];

  const goalOptions = [
    { id: 'brand-awareness', label: 'Increase Brand Awareness', icon: Globe },
    { id: 'lead-generation', label: 'Generate More Leads', icon: TrendingUp },
    { id: 'thought-leadership', label: 'Establish Thought Leadership', icon: Crown },
    { id: 'competitive-advantage', label: 'Gain Competitive Advantage', icon: Zap }
  ];

  useEffect(() => {
    if (currentStep === 3 && formData.brandName && formData.competitors.length > 0) {
      discoverPrompts();
    }
  }, [currentStep, formData.brandName, formData.competitors]);

  const discoverPrompts = async () => {
    setLoading(true);
    
    // Simulate AI-powered prompt discovery
    setTimeout(() => {
      const mockPrompts = [
        {
          id: 1,
          prompt: `${formData.brandName} vs ${formData.competitors[0]?.name || 'competitors'}`,
          opportunity: 'High-value comparison content',
          searchVolume: 15400,
          competitorCount: 2,
          priority: 'high',
          rationale: 'Direct comparison queries have high conversion potential'
        },
        {
          id: 2,
          prompt: `best ${formData.industry?.toLowerCase()} solutions`,
          opportunity: 'Industry authority building',
          searchVolume: 22100,
          competitorCount: 5,
          priority: 'high',
          rationale: 'Establish yourself as the go-to expert in your industry'
        },
        {
          id: 3,
          prompt: `${formData.brandName} pricing`,
          opportunity: 'Address pricing concerns proactively',
          searchVolume: 8900,
          competitorCount: 3,
          priority: 'medium',
          rationale: 'Control the pricing narrative before competitors do'
        },
        {
          id: 4,
          prompt: `${formData.industry?.toLowerCase()} trends 2024`,
          opportunity: 'Thought leadership content',
          searchVolume: 12300,
          competitorCount: 4,
          priority: 'medium',
          rationale: 'Position as forward-thinking industry leader'
        },
        {
          id: 5,
          prompt: `how to choose ${formData.industry?.toLowerCase()} provider`,
          opportunity: 'Educational content that drives leads',
          searchVolume: 18700,
          competitorCount: 6,
          priority: 'high',
          rationale: 'Guide prospects through decision-making process'
        }
      ];
      
      setDiscoveredPrompts(mockPrompts);
      setSelectedPrompts(mockPrompts.filter(p => p.priority === 'high').map(p => p.id));
      setLoading(false);
    }, 3000);
  };

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    } else {
      completeOnboarding();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const addCompetitor = () => {
    if (competitorInput.trim()) {
      setFormData(prev => ({
        ...prev,
        competitors: [...prev.competitors, { 
          name: competitorInput.trim(),
          id: Date.now()
        }]
      }));
      setCompetitorInput('');
    }
  };

  const removeCompetitor = (id) => {
    setFormData(prev => ({
      ...prev,
      competitors: prev.competitors.filter(comp => comp.id !== id)
    }));
  };

  const togglePromptSelection = (promptId) => {
    setSelectedPrompts(prev => 
      prev.includes(promptId) 
        ? prev.filter(id => id !== promptId)
        : [...prev, promptId]
    );
  };

  const toggleGoal = (goalId) => {
    setFormData(prev => ({
      ...prev,
      primaryGoals: prev.primaryGoals.includes(goalId)
        ? prev.primaryGoals.filter(id => id !== goalId)
        : [...prev.primaryGoals, goalId]
    }));
  };

  const completeOnboarding = () => {
    const onboardingData = {
      ...formData,
      selectedPrompts: discoveredPrompts.filter(p => selectedPrompts.includes(p.id)),
      completedAt: new Date()
    };
    
    // Trigger celebration
    celebrateFirstWin();
    
    // Complete onboarding after celebration
    setTimeout(() => {
      onComplete(onboardingData);
    }, 2000);
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.brandName && formData.industry;
      case 2:
        return formData.competitors.length > 0;
      case 3:
        return selectedPrompts.length > 0;
      case 4:
        return formData.primaryGoals.length > 0;
      default:
        return true;
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Brand Name *
              </label>
              <input
                type="text"
                value={formData.brandName}
                onChange={(e) => setFormData(prev => ({ ...prev, brandName: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Tesla, Apple, Microsoft"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Industry *
              </label>
              <select
                value={formData.industry}
                onChange={(e) => setFormData(prev => ({ ...prev, industry: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select your industry</option>
                {industries.map(industry => (
                  <option key={industry} value={industry}>{industry}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Brief Description
              </label>
              <textarea
                value={formData.brandDescription}
                onChange={(e) => setFormData(prev => ({ ...prev, brandDescription: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
                placeholder="What does your company do? What makes you unique?"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Website URL
              </label>
              <input
                type="url"
                value={formData.website}
                onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://your-website.com"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Add Competitors
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={competitorInput}
                  onChange={(e) => setCompetitorInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addCompetitor()}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter competitor name"
                />
                <button
                  onClick={addCompetitor}
                  className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>

            {formData.competitors.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Your Competitors:</h4>
                <div className="space-y-2">
                  {formData.competitors.map((competitor) => (
                    <div
                      key={competitor.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <span className="font-medium">{competitor.name}</span>
                      <button
                        onClick={() => removeCompetitor(competitor.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">💡 Tip</h4>
              <p className="text-blue-800 text-sm">
                Add 3-5 of your main competitors. We'll analyze their content strategies to find gaps you can exploit.
              </p>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            {loading ? (
              <div className="text-center py-12">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Discovering Content Opportunities</h3>
                <p className="text-gray-600">Our AI is analyzing your industry and competitors...</p>
                <div className="mt-4 space-y-2">
                  <div className="text-sm text-gray-500">✓ Analyzing competitor content strategies</div>
                  <div className="text-sm text-gray-500">✓ Identifying content gaps</div>
                  <div className="text-sm text-gray-500">✓ Calculating opportunity scores</div>
                </div>
              </div>
            ) : (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  AI-Discovered Content Opportunities
                </h3>
                <p className="text-gray-600 mb-6">
                  Select the prompts you want to target first. We recommend starting with high-priority opportunities.
                </p>
                
                <div className="space-y-4">
                  {discoveredPrompts.map((prompt) => (
                    <div
                      key={prompt.id}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        selectedPrompts.includes(prompt.id)
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => togglePromptSelection(prompt.id)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h4 className="font-semibold text-gray-900">"{prompt.prompt}"</h4>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              prompt.priority === 'high' 
                                ? 'bg-red-100 text-red-800' 
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {prompt.priority} priority
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-3">{prompt.opportunity}</p>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-gray-500">Search Volume:</span>
                              <span className="font-medium ml-1">{prompt.searchVolume?.toLocaleString()}</span>
                            </div>
                            <div>
                              <span className="text-gray-500">Competitors:</span>
                              <span className="font-medium ml-1">{prompt.competitorCount}</span>
                            </div>
                          </div>
                          <div className="mt-2 p-2 bg-gray-50 rounded text-xs text-gray-600">
                            <strong>Why this matters:</strong> {prompt.rationale}
                          </div>
                        </div>
                        <div className="ml-4">
                          {selectedPrompts.includes(prompt.id) && (
                            <Check className="w-5 h-5 text-blue-600" />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                What are your primary goals?
              </h3>
              <p className="text-gray-600 mb-6">
                Select your main objectives so we can prioritize the right strategies for you.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {goalOptions.map((goal) => {
                  const Icon = goal.icon;
                  return (
                    <div
                      key={goal.id}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        formData.primaryGoals.includes(goal.id)
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => toggleGoal(goal.id)}
                    >
                      <div className="flex items-center space-x-3">
                        <Icon className={`w-6 h-6 ${
                          formData.primaryGoals.includes(goal.id) ? 'text-blue-600' : 'text-gray-400'
                        }`} />
                        <span className="font-medium">{goal.label}</span>
                        {formData.primaryGoals.includes(goal.id) && (
                          <Check className="w-5 h-5 text-blue-600 ml-auto" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h4 className="font-semibold text-green-900 mb-3">🎉 You're All Set!</h4>
              <div className="space-y-2 text-sm text-green-800">
                <div>✓ Brand: <strong>{formData.brandName}</strong></div>
                <div>✓ Industry: <strong>{formData.industry}</strong></div>
                <div>✓ Competitors: <strong>{formData.competitors.length}</strong></div>
                <div>✓ Target Prompts: <strong>{selectedPrompts.length}</strong></div>
                <div>✓ Goals: <strong>{formData.primaryGoals.length}</strong></div>
              </div>
              <p className="mt-3 text-green-700">
                Ready to dominate AI search results? Let's start building your authority!
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Welcome to PromptPulse</h1>
            <p className="text-gray-600">Let's set up your AEO strategy in 4 simple steps</p>
          </div>
          <button
            onClick={onSkip}
            className="text-gray-400 hover:text-gray-600"
          >
            Skip Setup
          </button>
        </div>

        {/* Progress Bar */}
        <div className="px-6 py-4">
          <div className="flex items-center space-x-4">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={step.number} className="flex items-center">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                    currentStep >= step.number
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}>
                    {currentStep > step.number ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <Icon className="w-5 h-5" />
                    )}
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-16 h-1 mx-2 ${
                      currentStep > step.number ? 'bg-blue-600' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
          <div className="mt-3">
            <h2 className="text-lg font-semibold text-gray-900">
              {steps[currentStep - 1]?.title}
            </h2>
            <p className="text-gray-600">
              {steps[currentStep - 1]?.description}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {renderStepContent()}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <span className="text-sm text-gray-500">
            Step {currentStep} of {steps.length}
          </span>

          <button
            onClick={handleNext}
            disabled={!canProceed() || loading}
            className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>{currentStep === steps.length ? 'Complete Setup' : 'Next'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Celebration Animation */}
      <CelebrationAnimations
        isVisible={celebration.isVisible}
        type={celebration.type}
        onComplete={hideCelebration}
        {...celebration.data}
      />
    </div>
  );
};

export default OnboardingWizard;