import React, { useState, useEffect } from 'react';
import { X, Copy, Download, FileText, Target, Globe, Users, CheckCircle, ExternalLink, Loader2 } from 'lucide-react';
import CelebrationAnimations from './CelebrationAnimations';
import { useCelebration } from '../hooks/useCelebration';

const BriefGenerationModal = ({ isOpen, onClose, gap }) => {
  const [activeTab, setActiveTab] = useState('summary');
  const [briefData, setBriefData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const { 
    celebration, 
    celebrateContentPublished, 
    hideCelebration 
  } = useCelebration();

  const tabs = [
    { id: 'summary', label: 'Executive Summary', icon: FileText },
    { id: 'talking-points', label: 'Key Talking Points', icon: Target },
    { id: 'keywords', label: 'Target Keywords & Entities', icon: Globe },
    { id: 'sources', label: 'Authoritative Sources', icon: Users }
  ];

  useEffect(() => {
    if (isOpen && gap) {
      fetchBriefData();
    }
  }, [isOpen, gap]);

  const fetchBriefData = async () => {
    setLoading(true);
    try {
      // In production, this would call: GET /api/briefs?promptId=${gap.id}
      // For now, we'll simulate the API response
      setTimeout(() => {
        setBriefData({
          summary: {
            title: `Content Brief: "${gap.prompt}"`,
            overview: `This content brief provides strategic guidance for creating authoritative content around "${gap.prompt}" to capture AI search rankings and establish thought leadership in the electric vehicle financing space.`,
            objectives: [
              'Establish Tesla as the definitive authority on EV financing options',
              'Capture top rankings in ChatGPT, Claude, and Gemini for financing queries',
              'Drive qualified leads through educational content strategy'
            ],
            contentType: 'Comprehensive Guide',
            targetWordCount: '2,500-3,500 words',
            primaryGoal: 'Authority Building'
          },
          talkingPoints: [
            {
              point: 'Traditional Auto Loans vs. EV-Specific Financing',
              details: 'Compare conventional financing with specialized EV loan programs, highlighting lower interest rates and government incentives.',
              authority: 'Position Tesla as financing expert with insider knowledge'
            },
            {
              point: 'Federal and State Tax Incentives Breakdown',
              details: 'Detailed explanation of $7,500 federal credit, state rebates, and how financing affects incentive eligibility.',
              authority: 'Demonstrate deep regulatory knowledge and practical application'
            },
            {
              point: 'Leasing vs. Buying Calculation Framework',
              details: 'Provide decision-making framework with real examples and calculator methodology.',
              authority: 'Establish Tesla as analytical and data-driven leader'
            },
            {
              point: 'Credit Score Impact and Optimization',
              details: 'How EV financing decisions affect credit, optimal credit scores for best rates, and improvement strategies.',
              authority: 'Show comprehensive understanding of personal finance'
            }
          ],
          keywords: {
            primary: ['electric vehicle financing', 'EV loan rates', 'Tesla financing options'],
            secondary: ['auto loan for electric car', 'EV lease vs buy', 'electric car tax credit'],
            entities: ['Tesla', 'Federal Tax Credit', 'Bank of America', 'Wells Fargo Auto', 'Credit Score'],
            topics: ['Personal Finance', 'Government Incentives', 'Automotive Industry', 'Clean Energy']
          },
          sources: [
            {
              title: 'IRS Publication 30D - Electric Vehicle Credit',
              url: 'https://www.irs.gov/credits-deductions/individuals/plug-in-electric-drive-vehicle-credit-section-30d',
              authority: 'Government',
              relevance: 'Primary source for federal tax incentive information'
            },
            {
              title: 'Consumer Reports - EV Financing Guide',
              url: 'https://www.consumerreports.org/cars/hybrids-evs/electric-vehicle-financing-guide/',
              authority: 'Consumer Authority',
              relevance: 'Trusted consumer advice on EV financing options'
            },
            {
              title: 'Edmunds True Cost to Own Analysis',
              url: 'https://www.edmunds.com/tco.html',
              authority: 'Automotive Industry',
              relevance: 'Comprehensive cost analysis methodology'
            },
            {
              title: 'Bank of America EV Financing Program',
              url: 'https://www.bankofamerica.com/auto-loans/electric-vehicle-financing/',
              authority: 'Financial Institution',
              relevance: 'Current EV-specific financing products'
            }
          ]
        });
        setLoading(false);
        
        // Trigger celebration when brief is generated
        setTimeout(() => {
          celebrateContentPublished(gap?.prompt || 'content brief');
        }, 500);
      }, 2000);
    } catch (error) {
      console.error('Error fetching brief data:', error);
      setLoading(false);
    }
  };

  const handleCopyBrief = async () => {
    if (!briefData) return;
    
    const briefMarkdown = generateMarkdownBrief();
    
    try {
      await navigator.clipboard.writeText(briefMarkdown);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy brief:', error);
    }
  };

  const generateMarkdownBrief = () => {
    if (!briefData) return '';

    return `# ${briefData.summary.title}

## Executive Summary

${briefData.summary.overview}

**Content Type:** ${briefData.summary.contentType}
**Target Word Count:** ${briefData.summary.targetWordCount}
**Primary Goal:** ${briefData.summary.primaryGoal}

### Objectives
${briefData.summary.objectives.map(obj => `- ${obj}`).join('\n')}

## Key Talking Points

${briefData.talkingPoints.map((point, index) => `
### ${index + 1}. ${point.point}

${point.details}

*Authority Building:* ${point.authority}
`).join('\n')}

## Target Keywords & Entities

### Primary Keywords
${briefData.keywords.primary.map(keyword => `- ${keyword}`).join('\n')}

### Secondary Keywords
${briefData.keywords.secondary.map(keyword => `- ${keyword}`).join('\n')}

### Named Entities
${briefData.keywords.entities.map(entity => `- ${entity}`).join('\n')}

### Topic Areas
${briefData.keywords.topics.map(topic => `- ${topic}`).join('\n')}

## Authoritative Sources

${briefData.sources.map((source, index) => `
### ${index + 1}. ${source.title}
**URL:** ${source.url}
**Authority Type:** ${source.authority}
**Relevance:** ${source.relevance}
`).join('\n')}

---
*Generated by PromptPulse AEO Platform*`;
  };

  const handleDownloadPDF = () => {
    // In production, this would call a PDF generation service
    console.log('Download PDF functionality would be implemented here');
    alert('PDF download functionality coming soon!');
  };

  const renderTabContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Generating your content brief...</p>
            <p className="text-sm text-gray-500 mt-2">Analyzing competitor content and identifying opportunities</p>
          </div>
        </div>
      );
    }

    if (!briefData) return null;

    switch (activeTab) {
      case 'summary':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Overview</h3>
              <p className="text-gray-700 leading-relaxed">{briefData.summary.overview}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-sm font-medium text-blue-800">Content Type</div>
                <div className="text-blue-900 font-semibold">{briefData.summary.contentType}</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-sm font-medium text-green-800">Word Count</div>
                <div className="text-green-900 font-semibold">{briefData.summary.targetWordCount}</div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="text-sm font-medium text-purple-800">Primary Goal</div>
                <div className="text-purple-900 font-semibold">{briefData.summary.primaryGoal}</div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Content Objectives</h3>
              <ul className="space-y-3">
                {briefData.summary.objectives.map((objective, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{objective}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        );

      case 'talking-points':
        return (
          <div className="space-y-6">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Strategic Talking Points</h3>
              <p className="text-gray-600">Key themes and angles to establish authority and capture AI search rankings</p>
            </div>
            
            {briefData.talkingPoints.map((point, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-700 font-bold text-sm">{index + 1}</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">{point.point}</h4>
                    <p className="text-gray-700 mb-3 leading-relaxed">{point.details}</p>
                    <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
                      <div className="text-sm font-medium text-yellow-800 mb-1">Authority Building Strategy</div>
                      <p className="text-yellow-700 text-sm">{point.authority}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        );

      case 'keywords':
        return (
          <div className="space-y-6">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">SEO & Entity Strategy</h3>
              <p className="text-gray-600">Target keywords and named entities for AI search optimization</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-3 flex items-center">
                  <Target className="w-4 h-4 mr-2" />
                  Primary Keywords
                </h4>
                <div className="space-y-2">
                  {briefData.keywords.primary.map((keyword, index) => (
                    <span key={index} className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium mr-2 mb-2">
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-semibold text-green-900 mb-3 flex items-center">
                  <Globe className="w-4 h-4 mr-2" />
                  Secondary Keywords
                </h4>
                <div className="space-y-2">
                  {briefData.keywords.secondary.map((keyword, index) => (
                    <span key={index} className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium mr-2 mb-2">
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <h4 className="font-semibold text-purple-900 mb-3 flex items-center">
                  <Users className="w-4 h-4 mr-2" />
                  Named Entities
                </h4>
                <div className="space-y-2">
                  {briefData.keywords.entities.map((entity, index) => (
                    <span key={index} className="inline-block bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium mr-2 mb-2">
                      {entity}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <h4 className="font-semibold text-orange-900 mb-3 flex items-center">
                  <FileText className="w-4 h-4 mr-2" />
                  Topic Areas
                </h4>
                <div className="space-y-2">
                  {briefData.keywords.topics.map((topic, index) => (
                    <span key={index} className="inline-block bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium mr-2 mb-2">
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 'sources':
        return (
          <div className="space-y-6">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Authoritative Sources</h3>
              <p className="text-gray-600">High-authority sources to reference and link to for credibility</p>
            </div>

            <div className="space-y-4">
              {briefData.sources.map((source, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                        <ExternalLink className="w-4 h-4 mr-2 text-blue-600" />
                        {source.title}
                      </h4>
                      <p className="text-gray-600 text-sm mb-2">{source.relevance}</p>
                      <div className="flex items-center space-x-4">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {source.authority}
                        </span>
                        <a 
                          href={source.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          View Source →
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
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
              <h2 className="text-xl font-bold text-gray-900">Content Brief Generator</h2>
              <p className="text-sm text-gray-600">"{gap?.prompt}"</p>
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

        {/* Footer Actions */}
        <div className="border-t border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Brief generated for high-priority content opportunity
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={handleCopyBrief}
                disabled={loading}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                {copied ? <CheckCircle className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copied!' : 'Copy Brief'}</span>
              </button>
              <button
                onClick={handleDownloadPDF}
                disabled={loading}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                <span>Download PDF</span>
              </button>
            </div>
          </div>
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

export default BriefGenerationModal;