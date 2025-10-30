import React from 'react';

const WelcomeCard = ({ user, tripRequests }) => {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-xl p-8 text-white">
      <h2 className="text-3xl font-bold mb-2">Welcome back, {user.name}! 👋</h2>
      <p className="text-blue-100 text-lg mb-6">Ready for your next journey with RideSync?</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white/20 rounded-xl p-4 text-center backdrop-blur-sm">
          <div className="text-2xl font-bold">{tripRequests.length}</div>
          <div className="text-blue-100 text-sm">Total Trips</div>
        </div>
        <div className="bg-white/20 rounded-xl p-4 text-center backdrop-blur-sm">
          <div className="text-2xl font-bold">
            {tripRequests.filter(req => req.status === 'approved').length}
          </div>
          <div className="text-blue-100 text-sm">Approved</div>
        </div>
        <div className="bg-white/20 rounded-xl p-4 text-center backdrop-blur-sm">
          <div className="text-2xl font-bold">
            {tripRequests.filter(req => req.status === 'pending').length}
          </div>
          <div className="text-blue-100 text-sm">Pending</div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeCard;