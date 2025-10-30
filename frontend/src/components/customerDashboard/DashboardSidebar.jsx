import React from 'react';

const DashboardSidebar = ({ tripRequests }) => {
  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
        <h3 className="font-semibold text-gray-900 mb-4">Quick Stats 📈</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Total Trips</span>
            <span className="font-semibold text-gray-900">{tripRequests.length}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Approved</span>
            <span className="font-semibold text-green-600">
              {tripRequests.filter(req => req.status === 'approved').length}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Pending</span>
            <span className="font-semibold text-yellow-600">
              {tripRequests.filter(req => req.status === 'pending').length}
            </span>
          </div>
        </div>
      </div>

      {/* Support Card */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl shadow-xl p-6 text-white">
        <h3 className="font-semibold mb-2">Need Help? 🤝</h3>
        <p className="text-green-100 text-sm mb-4">Our support team is here to help you</p>
        <button className="w-full bg-white text-green-600 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
          Contact Support
        </button>
      </div>
    </div>
  );
};

export default DashboardSidebar;