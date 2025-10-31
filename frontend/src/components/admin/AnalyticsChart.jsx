// src/components/admin/AnalyticsChart.jsx
import React, { useState, useEffect } from 'react';

const AnalyticsChart = () => {
  const [analyticsData, setAnalyticsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/analytics/daily')
      const data = await response.json();
      setAnalyticsData(data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  const maxCount = Math.max(...analyticsData.map(d => d.count), 1);

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Requests Last 7 Days</h3>
      
      <div className="space-y-4">
        {analyticsData.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No data available</p>
        ) : (
          analyticsData.map((day) => (
            <div key={day.date} className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700 w-24">
                {new Date(day.date).toLocaleDateString('en-US', { 
                  weekday: 'short', 
                  month: 'short', 
                  day: 'numeric' 
                })}
              </span>
              
              <div className="flex-1 mx-4">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-6 rounded-full transition-all duration-300"
                  style={{ 
                    width: `${(day.count / maxCount) * 100}%`,
                    maxWidth: '100%'
                  }}
                ></div>
              </div>
              
              <span className="text-sm font-bold text-gray-900 w-12 text-right">
                {day.count}
              </span>
            </div>
          ))
        )}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex justify-between text-xs text-gray-500">
          <span>Total Requests: {analyticsData.reduce((sum, day) => sum + day.count, 0)}</span>
          <span>Peak: {maxCount} requests</span>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsChart;