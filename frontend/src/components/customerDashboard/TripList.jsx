import React from 'react';

const TripList = ({ tripRequests, isLoading, onBookTrip }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your trips...</p>
        </div>
      </div>
    );
  }

  if (tripRequests.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🚌</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No trips yet</h3>
          <p className="text-gray-600 mb-6">Start by booking your first trip!</p>
          <button 
            onClick={onBookTrip}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
          >
            Book Your First Trip
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">My Trip Requests 📋</h2>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Trip ID</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Route</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Passengers</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Status</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Date</th>
            </tr>
          </thead>
          <tbody>
            {tripRequests.map((trip) => (
              <tr key={trip.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <td className="py-4 px-4 text-sm text-gray-900">#{trip.id}</td>
                <td className="py-4 px-4">
                  <div className="text-sm font-medium text-gray-900">{trip.pickup_location}</div>
                  <div className="text-xs text-gray-500">→ {trip.dropoff_location}</div>
                </td>
                <td className="py-4 px-4 text-sm text-gray-900">{trip.passengers}</td>
                <td className="py-4 px-4">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(trip.status)}`}>
                    {trip.status}
                  </span>
                </td>
                <td className="py-4 px-4 text-sm text-gray-900">
                  {new Date(trip.pickup_time).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TripList;