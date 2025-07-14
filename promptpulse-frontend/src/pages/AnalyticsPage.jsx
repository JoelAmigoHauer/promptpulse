import React, { useState } from 'react';

const tabs = [
  { id: 'prompts', label: 'Prompts' },
  { id: 'competitors', label: 'Competitors' },
  { id: 'sources', label: 'Sources' },
  { id: 'mentions', label: 'Mentions' },
];

const AnalyticsPage = ({ onboardingData }) => {
  const [activeTab, setActiveTab] = useState('prompts');

  const renderTabContent = () => {
    if (onboardingData) {
      switch (activeTab) {
        case 'prompts':
          return (
            <div>
              <h2 className="text-lg font-semibold mb-4">Tracked Prompts</h2>
              <table className="min-w-full bg-white border">
                <thead>
                  <tr>
                    <th className="px-4 py-2 border">Prompt</th>
                    <th className="px-4 py-2 border">Opportunity</th>
                    <th className="px-4 py-2 border">Search Volume</th>
                    <th className="px-4 py-2 border">Competitor Count</th>
                  </tr>
                </thead>
                <tbody>
                  {onboardingData.selectedPrompts.map((p, idx) => (
                    <tr key={p.id || idx}>
                      <td className="px-4 py-2 border">{p.prompt}</td>
                      <td className="px-4 py-2 border">{p.opportunity || p.rationale}</td>
                      <td className="px-4 py-2 border">{p.searchVolume || '—'}</td>
                      <td className="px-4 py-2 border">{p.competitorCount || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        case 'competitors':
          return (
            <div>
              <h2 className="text-lg font-semibold mb-4">Competitors</h2>
              <ul className="list-disc pl-6">
                {onboardingData.competitors.map((c, idx) => (
                  <li key={c.id || idx}>{c.name}</li>
                ))}
              </ul>
            </div>
          );
        case 'sources':
          return (
            <div>
              <h2 className="text-lg font-semibold mb-4">Sources</h2>
              <div>No sources data yet (demo).</div>
            </div>
          );
        case 'mentions':
          return (
            <div>
              <h2 className="text-lg font-semibold mb-4">Mentions</h2>
              <div>No mentions data yet (demo).</div>
            </div>
          );
        default:
          return null;
      }
    }
    // Fallback to placeholders
    switch (activeTab) {
      case 'prompts':
        return <div>Prompts Table Placeholder</div>;
      case 'competitors':
        return <div>Competitors Analysis Placeholder</div>;
      case 'sources':
        return <div>Sources Citations Placeholder</div>;
      case 'mentions':
        return <div>Mentions Feed Placeholder</div>;
      default:
        return null;
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Analytics</h1>
      <div className="border-b border-gray-200 mb-8">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
      <div>{renderTabContent()}</div>
    </div>
  );
};

export default AnalyticsPage; 