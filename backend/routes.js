const express = require('express');
const { 
  getRequests, 
  createRequest, 
  createContactMessage, 
  getContactMessages,
  registerUser,
  loginUser,
  updateUserProfile,
  getUserById,
  getAdminRequests,
  updateRequestStatus,
  scheduleRequest,
  getUserRequests,
  getDailyAnalytics
} = require('./controllers');
const router = express.Router();

// Trip request routes
router.get('/requests', getRequests);  // For admin - gets ALL requests
router.get('/user/requests', getUserRequests);  // For customers - gets user-specific requests
router.post('/requests', createRequest);

// Admin trip request routes
router.get('/admin/requests', getAdminRequests);
router.put('/admin/requests/:id/status', updateRequestStatus);
router.put('/admin/requests/:id/schedule', scheduleRequest);

// Contact message routes
router.post('/contact', createContactMessage);
router.get('/contact/messages', getContactMessages);

// Auth routes
router.post('/auth/register', registerUser);
router.post('/auth/login', loginUser);

// User profile routes
router.put('/user/profile', updateUserProfile);
router.get('/user/:id', getUserById);

router.get('/admin/analytics/daily', getDailyAnalytics);


module.exports = router;