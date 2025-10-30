import React, { useState, useEffect } from 'react';
import DashboardHeader from '../components/customerDashboard/DashboardHeader';
import DashboardTabs from '../components/customerDashboard/DashboardTabs';
import DashboardSidebar from '../components/customerDashboard/DashboardSidebar';
import WelcomeCard from '../components/customerDashboard/WelcomeCard';
import TripForm from '../components/customerDashboard/TripForm';
import TripList from '../components/customerDashboard/TripList';
import ProfileSection from '../components/customerDashboard/ProfileSection';

const CustomerDashboard = () => {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [tripRequests, setTripRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // New trip form state
  const [newTrip, setNewTrip] = useState({
    pickup_location: '',
    dropoff_location: '',
    pickup_time: '',
    passengers: 1,
    notes: '',
    phone: ''
  });

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        
        // Set phone from user data if available
        if (parsedUser.phone) {
          setNewTrip(prev => ({
            ...prev,
            phone: parsedUser.phone
          }));
        }
        
        // Fetch trip requests immediately with the parsed user data
        fetchTripRequests(parsedUser);
      } catch (err) {
        console.error('Error parsing user data:', err);
        window.location.href = '/';
      }
    } else {
      window.location.href = '/';
    }
  }, []); // Empty dependency array - runs only once on mount

  // Separate useEffect to fetch trips when user changes
  useEffect(() => {
    if (user) {
      fetchTripRequests(user);
    }
  }, [user]); // This runs whenever user changes

  const fetchTripRequests = async (currentUser = user) => {
    try {
      setIsLoading(true);
      setError('');
      
      if (!currentUser) {
        console.log('No user data available yet');
        setIsLoading(false);
        return;
      }

      // Build query parameters for user-specific requests
      const queryParams = new URLSearchParams();
      if (currentUser.id) {
        queryParams.append('userId', currentUser.id);
      }
      if (currentUser.email) {
        queryParams.append('userEmail', currentUser.email);
      }

      console.log('🔍 Fetching requests for user:', currentUser.email);
      console.log('📝 Query params:', queryParams.toString());
      
      const response = await fetch(`http://localhost:5000/api/user/requests?${queryParams}`);
      const data = await response.json();
      
      console.log('✅ User trip requests response:', data);
      
      if (response.ok && data.success) {
        setTripRequests(data.data || []);
        console.log(`📊 Loaded ${data.data?.length || 0} trips for user ${currentUser.email}`);
      } else {
        setError(data.message || 'Failed to fetch your trip requests');
        setTripRequests([]);
        console.log('❌ Error fetching trips:', data.message);
      }
    } catch (error) {
      console.error('❌ Error fetching trip requests:', error);
      setError('Network error. Please check if server is running.');
      setTripRequests([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTripChange = (field, value) => {
    setNewTrip(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleTripSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const tripData = {
      ...newTrip,
      customer_name: user?.name || 'Customer',
      phone: newTrip.phone || user?.phone || 'Not provided',
      customer_email: user?.email,  // Add user email
      customer_id: user?.id         // Add user ID
    };

    console.log('📤 Submitting trip request:', tripData);

    try {
      const response = await fetch('http://localhost:5000/api/requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tripData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        alert('Trip request submitted successfully!');
        setNewTrip({
          pickup_location: '',
          dropoff_location: '',
          pickup_time: '',
          passengers: 1,
          notes: '',
          phone: user?.phone || ''
        });
        // Refresh the trip list
        fetchTripRequests();
        setActiveTab('requests');
      } else {
        alert('Failed to submit trip request: ' + (data.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('❌ Error submitting trip:', error);
      alert('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfileUpdate = (updatedUser) => {
    console.log('Profile updated in dashboard:', updatedUser);
    setUser(updatedUser);
    
    // Update localStorage with new user data
    localStorage.setItem('user', JSON.stringify(updatedUser));
    
    // Update phone in trip form if user updates their phone
    if (updatedUser.phone) {
      setNewTrip(prev => ({
        ...prev,
        phone: updatedUser.phone
      }));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  // Show loading state only when we don't have user data AND we're loading
  if (!user && isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // Show error if no user data after loading
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-lg font-medium">Authentication Error</div>
          <p className="mt-2 text-gray-600">Please log in again</p>
          <button
            onClick={() => window.location.href = '/'}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
                <div className="text-red-600 text-sm font-medium">{error}</div>
                <button 
                  onClick={() => fetchTripRequests()}
                  className="mt-2 bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors"
                >
                  Retry Loading Trips
                </button>
              </div>
            )}
            <WelcomeCard user={user} tripRequests={tripRequests} />
          </div>
        );
      case 'new-trip':
        return (
          <TripForm
            newTrip={newTrip}
            onTripChange={handleTripChange}
            onSubmit={handleTripSubmit}
            isLoading={isLoading}
            user={user}
          />
        );
      case 'requests':
        return (
          <TripList
            tripRequests={tripRequests}
            isLoading={isLoading}
            onBookTrip={() => setActiveTab('new-trip')}
            error={error}
            onRetry={() => fetchTripRequests()}
          />
        );
      case 'profile':
        return <ProfileSection user={user} onProfileUpdate={handleProfileUpdate} />;
      default:
        return (
          <div className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
                <div className="text-red-600 text-sm">{error}</div>
              </div>
            )}
            <WelcomeCard user={user} tripRequests={tripRequests} />
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <DashboardHeader user={user} onLogout={handleLogout} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <DashboardTabs activeTab={activeTab} onTabChange={setActiveTab} />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {renderActiveTab()}
          </div>

          {/* Sidebar */}
          <DashboardSidebar tripRequests={tripRequests} />
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;