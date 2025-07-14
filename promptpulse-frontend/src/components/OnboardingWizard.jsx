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
import { discoverCompetitors, discoverPrompts, extractBrandInfo } from '../services/api';

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
  const [competitorDiscoveryLoading, setCompetitorDiscoveryLoading] = useState(false);
  const [discoveredCompetitors, setDiscoveredCompetitors] = useState([]);
  const [selectedCompetitorUrls, setSelectedCompetitorUrls] = useState([]);
  // Add state for brand info loading
  const [brandInfoLoading, setBrandInfoLoading] = useState(false);
  
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
    if (currentStep === 3 && formData.website && selectedCompetitorUrls.length > 0) {
      fetchPrompts();
    }
  }, [currentStep, formData.website, selectedCompetitorUrls]);

  // Add this useEffect to sync selectedCompetitorUrls with formData.competitors when entering step 2
  useEffect(() => {
    if (currentStep === 2) {
      // If formData.competitors is not empty and selectedCompetitorUrls is empty, restore from formData
      if (formData.competitors && formData.competitors.length > 0 && selectedCompetitorUrls.length === 0) {
        setSelectedCompetitorUrls(formData.competitors.map(c => c.url || c));
      }
    }
    // If user goes back to step 1 and changes website, clear competitors
    if (currentStep === 1) {
      // Optionally, you could reset selectedCompetitorUrls if website changes
      // (not implemented here to avoid data loss unless you want it)
    }
  }, [currentStep]);

  const fetchPrompts = async () => {
    setLoading(true);
    try {
      const prompts = await discoverPrompts(formData.website, selectedCompetitorUrls);
      // Map to objects for selection UI, handling prompt objects from backend
      const promptObjs = prompts.map((p, idx) => ({
        id: idx + 1,
        prompt: typeof p === 'string' ? p : p.prompt || '',
        priority: 'high',
        rationale: p.rationale || '',
        competitors: p.competitors || [],
        competitorCount: (p.competitors && p.competitors.length) || 0,
        opportunity: '', // You can add logic to set this if needed
      }));
      setDiscoveredPrompts(promptObjs);
      setSelectedPrompts(promptObjs.slice(0, 5).map(p => p.id));
    } catch (e) {
      setDiscoveredPrompts([]);
      setSelectedPrompts([]);
    }
    setLoading(false);
  };

  const handleNext = async () => {
    if (currentStep === 1) {
      // Discover competitors after website is entered
      setCompetitorDiscoveryLoading(true);
      try {
        const competitors = await discoverCompetitors(formData.website);
        setDiscoveredCompetitors(competitors);
        setSelectedCompetitorUrls(competitors);
      } catch (e) {
        setDiscoveredCompetitors([]);
        setSelectedCompetitorUrls([]);
      }
      setCompetitorDiscoveryLoading(false);
      setCurrentStep(currentStep + 1);
      return;
    }
    if (currentStep === 2) {
      // Save selected competitors as URLs
      setFormData(prev => ({ ...prev, competitors: selectedCompetitorUrls.map(url => ({ url, id: url })) }));
    }
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
    // Validate URL
    try {
      const url = new URL(competitorInput.trim());
      if (!selectedCompetitorUrls.includes(url.href)) {
        setSelectedCompetitorUrls(prev => [...prev, url.href]);
      }
      setCompetitorInput('');
    } catch {
      // Invalid URL, ignore
    }
  };
  const removeCompetitor = (url) => {
    setSelectedCompetitorUrls(prev => prev.filter(u => u !== url));
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
        return selectedCompetitorUrls.length > 0;
      case 3:
        return selectedPrompts.length > 0;
      case 4:
        return formData.primaryGoals.length > 0;
      default:
        return true;
    }
  };

  // Handler for website blur or Next
  const handleWebsiteBlur = async () => {
    if (formData.website && !formData.brandName && !brandInfoLoading) {
      setBrandInfoLoading(true);
      try {
        const info = await extractBrandInfo(formData.website);
        setFormData(prev => ({
          ...prev,
          brandName: info.name || info.brand_name || '',
          industry: info.industry || '',
          brandDescription: info.description || ''
        }));
      } catch (e) {
        // fallback: do nothing
      }
      setBrandInfoLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Website URL
              </label>
              <input
                type="url"
                value={formData.website}
                onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                onBlur={handleWebsiteBlur}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://your-website.com"
              />
              {brandInfoLoading && (
                <div className="text-center py-4">
                  <Loader2 className="w-6 h-6 text-blue-600 animate-spin mx-auto" />
                  <p className="text-sm text-gray-600 mt-2">Extracting brand info...</p>
                </div>
              )}
            </div>

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
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            {competitorDiscoveryLoading ? (
              <div className="text-center py-8">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Identifying Your Top Competitors...</h3>
                <p className="text-gray-600">Our AI is researching direct competitors for your brand.</p>
              </div>
            ) : (
              <>
                {/* Removed discovered competitors checkbox list for less repetition */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Add Another Competitor URL
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="url"
                      value={competitorInput}
                      onChange={(e) => setCompetitorInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addCompetitor()}
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="https://competitor.com"
                    />
                    <button
                      onClick={addCompetitor}
                      className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                {selectedCompetitorUrls.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Your Selected Competitors:</h4>
                    <div className="space-y-2">
                      {selectedCompetitorUrls.map((url) => (
                        <div
                          key={url}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                        >
                          <span className="font-mono text-blue-700">{url}</span>
                          <button
                            onClick={() => removeCompetitor(url)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                  <h4 className="font-medium text-blue-900 mb-2">💡 Tip</h4>
                  <p className="text-blue-800 text-sm">
                    Confirm or add 3-5 of your main competitors. We'll analyze their content strategies to find gaps you can exploit.
                  </p>
                </div>
              </>
            )}
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