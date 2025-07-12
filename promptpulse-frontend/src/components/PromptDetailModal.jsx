import React, { useState, useEffect } from 'react';
import { 
  X, 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  CheckCircle,
  XCircle,
  Minus,
  ThumbsUp,
  AlertCircle,
  Target,
  Search,
  Globe,
  Eye,
  Lightbulb,
  TestTube
} from 'lucide-react';
import { realtimeApi } from '../services/realtimeApi';

const PromptDetailModal = ({ isOpen, onClose, prompt, promptData }) => {
  const [analysisData, setAnalysisData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (isOpen && prompt) {
      fetchDetailedAnalysis();
    }
  }, [isOpen, prompt]);

  const fetchDetailedAnalysis = async () => {
    setLoading(true);
    try {
      // Get real-time competitive analysis for this prompt
      const result = await realtimeApi.testPrompt(prompt, "Tesla", ["Ford", "GM", "Rivian"]);
      
      if (result.success) {
        setAnalysisData(transformAnalysisData(result));
      }
    } catch (error) {
      console.error('Error fetching prompt analysis:', error);
    }
    setLoading(false);
  };

  const transformAnalysisData = (apiResult) => {
    // Transform API result to match the dashboard format
    const providers = ['ChatGPT', 'Gemini', 'Perplexity', 'Meta']; // Map our providers
    
    return {
      prompt: apiResult.prompt,
      assistants: apiResult.results.map((result, index) => ({
        name: result.provider,
        presence: result.brandMentions.length > 0 ? 'high' : 'low',
        position: result.rank || null,
        sentiment: result.sentiment >= 4 ? 'positive' : result.sentiment <= 2 ? 'negative' : 'neutral',
        competitors: result.competitorMentions.length,
        competitorScore: `${result.competitorMentions.length}/10`,
        citations: result.citations.length,
        confidence: result.confidence
      })),
      searchesPerformed: {
        yes: 85,
        no: 15
      },
      sourcesCited: {
        yours: 15,
        independent: 45,
        competitor: 40
      },
      topQueries: [
        `${prompt} 2024`,
        `best ${prompt.split(' ').slice(-2).join(' ')}`,
        `${prompt} comparison`,
        `top ${prompt.split(' ').slice(-1)[0]} solutions`,
        `enterprise ${prompt.split(' ').slice(-2).join(' ')}`
      ],
      topDomains: [
        { domain: 'tesla.com', type: 'competitor', citations: 45 },
        { domain: 'ford.com', type: 'competitor', citations: 32 },
        { domain: 'reddit.com', type: 'independent', citations: 28 },
        { domain: 'consumerreports.org', type: 'independent', citations: 24 },
        { domain: 'motortrend.com', type: 'independent', citations: 18 }
      ],
      optimization: {
        opportunity: 'Missed content opportunity',
        description: `${apiResult.bestPerformer || 'ChatGPT'} performed a search to inform this response, but none of the results were your brand-controlled content.`,
        recommendation: `Get your content to be returned for the web search used by ${apiResult.bestPerformer || 'ChatGPT'} to inform the AI responses, and result in improved brand presence, position, and sentiment.`,
        hasExistingContent: false
      }
    };
  };

  const getPresenceColor = (presence) => {
    switch (presence) {
      case 'high': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-red-600';
      default: return 'text-gray-400';
    }
  };

  const getPresenceIcon = (presence) => {
    switch (presence) {
      case 'high': return <CheckCircle className="w-4 h-4" />;
      case 'medium': return <Minus className="w-4 h-4" />;
      case 'low': return <XCircle className="w-4 h-4" />;
      default: return <Minus className="w-4 h-4" />;
    }
  };

  const getPositionDots = (position) => {
    const dots = Array.from({ length: 5 }, (_, i) => (
      <div
        key={i}
        className={`w-2 h-2 rounded-full ${
          position && i < position 
            ? position <= 2 ? 'bg-green-500' : position <= 4 ? 'bg-yellow-500' : 'bg-red-500'
            : 'bg-gray-200'
        }`}
      />
    ));
    return <div className="flex space-x-1">{dots}</div>;
  };

  const getSentimentIcon = (sentiment) => {
    switch (sentiment) {
      case 'positive': return <ThumbsUp className="w-4 h-4 text-green-600" />;
      case 'negative': return <XCircle className="w-4 h-4 text-red-600" />;
      default: return <Minus className="w-4 h-4 text-yellow-600" />;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-7xl w-full max-h-screen overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Prompt Analysis</h2>
              <p className="text-gray-600 mt-1">"{prompt}"</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          {/* Role Indicators */}
          <div className="flex items-center space-x-6 mt-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Enterprise Sales Executive</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-teal-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Awareness</span>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Analyzing prompt across AI platforms...</p>
          </div>
        )}

        {/* Analysis Results */}
        {analysisData && !loading && (
          <div className="p-6">
            {/* AI Assistants Analysis Table */}
            <div className="mb-8">
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assistant</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Presence</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sentiment</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Competitors</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Optimization Opportunities</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {analysisData.assistants.map((assistant, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-3">
                            <div className="flex-shrink-0">
                              {assistant.name === 'ChatGPT' && <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">🤖</div>}
                              {assistant.name === 'Gemini' && <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">💎</div>}
                              {assistant.name === 'Claude' && <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">🧠</div>}
                            </div>
                            <span className="font-medium text-gray-900">{assistant.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            <div className="flex space-x-1">
                              {Array.from({ length: 6 }, (_, i) => (
                                <div
                                  key={i}
                                  className={`w-2 h-2 rounded-full ${
                                    assistant.presence === 'high' && i < 5 ? 'bg-green-500' :
                                    assistant.presence === 'medium' && i < 3 ? 'bg-yellow-500' :
                                    assistant.presence === 'low' && i < 2 ? 'bg-red-500' :
                                    'bg-gray-200'
                                  }`}
                                />
                              ))}
                            </div>
                            <div className={getPresenceColor(assistant.presence)}>
                              {getPresenceIcon(assistant.presence)}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getPositionDots(assistant.position)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            <div className="flex space-x-1">
                              {Array.from({ length: 5 }, (_, i) => (
                                <div
                                  key={i}
                                  className={`w-2 h-2 rounded-full ${
                                    assistant.sentiment === 'positive' && i < 4 ? 'bg-green-500' :
                                    assistant.sentiment === 'neutral' && i < 3 ? 'bg-yellow-500' :
                                    assistant.sentiment === 'negative' && i < 2 ? 'bg-red-500' :
                                    'bg-gray-200'
                                  }`}
                                />
                              ))}
                            </div>
                            {getSentimentIcon(assistant.sentiment)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            <div className="flex space-x-1">
                              {Array.from({ length: 5 }, (_, i) => (
                                <div
                                  key={i}
                                  className={`w-2 h-2 rounded-full ${
                                    i < assistant.competitors ? 'bg-orange-500' : 'bg-gray-200'
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-sm text-gray-600">{assistant.competitorScore}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <div className="flex items-center space-x-1 text-green-600">
                              <Target className="w-4 h-4" />
                              <span className="text-sm">Analyze</span>
                            </div>
                            <div className="flex items-center space-x-1 text-blue-600">
                              <Search className="w-4 h-4" />
                              <span className="text-sm">Identify</span>
                            </div>
                            <div className="flex items-center space-x-1 text-purple-600">
                              <TestTube className="w-4 h-4" />
                              <span className="text-sm">Test</span>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Bottom Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Searches Performed */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Searches Performed</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Yes</span>
                    <span className="text-sm font-medium text-purple-600">{analysisData.searchesPerformed.yes}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-purple-600 h-2 rounded-full" 
                      style={{ width: `${analysisData.searchesPerformed.yes}%` }}
                    ></div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">No</span>
                    <span className="text-sm font-medium text-gray-600">{analysisData.searchesPerformed.no}%</span>
                  </div>
                </div>

                <div className="mt-6">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Top Queries</h4>
                  <div className="space-y-2">
                    {analysisData.topQueries.map((query, index) => (
                      <div key={index} className="text-sm text-gray-600 italic">
                        {query}
                      </div>
                    ))}
                  </div>
                  <button className="mt-3 text-sm text-blue-600 hover:text-blue-800 flex items-center">
                    <Eye className="w-4 h-4 mr-1" />
                    View all searches
                  </button>
                </div>
              </div>

              {/* Sources Cited */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Sources Cited</h3>
                <div className="space-y-4">
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div className="flex h-4 rounded-full overflow-hidden">
                      <div 
                        className="bg-teal-500" 
                        style={{ width: `${analysisData.sourcesCited.yours}%` }}
                      ></div>
                      <div 
                        className="bg-blue-500" 
                        style={{ width: `${analysisData.sourcesCited.independent}%` }}
                      ></div>
                      <div 
                        className="bg-orange-500" 
                        style={{ width: `${analysisData.sourcesCited.competitor}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-teal-500 rounded-full"></div>
                        <span className="text-sm text-gray-600">Yours</span>
                      </div>
                      <span className="text-sm font-medium">{analysisData.sourcesCited.yours}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <span className="text-sm text-gray-600">Independent</span>
                      </div>
                      <span className="text-sm font-medium">{analysisData.sourcesCited.independent}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                        <span className="text-sm text-gray-600">Competitor</span>
                      </div>
                      <span className="text-sm font-medium">{analysisData.sourcesCited.competitor}%</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Top Domains</h4>
                  <div className="space-y-2">
                    {analysisData.topDomains.map((domain, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className={`w-2 h-2 rounded-full ${
                            domain.type === 'yours' ? 'bg-teal-500' :
                            domain.type === 'independent' ? 'bg-blue-500' :
                            'bg-orange-500'
                          }`}></div>
                          <span className="text-sm text-gray-600">{domain.domain}</span>
                        </div>
                        <span className="text-sm text-gray-400">{domain.citations}</span>
                      </div>
                    ))}
                  </div>
                  <button className="mt-3 text-sm text-blue-600 hover:text-blue-800 flex items-center">
                    <Eye className="w-4 h-4 mr-1" />
                    View all citations
                  </button>
                </div>
              </div>

              {/* Optimization Opportunities */}
              <div className="bg-yellow-50 rounded-lg border border-yellow-200 p-6">
                <div className="flex items-start space-x-3 mb-4">
                  <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{analysisData.optimization.opportunity}</h3>
                    <p className="text-sm text-gray-600 mt-1">{analysisData.optimization.description}</p>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Lightbulb className="w-4 h-4 text-yellow-600" />
                    <span className="text-sm font-medium text-gray-900">Recommendation</span>
                  </div>
                  <p className="text-sm text-gray-700">{analysisData.optimization.recommendation}</p>
                </div>

                <div className="mb-6">
                  <p className="text-sm text-gray-600 mb-3">Do you have existing content relevant to this search?</p>
                  <div className="flex space-x-3">
                    <button className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700">
                      <CheckCircle className="w-4 h-4" />
                      <span>Yes</span>
                    </button>
                    <button className="flex items-center space-x-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200">
                      <XCircle className="w-4 h-4" />
                      <span>No</span>
                    </button>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <p className="text-sm font-medium text-gray-900 mb-2">Great! Let's test SEO changes for your existing content, to improve responses for this prompt.</p>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center space-x-2">
                    <TestTube className="w-4 h-4" />
                    <span>Test changes</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PromptDetailModal;