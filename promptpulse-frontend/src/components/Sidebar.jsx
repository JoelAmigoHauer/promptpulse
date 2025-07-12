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
  ChevronRight
} from 'lucide-react';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selectedWorkspace, setSelectedWorkspace] = useState('Tesla');
  const [isWorkspaceDropdownOpen, setIsWorkspaceDropdownOpen] = useState(false);

  const workspaces = [
    { name: 'Tesla', initial: 'T', color: 'bg-red-500' },
    { name: 'Apple', initial: 'A', color: 'bg-gray-800' },
    { name: 'Google', initial: 'G', color: 'bg-blue-500' },
    { name: 'Microsoft', initial: 'M', color: 'bg-blue-600' },
  ];

  const navigationGroups = [
    {
      name: 'General',
      items: [
        { icon: LayoutDashboard, label: 'Dashboard', active: true, description: 'AEO Action Dashboard overview' },
        { icon: BarChart3, label: 'Rankings', active: false, description: 'Competitive landscape analysis' },
        { icon: Link, label: 'Sources', active: false, description: 'URL citation tracking' },
        { icon: MessageSquare, label: 'Prompts', active: false, description: 'Query and keyword management' },
        { icon: AtSign, label: 'Mentions', active: false, description: 'Real-time brand mentions feed' },
        { icon: Users, label: 'Competitors', active: false, description: 'Competitor management' },
      ]
    },
    {
      name: 'Settings',
      items: [
        { icon: Users2, label: 'Team', active: false, description: 'User and team management' },
        { icon: Briefcase, label: 'Workspace', active: false, description: 'Workspace configuration' },
      ]
    }
  ];

  const currentWorkspace = workspaces.find(w => w.name === selectedWorkspace);

  return (
    <div className={`bg-white border-r border-gray-200 transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-64'} flex flex-col h-screen`}>
      {/* Workspace Selector */}
      <div className="p-4 border-b border-gray-200">
        {!isCollapsed ? (
          <div className="relative">
            <button
              onClick={() => setIsWorkspaceDropdownOpen(!isWorkspaceDropdownOpen)}
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
                      <span className="text-sm font-medium">{workspace.name}</span>
                    </button>
                  ))}
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

      {/* Navigation Groups */}
      <nav className="flex-1 overflow-y-auto">
        {navigationGroups.map((group, groupIndex) => (
          <div key={group.name} className={`${groupIndex > 0 ? 'border-t border-gray-200' : ''}`}>
            {/* Group Header */}
            {!isCollapsed && (
              <div className="px-4 py-3">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  {group.name}
                </h3>
              </div>
            )}

            {/* Group Items */}
            <div className="px-2 pb-4">
              {group.items.map((item) => (
                <button
                  key={item.label}
                  className={`w-full flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors group ${
                    item.active
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                  title={isCollapsed ? item.label : item.description}
                >
                  <item.icon className={`w-5 h-5 ${item.active ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'} ${isCollapsed ? '' : 'mr-3'}`} />
                  {!isCollapsed && (
                    <div className="text-left">
                      <div className="font-medium">{item.label}</div>
                      {item.description && (
                        <div className="text-xs text-gray-500 mt-0.5">{item.description}</div>
                      )}
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;