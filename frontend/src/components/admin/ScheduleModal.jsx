import React, { useState, useEffect } from 'react';

const ScheduleModal = ({ request, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    scheduled_time: '',
    driver_id: '',
    vehicle_id: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (request) {
      // Set default scheduled time to 1 hour from now
      const defaultTime = new Date();
      defaultTime.setHours(defaultTime.getHours() + 1);
      const formattedTime = defaultTime.toISOString().slice(0, 16);
      
      setFormData({
        scheduled_time: formattedTime,
        driver_id: request.driver_id || '',
        vehicle_id: request.vehicle_id || ''
      });
    }
  }, [request]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`http://localhost:5000/api/admin/requests/${request.id}/schedule`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      
      if (response.ok && data.success) {
        onSuccess();
      } else {
        setError(data.message || 'Failed to schedule request');
      }
    } catch (error) {
      console.error('Error scheduling request:', error);
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Schedule Trip Request
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Customer: {request?.customer_name} ({request?.phone})
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <div className="text-red-600 text-sm">{error}</div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Scheduled Time *
            </label>
            <input
              type="datetime-local"
              name="scheduled_time"
              value={formData.scheduled_time}
              onChange={handleChange}
              required
              min={new Date().toISOString().slice(0, 16)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Driver ID (Optional)
            </label>
            <input
              type="number"
              name="driver_id"
              value={formData.driver_id}
              onChange={handleChange}
              placeholder="Enter driver ID"
              min="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Vehicle ID (Optional)
            </label>
            <input
              type="number"
              name="vehicle_id"
              value={formData.vehicle_id}
              onChange={handleChange}
              placeholder="Enter vehicle ID"
              min="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
            >
              {isLoading ? 'Scheduling...' : 'Schedule Trip'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ScheduleModal;