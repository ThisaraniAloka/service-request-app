import React from 'react';

const DashboardTabs = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'new-trip', label: 'Book Trip', icon: '🚌' },
    { id: 'requests', label: 'My Trips', icon: '📋' },
    { id: 'profile', label: 'Profile', icon: '👤' }
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 mb-8">
      <div className="flex overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex items-center space-x-2 px-6 py-4 border-b-2 font-medium text-sm transition-all duration-200 ${
              activeTab === tab.id
                ? 'border-blue-500 text-blue-600 bg-blue-50'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default DashboardTabs;