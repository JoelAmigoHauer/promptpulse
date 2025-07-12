import React, { useState } from 'react';
import { ChevronDown, Car, Calendar, Tag, Cpu } from 'lucide-react';

const Filters = () => {
  const [activeFilters, setActiveFilters] = useState({
    brand: 'Tesla',
    timeRange: 'Last 7 days',
    tags: 'All Tags',
    models: 'All Models'
  });

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

  const filterOptions = {
    brand: ['Tesla', 'BMW', 'Ford', 'Toyota', 'Mercedes', 'Audi', 'Hyundai'],
    timeRange: ['Last 24 hours', 'Last 7 days', 'Last 30 days', 'Last 3 months', 'Last year'],
    tags: ['All Tags', 'Electric', 'Luxury', 'SUV', 'Sedan', 'Truck', 'Hybrid'],
    models: ['All Models', 'GPT-4', 'Claude', 'Gemini', 'GPT-3.5', 'PaLM']
  };

  return (
    <div className="flex items-center space-x-4 py-4 px-6 bg-white border-b border-gray-200">
      <FilterButton
        icon={Car}
        label="Brand"
        value={activeFilters.brand}
        options={filterOptions.brand}
        filterKey="brand"
      />
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
  );
};

export default Filters;