import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

const IndustryRanking = () => {
  const rankingData = [
    {
      rank: 1,
      brand: 'Hyundai',
      logo: '/api/placeholder/32/32',
      visibility: 94,
      trend: { value: 4, direction: 'up' },
      previousRank: 2
    },
    {
      rank: 2,
      brand: 'Tesla',
      logo: '/api/placeholder/32/32',
      visibility: 91,
      trend: { value: 1, direction: 'down' },
      previousRank: 1
    },
    {
      rank: 3,
      brand: 'BMW',
      logo: '/api/placeholder/32/32',
      visibility: 88,
      trend: { value: 2, direction: 'up' },
      previousRank: 4
    },
    {
      rank: 4,
      brand: 'Ford',
      logo: '/api/placeholder/32/32',
      visibility: 85,
      trend: { value: 0, direction: 'neutral' },
      previousRank: 4
    },
    {
      rank: 5,
      brand: 'Jeep',
      logo: '/api/placeholder/32/32',
      visibility: 82,
      trend: { value: 3, direction: 'down' },
      previousRank: 3
    }
  ];

  const getTrendIcon = (direction) => {
    switch (direction) {
      case 'up':
        return <TrendingUp className="w-3 h-3" />;
      case 'down':
        return <TrendingDown className="w-3 h-3" />;
      default:
        return <Minus className="w-3 h-3" />;
    }
  };

  const getTrendStyle = (direction) => {
    switch (direction) {
      case 'up':
        return 'bg-green-100 text-green-800';
      case 'down':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTrend = (trend) => {
    if (trend.direction === 'neutral') return '0%';
    const sign = trend.direction === 'up' ? '+' : '-';
    return `${sign}${trend.value}%`;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-lg font-bold text-gray-900 mb-1">Industry ranking</h2>
        <p className="text-sm text-gray-500">Brands with the highest visibility</p>
      </div>

      {/* Table */}
      <div className="overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-2 text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
              <th className="text-left py-3 px-2 text-xs font-medium text-gray-500 uppercase tracking-wider">Brand</th>
              <th className="text-left py-3 px-2 text-xs font-medium text-gray-500 uppercase tracking-wider">Visibility</th>
              <th className="text-left py-3 px-2 text-xs font-medium text-gray-500 uppercase tracking-wider">Previous Rank</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {rankingData.map((item) => (
              <tr key={item.rank} className="hover:bg-gray-50 transition-colors">
                <td className="py-4 px-2">
                  <span className="text-sm font-medium text-gray-900">{item.rank}</span>
                </td>
                <td className="py-4 px-2">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                      <img
                        src={item.logo}
                        alt={`${item.brand} logo`}
                        className="w-6 h-6 rounded-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                      <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-xs font-medium text-gray-600" style={{ display: 'none' }}>
                        {item.brand.charAt(0)}
                      </div>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{item.brand}</span>
                  </div>
                </td>
                <td className="py-4 px-2">
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-medium text-gray-900">{item.visibility}%</span>
                    <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getTrendStyle(item.trend.direction)}`}>
                      {getTrendIcon(item.trend.direction)}
                      <span>{formatTrend(item.trend)}</span>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-2">
                  <span className="text-sm text-gray-500">#{item.previousRank}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default IndustryRanking;