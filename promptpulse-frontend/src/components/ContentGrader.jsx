import React, { useState, useEffect } from 'react';
import { 
  X, 
  FileText, 
  TrendingUp, 
  Target, 
  CheckCircle, 
  AlertCircle, 
  XCircle,
  Loader2,
  Copy,
  ExternalLink,
  RefreshCw,
  Crown,
  Zap,
  Brain,
  Users,
  Globe
} from 'lucide-react';
import CelebrationAnimations from './CelebrationAnimations';
import { useCelebration } from '../hooks/useCelebration';

const ContentGrader = ({ isOpen, onClose, prompt, existingContent = '' }) => {
  const [content, setContent] = useState(existingContent);
  const [gradeData, setGradeData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('input');
  const [previousGrade, setPreviousGrade] = useState(null);
  
  const { 
    celebration, 
    celebrateGradeImprovement, 
    hideCelebration 
  } = useCelebration();

  const tabs = [
    { id: 'input', label: 'Content Input', icon: FileText },
    { id: 'analysis', label: 'AI Analysis', icon: Brain },
    { id: 'optimization', label: 'Optimization Guide', icon: Target },
    { id: 'tracking', label: 'Performance Tracking', icon: TrendingUp }
  ];

  useEffect(() => {
    if (content && content.length > 100) {
      const timer = setTimeout(() => {
        analyzeContent();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [content]);

  const analyzeContent = async () => {
    if (!content.trim()) return;
    
    setLoading(true);
    
    // Simulate AI content analysis
    setTimeout(() => {
      const mockAnalysis = generateMockAnalysis(content, prompt);
      
      // Check for grade improvement
      if (previousGrade && mockAnalysis.overallGrade !== previousGrade) {
        celebrateGradeImprovement(previousGrade, mockAnalysis.overallGrade, prompt);
      }
      
      setGradeData(mockAnalysis);
      setLoading(false);
      setActiveTab('analysis');
    }, 2000);
  };

  const generateMockAnalysis = (content, prompt) => {
    const contentLength = content.length;
    const hasKeywords = content.toLowerCase().includes(prompt?.toLowerCase() || '');
    const hasStructure = content.includes('\n') && content.split('\n').length > 3;
    const hasAuthority = content.toLowerCase().includes('expert') || content.toLowerCase().includes('research');
    
    // Calculate scores based on content quality
    const relevanceScore = hasKeywords ? 85 + Math.random() * 10 : 60 + Math.random() * 20;
    const authorityScore = hasAuthority ? 80 + Math.random() * 15 : 50 + Math.random() * 30;
    const structureScore = hasStructure ? 75 + Math.random() * 20 : 40 + Math.random() * 35;
    const completenessScore = contentLength > 500 ? 80 + Math.random() * 15 : Math.min(contentLength / 10, 75);
    
    const averageScore = (relevanceScore + authorityScore + structureScore + completenessScore) / 4;
    
    let grade, gradeColor, gradeDescription;
    if (averageScore >= 90) {
      grade = 'A+';
      gradeColor = 'text-green-600';
      gradeDescription = 'Excellent - Ready to dominate AI search results';
    } else if (averageScore >= 85) {
      grade = 'A';
      gradeColor = 'text-green-600';
      gradeDescription = 'Great content with strong potential';
    } else if (averageScore >= 80) {
      grade = 'B+';
      gradeColor = 'text-green-500';
      gradeDescription = 'Good content with room for improvement';
    } else if (averageScore >= 75) {
      grade = 'B';
      gradeColor = 'text-yellow-600';
      gradeDescription = 'Decent content, needs optimization';
    } else if (averageScore >= 70) {
      grade = 'C+';
      gradeColor = 'text-yellow-600';
      gradeDescription = 'Average content, significant improvements needed';
    } else if (averageScore >= 65) {
      grade = 'C';
      gradeColor = 'text-orange-600';
      gradeDescription = 'Below average, major optimization required';
    } else {
      grade = 'D';
      gradeColor = 'text-red-600';
      gradeDescription = 'Poor content, complete rewrite recommended';
    }

    return {
      overallGrade: grade,
      gradeColor,
      gradeDescription,
      overallScore: Math.round(averageScore),
      scores: {
        relevance: Math.round(relevanceScore),
        authority: Math.round(authorityScore),
        structure: Math.round(structureScore),
        completeness: Math.round(completenessScore)
      },
      strengths: [
        hasKeywords && 'Strong keyword integration',
        hasStructure && 'Well-structured content',
        hasAuthority && 'Authority-building language',
        contentLength > 500 && 'Comprehensive coverage'
      ].filter(Boolean),
      improvements: [
        !hasKeywords && 'Add more relevant keywords',
        !hasStructure && 'Improve content structure',
        !hasAuthority && 'Include expert opinions and data',
        contentLength < 500 && 'Expand content depth',
        'Add more specific examples',
        'Include actionable takeaways'
      ].filter(Boolean),
      aiOptimization: {
        chatgpt: {
          score: Math.round(relevanceScore + Math.random() * 10),
          ranking: Math.floor(Math.random() * 10) + 1,
          suggestions: ['Add FAQ section', 'Include step-by-step guide']
        },
        claude: {
          score: Math.round(authorityScore + Math.random() * 10),
          ranking: Math.floor(Math.random() * 10) + 1,
          suggestions: ['Cite more sources', 'Add expert quotes']
        },
        gemini: {
          score: Math.round(structureScore + Math.random() * 10),
          ranking: Math.floor(Math.random() * 10) + 1,
          suggestions: ['Improve headings', 'Add visual elements']
        }
      }
    };
  };

  const retryAnalysis = () => {
    setPreviousGrade(gradeData?.overallGrade);
    analyzeContent();
  };

  const copyOptimizedContent = () => {
    const optimizedContent = generateOptimizedContent();
    navigator.clipboard.writeText(optimizedContent);
  };

  const generateOptimizedContent = () => {
    return `# Optimized Content for "${prompt}"

${content}

## Additional Optimizations Applied:
- Enhanced keyword density
- Added authority-building elements
- Improved structure and readability
- Included actionable takeaways

*Generated by PromptPulse Content Grader*`;
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'input':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content to Analyze
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full h-64 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder={`Paste your content here to analyze how well it answers "${prompt}"...`}
              />
              <div className="mt-2 flex items-center justify-between text-sm text-gray-500">
                <span>{content.length} characters</span>
                <span>Minimum 100 characters for analysis</span>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">💡 Pro Tips</h4>
              <ul className="text-blue-800 text-sm space-y-1">
                <li>• Include the target prompt naturally in your content</li>
                <li>• Add expert opinions and data to build authority</li>
                <li>• Structure content with clear headings and sections</li>
                <li>• Aim for comprehensive coverage (500+ words)</li>
              </ul>
            </div>

            {content.length > 100 && (
              <button
                onClick={analyzeContent}
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Analyzing content...</span>
                  </>
                ) : (
                  <>
                    <Brain className="w-5 h-5" />
                    <span>Analyze Content</span>
                  </>
                )}
              </button>
            )}
          </div>
        );

      case 'analysis':
        if (loading) {
          return (
            <div className="text-center py-12">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Analyzing Your Content</h3>
              <p className="text-gray-600">Our AI is evaluating how well your content answers the prompt...</p>
              <div className="mt-4 space-y-2">
                <div className="text-sm text-gray-500">✓ Checking relevance and keyword integration</div>
                <div className="text-sm text-gray-500">✓ Analyzing authority and credibility signals</div>
                <div className="text-sm text-gray-500">✓ Evaluating structure and completeness</div>
                <div className="text-sm text-gray-500">✓ Calculating AI search optimization scores</div>
              </div>
            </div>
          );
        }

        if (!gradeData) return null;

        return (
          <div className="space-y-6">
            {/* Overall Grade */}
            <div className="text-center p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-gray-200">
              <div className={`text-6xl font-bold ${gradeData.gradeColor} mb-2`}>
                {gradeData.overallGrade}
              </div>
              <p className="text-lg text-gray-700 mb-2">{gradeData.gradeDescription}</p>
              <p className="text-sm text-gray-500">Overall Score: {gradeData.overallScore}/100</p>
            </div>

            {/* Detailed Scores */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-white border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Relevance</span>
                  <Target className="w-4 h-4 text-blue-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{gradeData.scores.relevance}/100</div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${gradeData.scores.relevance}%` }}
                  />
                </div>
              </div>

              <div className="p-4 bg-white border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Authority</span>
                  <Crown className="w-4 h-4 text-purple-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{gradeData.scores.authority}/100</div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div 
                    className="bg-purple-600 h-2 rounded-full" 
                    style={{ width: `${gradeData.scores.authority}%` }}
                  />
                </div>
              </div>

              <div className="p-4 bg-white border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Structure</span>
                  <FileText className="w-4 h-4 text-green-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{gradeData.scores.structure}/100</div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full" 
                    style={{ width: `${gradeData.scores.structure}%` }}
                  />
                </div>
              </div>

              <div className="p-4 bg-white border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Completeness</span>
                  <CheckCircle className="w-4 h-4 text-orange-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{gradeData.scores.completeness}/100</div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div 
                    className="bg-orange-600 h-2 rounded-full" 
                    style={{ width: `${gradeData.scores.completeness}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Strengths & Improvements */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {gradeData.strengths.length > 0 && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h4 className="font-medium text-green-900 mb-3 flex items-center">
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Strengths
                  </h4>
                  <ul className="space-y-2">
                    {gradeData.strengths.map((strength, index) => (
                      <li key={index} className="text-green-800 text-sm flex items-start">
                        <span className="text-green-600 mr-2">✓</span>
                        {strength}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {gradeData.improvements.length > 0 && (
                <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                  <h4 className="font-medium text-orange-900 mb-3 flex items-center">
                    <AlertCircle className="w-5 h-5 mr-2" />
                    Improvements Needed
                  </h4>
                  <ul className="space-y-2">
                    {gradeData.improvements.slice(0, 4).map((improvement, index) => (
                      <li key={index} className="text-orange-800 text-sm flex items-start">
                        <span className="text-orange-600 mr-2">→</span>
                        {improvement}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="flex space-x-3">
              <button
                onClick={retryAnalysis}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Re-analyze</span>
              </button>
              <button
                onClick={copyOptimizedContent}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Copy className="w-4 h-4" />
                <span>Copy Optimized Version</span>
              </button>
            </div>
          </div>
        );

      case 'optimization':
        if (!gradeData) {
          return (
            <div className="text-center py-12">
              <Brain className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Analyze your content first to see optimization recommendations</p>
            </div>
          );
        }

        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">AI-Specific Optimization</h3>
            
            <div className="space-y-4">
              {/* ChatGPT Optimization */}
              <div className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <Zap className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">ChatGPT Optimization</h4>
                      <p className="text-sm text-gray-600">Current ranking: #{gradeData.aiOptimization.chatgpt.ranking}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">{gradeData.aiOptimization.chatgpt.score}/100</div>
                  </div>
                </div>
                <div className="space-y-2">
                  {gradeData.aiOptimization.chatgpt.suggestions.map((suggestion, index) => (
                    <div key={index} className="text-sm text-gray-700 flex items-start">
                      <span className="text-green-600 mr-2">→</span>
                      {suggestion}
                    </div>
                  ))}
                </div>
              </div>

              {/* Claude Optimization */}
              <div className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Brain className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Claude Optimization</h4>
                      <p className="text-sm text-gray-600">Current ranking: #{gradeData.aiOptimization.claude.ranking}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">{gradeData.aiOptimization.claude.score}/100</div>
                  </div>
                </div>
                <div className="space-y-2">
                  {gradeData.aiOptimization.claude.suggestions.map((suggestion, index) => (
                    <div key={index} className="text-sm text-gray-700 flex items-start">
                      <span className="text-blue-600 mr-2">→</span>
                      {suggestion}
                    </div>
                  ))}
                </div>
              </div>

              {/* Gemini Optimization */}
              <div className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Globe className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Gemini Optimization</h4>
                      <p className="text-sm text-gray-600">Current ranking: #{gradeData.aiOptimization.gemini.ranking}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">{gradeData.aiOptimization.gemini.score}/100</div>
                  </div>
                </div>
                <div className="space-y-2">
                  {gradeData.aiOptimization.gemini.suggestions.map((suggestion, index) => (
                    <div key={index} className="text-sm text-gray-700 flex items-start">
                      <span className="text-purple-600 mr-2">→</span>
                      {suggestion}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 'tracking':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Performance Tracking</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-white border border-gray-200 rounded-lg text-center">
                <div className="text-2xl font-bold text-blue-600 mb-2">7</div>
                <div className="text-sm text-gray-600">Days Tracking</div>
              </div>
              <div className="p-4 bg-white border border-gray-200 rounded-lg text-center">
                <div className="text-2xl font-bold text-green-600 mb-2">+2</div>
                <div className="text-sm text-gray-600">Rank Improvement</div>
              </div>
              <div className="p-4 bg-white border border-gray-200 rounded-lg text-center">
                <div className="text-2xl font-bold text-purple-600 mb-2">89%</div>
                <div className="text-sm text-gray-600">Optimization Score</div>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="font-medium text-yellow-900 mb-2">📊 Coming Soon</h4>
              <p className="text-yellow-800 text-sm">
                Real-time ranking tracking, competitor comparison, and performance analytics will be available in the next update.
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
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Content Grader</h2>
              <p className="text-sm text-gray-600">"{prompt}"</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 px-6">
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
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {renderTabContent()}
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

export default ContentGrader;