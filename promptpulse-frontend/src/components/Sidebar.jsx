import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  BarChart3, 
  Link, 
  MessageSquare, 
  AtSign, 
  Users, 
  Users2, 
  Briefcase,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Plus,
  Building,
  UserPlus
} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    {
      icon: LayoutDashboard,
      label: 'Action Hub',
      path: '/action-hub',
      description: 'AI-powered prioritized opportunities',
    },
    {
      icon: BarChart3,
      label: 'Analytics',
      path: '/analytics',
      description: 'Explore and analyze your data',
    },
    {
      icon: Briefcase,
      label: 'Settings',
      path: '/settings',
      description: 'Workspace, team, and billing',
    },
  ];

  return (
    <div className={`bg-white border-r border-gray-200 transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-64'} flex flex-col h-screen`}>
      {/* Workspace Selector */}
      <div className="p-4 border-b border-gray-200">
        {!isCollapsed ? (
          <div className="relative">
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors group"
            >
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 ${currentWorkspace?.color} rounded-lg flex items-center justify-center`}>
                  <span className="text-white font-bold text-sm">{currentWorkspace?.initial}</span>
                </div>
                <div className="text-left">
                  <div className="text-sm font-semibold text-gray-900">{selectedWorkspace}</div>
                  <div className="text-xs text-gray-500">Workspace</div>
                </div>
              </div>
              <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isWorkspaceDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Workspace Dropdown */}
            {isWorkspaceDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                <div className="p-2">
                  {/* Existing Workspaces */}
                  {workspaces.map((workspace) => (
                    <button
                      key={workspace.name}
                      onClick={() => {
                        setSelectedWorkspace(workspace.name);
                        setIsWorkspaceDropdownOpen(false);
                      }}
                      className={`w-full flex items-center space-x-3 p-2 rounded-md transition-colors ${
                        workspace.name === selectedWorkspace 
                          ? 'bg-blue-50 text-blue-700' 
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className={`w-6 h-6 ${workspace.color} rounded flex items-center justify-center`}>
                        <span className="text-white font-bold text-xs">{workspace.initial}</span>
                      </div>
                      <div className="flex-1 text-left">
                        <div className="text-sm font-medium">{workspace.name}</div>
                        <div className="text-xs text-gray-500">{workspace.competitors.length} competitors</div>
                      </div>
                    </button>
                  ))}
                  
                  {/* Divider */}
                  <div className="border-t border-gray-200 my-2"></div>
                  
                  {/* Add Brand Button */}
                  <button
                    onClick={() => {
                      setShowAddBrandModal(true);
                      setIsWorkspaceDropdownOpen(false);
                    }}
                    className="w-full flex items-center space-x-3 p-2 rounded-md hover:bg-blue-50 text-blue-600 transition-colors"
                  >
                    <div className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center">
                      <Plus className="w-4 h-4 text-blue-600" />
                    </div>
                    <span className="text-sm font-medium">Add New Brand</span>
                  </button>

                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex justify-center">
            <div className={`w-8 h-8 ${currentWorkspace?.color} rounded-lg flex items-center justify-center`}>
              <span className="text-white font-bold text-sm">{currentWorkspace?.initial}</span>
            </div>
          </div>
        )}

        {/* Collapse Toggle */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`${isCollapsed ? 'w-full justify-center' : 'absolute top-4 right-4'} flex items-center justify-center w-6 h-6 hover:bg-gray-100 rounded-md transition-colors`}
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4 text-gray-500" />
          ) : (
            <ChevronLeft className="w-4 h-4 text-gray-500" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto">
        <div className="px-2 pb-4">
          {menuItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            return (
              <button
                key={item.label}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors group ${
                  isActive
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }`}
                title={isCollapsed ? item.label : item.description}
              >
                <item.icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'} ${isCollapsed ? '' : 'mr-3'}`} />
                {!isCollapsed && (
                  <div className="text-left">
                    <div className="font-medium">{item.label}</div>
                    {item.description && (
                      <div className="text-xs text-gray-500 mt-0.5">{item.description}</div>
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Add Brand Modal */}
      {showAddBrandModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Brand</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              const brandName = e.target.brandName.value.trim();
              if (brandName) handleAddBrand(brandName);
            }}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Brand Name
                </label>
                <input
                  type="text"
                  name="brandName"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter brand name..."
                  autoFocus
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAddBrandModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Add Brand
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Sidebar;