import React, { useState, useEffect } from 'react';

const ProfileSection = ({ user, onProfileUpdate }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || ''
      });
      // Set image preview from user's profile_image
      if (user.profile_image) {
        setImagePreview(user.profile_image);
      }
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const saveProfileData = async (updatedUserData) => {
    try {
      // Include user ID in the request
      const profileData = {
        id: user.id, // Add user ID here
        name: updatedUserData.name,
        email: updatedUserData.email,
        phone: updatedUserData.phone,
        profile_image: updatedUserData.profile_image
      };

      const response = await fetch('http://localhost:5000/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      });

      if (response.ok) {
        const result = await response.json();
        
        // Update localStorage with the complete user data from server
        localStorage.setItem('user', JSON.stringify(result.user));

         window.dispatchEvent(new Event('userUpdated'));
        
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
        
        if (onProfileUpdate) {
          onProfileUpdate(result.user);
        }
        
        return result.user;
      } else {
        const errorData = await response.json();
        setMessage({ type: 'error', text: errorData.message || 'Failed to update profile' });
        throw new Error(errorData.message || 'Failed to update profile');
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
      throw error;
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type and size
      if (!file.type.startsWith('image/')) {
        setMessage({ type: 'error', text: 'Please select a valid image file (JPG, PNG, GIF)' });
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setMessage({ type: 'error', text: 'Image size must be less than 5MB' });
        return;
      }

      setImageLoading(true);
      
      // Create preview and convert to base64
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Image = reader.result;
        setImagePreview(base64Image);
        
        try {
          // Save image to database
          await saveProfileData({
            ...user,
            profile_image: base64Image
          });
        } catch (error) {
          // Revert preview if save fails
          setImagePreview(user.profile_image || '');
        } finally {
          setImageLoading(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const removeProfileImage = async () => {
    try {
      setImageLoading(true);
      
      const updatedUserData = {
        ...user,
        profile_image: null
      };

      await saveProfileData(updatedUserData);
      setImagePreview('');
      
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to remove profile image' });
    } finally {
      setImageLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      const updatedUserData = {
        ...user,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        profile_image: imagePreview || user.profile_image
      };

      await saveProfileData(updatedUserData);
    } catch (error) {
      // Error is already handled in saveProfileData
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Profile Settings 👤</h2>
      
      {/* Success/Error Message */}
      {message && (
        <div className={`mb-6 p-4 rounded-lg ${
          message.type === 'success' 
            ? 'bg-green-100 border border-green-400 text-green-700' 
            : 'bg-red-100 border border-red-400 text-red-700'
        }`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Profile Image Upload Section */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Photo</h3>
          <div className="flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8">
            {/* Profile Image Preview */}
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-2xl font-bold relative overflow-hidden border-4 border-white shadow-lg">
                {imageLoading ? (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200">
                    <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : imagePreview ? (
                  <img 
                    src={imagePreview} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  user.name.charAt(0).toUpperCase()
                )}
                
                {/* Online Indicator */}
                <div className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              
              {/* Remove Image Button */}
              {imagePreview && !imageLoading && (
                <button
                  type="button"
                  onClick={removeProfileImage}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                >
                  ×
                </button>
              )}
            </div>

            {/* Upload Controls */}
            <div className="flex-1">
              <p className="text-gray-600 text-sm mb-4">
                {imagePreview 
                  ? 'Your profile photo is saved!' 
                  : 'Upload a photo to personalize your account'
                }
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <label className="flex-1 cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    disabled={imageLoading}
                  />
                  <div className={`bg-white border-2 border-dashed border-blue-300 text-blue-600 px-4 py-3 rounded-lg text-center font-medium transition-all duration-200 ${
                    imageLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-50 hover:border-blue-400'
                  }`}>
                    {imageLoading ? '⏳ Uploading...' : '📷 Upload Photo'}
                  </div>
                </label>
                
                {imagePreview && !imageLoading && (
                  <button
                    type="button"
                    onClick={removeProfileImage}
                    className="bg-gray-100 text-gray-700 px-4 py-3 rounded-lg font-medium hover:bg-gray-200 transition-all duration-200"
                  >
                    Remove
                  </button>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-2">
                JPG, PNG or GIF • Max 5MB
              </p>
            </div>
          </div>
        </div>

        {/* Personal Information Section */}
        <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Personal Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Full Name *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-400">👤</span>
                </div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
                  placeholder="Enter your full name"
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Email Address *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-400">✉️</span>
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            {/* Phone Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Phone Number *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-400">📞</span>
                </div>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
                  placeholder="Enter your phone number"
                />
              </div>
              <p className="text-xs text-gray-500">
                We'll use this to contact you about your trips
              </p>
            </div>

            {/* Account Type (Read-only) */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Account Type
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-400">🎫</span>
                </div>
                <input
                  type="text"
                  value="Premium Customer"
                  readOnly
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed"
                />
              </div>
              <p className="text-xs text-green-600 font-medium">
                ✓ Verified Account
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg disabled:opacity-50 flex items-center justify-center space-x-2"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Saving Changes...</span>
              </>
            ) : (
              <>
                <span>💾</span>
                <span>Save All Changes</span>
              </>
            )}
          </button>
          
          <button
            type="button"
            onClick={() => {
              setFormData({
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || ''
              });
              setImagePreview(user.profile_image || '');
              setMessage('');
            }}
            className="px-6 py-4 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all duration-200"
          >
            🔄 Reset
          </button>
        </div>
      </form>

      {/* Security Notice */}
      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <div className="flex items-start space-x-3">
          <span className="text-yellow-600 text-lg">🔒</span>
          <div>
            <h4 className="font-semibold text-yellow-800">Security Notice</h4>
            <p className="text-yellow-700 text-sm mt-1">
              Your personal information and photos are secure. We never share your data with third parties.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSection;