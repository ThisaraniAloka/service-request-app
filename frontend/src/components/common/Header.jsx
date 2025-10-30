import React, { useState, useEffect } from 'react';
import LoginModal from './LoginModal';

function Header() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }

    // Listen for storage changes to update user data in real-time
    const handleStorageChange = () => {
      const updatedUserData = localStorage.getItem('user');
      if (updatedUserData) {
        setUser(JSON.parse(updatedUserData));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Also listen for custom event that we'll trigger from ProfileSection
    window.addEventListener('userUpdated', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('userUpdated', handleStorageChange);
    };
  }, []);

  const smoothScrollTo = (elementId) => {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  const handleNavClick = (e, elementId) => {
    e.preventDefault();
    smoothScrollTo(elementId);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    window.location.reload();
  };

  const handleDashboardClick = () => {
    // Check if user is admin and redirect accordingly
    if (user && user.role === 'admin') {
      window.location.href = '/admin';
    } else {
      window.location.href = '/dashboard';
    }
  };

  return (
    <>
      <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo Section */}
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">R</span>
                </div>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  RideSync
                </h1>
                <p className="text-xs text-gray-500 -mt-1">Premium Coach Services</p>
              </div>
            </div>

            {/* Navigation Menu - Hidden on mobile */}
            <nav className="hidden md:flex space-x-8">
              <a 
                href="#home" 
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200"
                onClick={(e) => handleNavClick(e, 'home')}
              >
                Home
              </a>            
              <a 
                href="#about" 
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200"
                onClick={(e) => handleNavClick(e, 'about')}
              >
                About
              </a>
              <a 
                href="#services" 
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200"
                onClick={(e) => handleNavClick(e, 'services')}
              >
                Services
              </a>
              <a 
                href="#contact" 
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200"
                onClick={(e) => handleNavClick(e, 'contact')}
              >
                Contact
              </a>
            </nav>

            {/* User Section */}
            {user ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold relative overflow-hidden">
                    {user.profile_image ? (
                      <img 
                        src={user.profile_image} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      user.name.charAt(0).toUpperCase()
                    )}
                  </div>
                  <span className="text-gray-700 font-medium hidden sm:block">
                    Hi, {user.name}
                    {user.role === 'admin' && (
                      <span className="text-xs text-red-600 ml-1">(Admin)</span>
                    )}
                  </span>
                </div>
                <button 
                  onClick={handleDashboardClick}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
                >
                  {user.role === 'admin' ? 'Admin Panel' : 'Dashboard'}
                </button>
                <button 
                  onClick={handleLogout}
                  className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition-all duration-200"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setIsLoginModalOpen(true)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg"
              >
                Login
              </button>
            )}
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden border-t border-gray-200 mt-2 pt-2">
            <nav className="flex justify-around">
              <a 
                href="#home" 
                className="text-gray-700 hover:text-blue-600 text-sm font-medium"
                onClick={(e) => handleNavClick(e, 'home')}
              >
                Home
              </a>
              <a 
                href="#services" 
                className="text-gray-700 hover:text-blue-600 text-sm font-medium"
                onClick={(e) => handleNavClick(e, 'services')}
              >
                Services
              </a>
              <a 
                href="#about" 
                className="text-gray-700 hover:text-blue-600 text-sm font-medium"
                onClick={(e) => handleNavClick(e, 'about')}
              >
                About
              </a>
              <a 
                href="#contact" 
                className="text-gray-700 hover:text-blue-600 text-sm font-medium"
                onClick={(e) => handleNavClick(e, 'contact')}
              >
                Contact
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* Login Modal */}
      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
      />
    </>
  );
}

export default Header;