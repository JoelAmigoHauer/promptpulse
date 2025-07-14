import React, { useState } from 'react';
import { ChevronDown, Car, Calendar, Tag, Cpu, Users, Plus, X } from 'lucide-react';

const Filters = () => {
  const [activeFilters, setActiveFilters] = useState({
    brand: 'Tesla',
    timeRange: 'Last 7 days',
    tags: 'All Tags',
    models: 'All Models'
  });

  // Competitors for each brand you're monitoring
  const [competitors, setCompetitors] = useState({
    'Tesla': ['Ford', 'GM', 'Rivian', 'BYD'], // EV competitors
    'BMW': ['Mercedes', 'Audi', 'Lexus', 'Volvo'], // Luxury car competitors  
    'Apple': ['Samsung', 'Google', 'Microsoft', 'Meta'], // Tech competitors
    'Microsoft': ['Apple', 'Google', 'Amazon', 'Salesforce'] // Software/cloud competitors
  });

  const [showAddCompetitor, setShowAddCompetitor] = useState(false);

  const handleAddCompetitor = (competitorName) => {
    const currentBrand = activeFilters.brand;
    const brandCompetitors = competitors[currentBrand] || [];
    
    if (competitorName && !brandCompetitors.includes(competitorName)) {
      setCompetitors(prev => ({
        ...prev,
        [currentBrand]: [...brandCompetitors, competitorName]
      }));
    }
    setShowAddCompetitor(false);
  };

  const handleRemoveCompetitor = (competitorToRemove) => {
    const currentBrand = activeFilters.brand;
    setCompetitors(prev => ({
      ...prev,
      [currentBrand]: prev[currentBrand].filter(comp => comp !== competitorToRemove)
    }));
  };

  const FilterButton = ({ icon: Icon, label, value, options, filterKey }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        >
          <Icon className="w-4 h-4 text-gray-500" />
          <span>{value}</span>
          <ChevronDown className="w-4 h-4 text-gray-400" />
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
            <div className="py-1">
              {options.map((option) => (
                <button
                  key={option}
                  onClick={() => {
                    setActiveFilters(prev => ({ ...prev, [filterKey]: option }));
                    setIsOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  // Brands you're monitoring (your brands/clients)
  const filterOptions = {
    brand: ['Tesla', 'BMW', 'Apple', 'Microsoft'], // Your brands/clients that you're monitoring
    timeRange: ['Last 24 hours', 'Last 7 days', 'Last 30 days', 'Last 3 months', 'Last year'],
    tags: ['All Tags', 'Electric', 'Luxury', 'SUV', 'Sedan', 'Truck', 'Hybrid'],
    models: ['All Models', 'GPT-4', 'Claude', 'Gemini', 'GPT-3.5', 'PaLM']
  };

  const CompetitorFilter = () => {
    const [isOpen, setIsOpen] = useState(false);
    const currentBrand = activeFilters.brand;
    const brandCompetitors = competitors[currentBrand] || [];
    
    return (
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        >
          <Users className="w-4 h-4 text-gray-500" />
          <span>Competitors ({brandCompetitors.length})</span>
          <ChevronDown className="w-4 h-4 text-gray-400" />
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-gray-200 rounded-md shadow-lg z-10">
            <div className="p-3">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-medium text-gray-900">
                  {currentBrand} Competitors
                </h4>
                <button
                  onClick={() => {
                    setShowAddCompetitor(true);
                    setIsOpen(false);
                  }}
                  className="inline-flex items-center space-x-1 px-2 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
                >
                  <Plus className="w-3 h-3" />
                  <span>Add</span>
                </button>
              </div>
              
              {brandCompetitors.length === 0 ? (
                <div className="text-sm text-gray-500 text-center py-4">
                  No competitors added yet
                </div>
              ) : (
                <div className="space-y-1">
                  {brandCompetitors.map((competitor) => (
                    <div
                      key={competitor}
                      className="flex items-center justify-between p-2 rounded-md hover:bg-gray-50"
                    >
                      <span className="text-sm text-gray-700">{competitor}</span>
                      <button
                        onClick={() => handleRemoveCompetitor(competitor)}
                        className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                        title={`Remove ${competitor}`}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <div className="flex items-center space-x-4 py-4 px-6 bg-white border-b border-gray-200">
        <FilterButton
          icon={Car}
          label="Brand"
          value={activeFilters.brand}
          options={filterOptions.brand}
          filterKey="brand"
        />
        <CompetitorFilter />
        <FilterButton
          icon={Calendar}
          label="Time Range"
          value={activeFilters.timeRange}
          options={filterOptions.timeRange}
          filterKey="timeRange"
        />
        <FilterButton
          icon={Tag}
          label="Tags"
          value={activeFilters.tags}
          options={filterOptions.tags}
          filterKey="tags"
        />
        <FilterButton
          icon={Cpu}
          label="AI Models"
          value={activeFilters.models}
          options={filterOptions.models}
          filterKey="models"
        />
      </div>

      {/* Add Competitor Modal */}
      {showAddCompetitor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Add Competitor to {activeFilters.brand}
            </h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              const competitorName = e.target.competitorName.value.trim();
              if (competitorName) handleAddCompetitor(competitorName);
            }}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Competitor Name
                </label>
                <input
                  type="text"
                  name="competitorName"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Enter competitor name..."
                  autoFocus
                />
              </div>
              <div className="mb-4">
                <div className="text-xs text-gray-500">
                  Current competitors: {(competitors[activeFilters.brand] || []).join(', ') || 'None'}
                </div>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAddCompetitor(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                >
                  Add Competitor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Filters;