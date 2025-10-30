// src/pages/AdminPage.jsx
import React, { useState, useEffect } from 'react';
import AdminHeader from '../components/admin/AdminHeader';
import RequestsTable from '../components/admin/RequestsTable';
import AnalyticsChart from '../components/admin/AnalyticsChart';

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState('requests');
  const [admin, setAdmin] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is admin
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      if (user.role === 'admin') {
        setAdmin(user);
      } else {
        window.location.href = '/dashboard'; // Redirect non-admins to customer dashboard
      }
    } else {
      window.location.href = '/'; // Redirect to home if not logged in
    }
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!admin) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader admin={admin} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="flex space-x-8 mb-8 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('requests')}
            className={`pb-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'requests'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            📋 Service Requests
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`pb-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'analytics'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            📊 Analytics
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'requests' && <RequestsTable />}
        {activeTab === 'analytics' && <AnalyticsChart />}
      </div>
    </div>
  );
};

export default AdminPage;