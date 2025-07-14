import React, { useState } from 'react';

const tabs = [
  { id: 'workspace', label: 'Workspace' },
  { id: 'team', label: 'Team' },
  { id: 'billing', label: 'Billing' },
];

const SettingsPage = ({ onboardingData }) => {
  const [activeTab, setActiveTab] = useState('workspace');

  const renderTabContent = () => {
    if (onboardingData) {
      switch (activeTab) {
        case 'workspace':
          return (
            <div>
              <h2 className="text-lg font-semibold mb-4">Workspace Settings</h2>
              <div><strong>Brand Name:</strong> {onboardingData.brandName}</div>
              <div><strong>Website:</strong> {onboardingData.website}</div>
              <div><strong>Industry:</strong> {onboardingData.industry}</div>
            </div>
          );
        case 'team':
          return (
            <div>
              <h2 className="text-lg font-semibold mb-4">Team Management</h2>
              <ul className="list-disc pl-6">
                <li>Sarah Chen (Admin)</li>
                <li>Marcus Rodriguez (Editor)</li>
                <li>Emma Wilson (Viewer)</li>
              </ul>
            </div>
          );
        case 'billing':
          return (
            <div>
              <h2 className="text-lg font-semibold mb-4">Billing Information</h2>
              <div>Subscription: Free Trial (demo)</div>
            </div>
          );
        default:
          return null;
      }
    }
    // Fallback to placeholders
    switch (activeTab) {
      case 'workspace':
        return <div>Workspace Settings Placeholder</div>;
      case 'team':
        return <div>Team Management Placeholder</div>;
      case 'billing':
        return <div>Billing Information Placeholder</div>;
      default:
        return null;
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
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

export default SettingsPage; 