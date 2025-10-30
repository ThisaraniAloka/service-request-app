import React, { useState, useEffect, useCallback } from 'react';
import ScheduleModal from './ScheduleModal';

const RequestsTable = () => {
  const [requests, setRequests] = useState([]);
  const [pagination, setPagination] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    status: 'all',
    search: '',
    page: 1,
    limit: 10
  });
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showScheduleModal, setShowScheduleModal] = useState(false);

  // Use useCallback to fix the ESLint warning
  const fetchRequests = useCallback(async () => {
    try {
      setIsLoading(true);
      setError('');
      const queryParams = new URLSearchParams();
      
      // Add all filters including empty ones
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== '' && value !== null && value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });

      console.log('🔍 Fetching requests with params:', queryParams.toString());

      const response = await fetch(`http://localhost:5000/api/admin/requests?${queryParams}`);
      const data = await response.json();
      
      console.log('📦 Response data:', data);
      
      if (response.ok && data.success) {
        setRequests(data.requests || []);
        setPagination(data.pagination || {});
      } else {
        setError(data.message || 'Failed to fetch requests');
        setRequests([]);
        setPagination({});
      }
    } catch (error) {
      console.error('❌ Error fetching requests:', error);
      setError('Network error. Please check if server is running.');
      setRequests([]);
      setPagination({});
    } finally {
      setIsLoading(false);
    }
  }, [filters]); // Add filters as dependency

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]); // Now fetchRequests is stable

  const updateStatus = async (requestId, newStatus) => {
    try {
      const response = await fetch(`http://localhost:5000/api/admin/requests/${requestId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await response.json();
      
      if (response.ok && data.success) {
        fetchRequests(); // Refresh the list
      } else {
        alert(data.message || 'Failed to update status');
      }
    } catch (error) {
      console.error('❌ Error updating status:', error);
      alert('Network error. Please try again.');
    }
  };

  const handleSchedule = (request) => {
    setSelectedRequest(request);
    setShowScheduleModal(true);
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
      approved: 'bg-green-100 text-green-800 border border-green-200',
      rejected: 'bg-red-100 text-red-800 border border-red-200',
      scheduled: 'bg-blue-100 text-blue-800 border border-blue-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border border-gray-200';
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  const handlePageChange = (newPage) => {
    setFilters(prev => ({ ...prev, page: newPage }));
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading requests...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
          <div className="flex items-center">
            <div className="text-red-600 text-sm font-medium">{error}</div>
            <button 
              onClick={fetchRequests}
              className="ml-auto bg-red-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Filters Section */}
      <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status Filter
            </label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="scheduled">Scheduled</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search by Name/Phone
            </label>
            <input
              type="text"
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              placeholder="Search customers..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Results per page
            </label>
            <select
              value={filters.limit}
              onChange={(e) => handleFilterChange('limit', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={fetchRequests}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Requests Table */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              Service Requests ({pagination.total || 0})
            </h3>
            <div className="text-sm text-gray-500">
              Page {pagination.current || 1} of {pagination.pages || 1}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trip Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {requests.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center">
                    <div className="text-gray-500 text-lg font-medium">No service requests found</div>
                    <div className="text-gray-400 text-sm mt-2">
                      {filters.status !== 'all' || filters.search ? 'Try changing your filters' : 'No requests in the system yet'}
                    </div>
                  </td>
                </tr>
              ) : (
                requests.map((request) => (
                  <tr key={request.id} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {request.customer_name || 'Unknown'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {request.phone || 'No phone'}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="text-sm text-gray-900">
                          <strong>From:</strong> {request.pickup_location || 'N/A'}
                        </div>
                        <div className="text-sm text-gray-900">
                          <strong>To:</strong> {request.dropoff_location || 'N/A'}
                        </div>
                        <div className="text-sm text-gray-500">
                          <strong>Pickup:</strong> {formatDateTime(request.pickup_time)}
                        </div>
                        {request.scheduled_time && (
                          <div className="text-sm text-blue-600">
                            <strong>Scheduled:</strong> {formatDateTime(request.scheduled_time)}
                          </div>
                        )}
                        {request.passengers && (
                          <div className="text-sm text-gray-500">
                            <strong>Passengers:</strong> {request.passengers}
                          </div>
                        )}
                        {request.notes && (
                          <div className="text-sm text-gray-500 mt-1">
                            <strong>Notes:</strong> {request.notes}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(request.status)}`}>
                        {request.status?.toUpperCase() || 'UNKNOWN'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDateTime(request.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex flex-wrap gap-2">
                        {request.status === 'pending' && (
                          <>
                            <button
                              onClick={() => updateStatus(request.id, 'approved')}
                              className="text-green-600 hover:text-green-900 font-medium px-2 py-1 rounded hover:bg-green-50 transition-colors"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => updateStatus(request.id, 'rejected')}
                              className="text-red-600 hover:text-red-900 font-medium px-2 py-1 rounded hover:bg-red-50 transition-colors"
                            >
                              Reject
                            </button>
                            <button
                              onClick={() => handleSchedule(request)}
                              className="text-blue-600 hover:text-blue-900 font-medium px-2 py-1 rounded hover:bg-blue-50 transition-colors"
                            >
                              Schedule
                            </button>
                          </>
                        )}
                        {request.status === 'approved' && (
                          <button
                            onClick={() => handleSchedule(request)}
                            className="text-blue-600 hover:text-blue-900 font-medium px-2 py-1 rounded hover:bg-blue-50 transition-colors"
                          >
                            Schedule
                          </button>
                        )}
                        {request.status === 'scheduled' && (
                          <button
                            onClick={() => handleSchedule(request)}
                            className="text-purple-600 hover:text-purple-900 font-medium px-2 py-1 rounded hover:bg-purple-50 transition-colors"
                          >
                            Reschedule
                          </button>
                        )}
                        {(request.status === 'approved' || request.status === 'scheduled') && (
                          <button
                            onClick={() => updateStatus(request.id, 'pending')}
                            className="text-gray-600 hover:text-gray-900 font-medium px-2 py-1 rounded hover:bg-gray-50 transition-colors"
                          >
                            Reset
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing {((filters.page - 1) * filters.limit) + 1} to {Math.min(filters.page * filters.limit, pagination.total)} of {pagination.total} results
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handlePageChange(filters.page - 1)}
                  disabled={filters.page === 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>
                <button
                  onClick={() => handlePageChange(filters.page + 1)}
                  disabled={filters.page === pagination.pages}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Schedule Modal */}
      {showScheduleModal && (
        <ScheduleModal
          request={selectedRequest}
          onClose={() => setShowScheduleModal(false)}
          onSuccess={() => {
            setShowScheduleModal(false);
            fetchRequests();
          }}
        />
      )}
    </div>
  );
};

export default RequestsTable;