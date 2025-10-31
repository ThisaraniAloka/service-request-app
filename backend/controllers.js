const { getDB, bcrypt } = require('./models');

// Get requests for specific user (for customer dashboard)
const getUserRequests = async (req, res) => {
  try {
    const { userId, userEmail } = req.query;
    
    console.log('🔍 Fetching requests for user:', { userId, userEmail });

    let query = `SELECT * FROM service_requests WHERE 1=1`;
    const queryParams = [];

    if (userId) {
      query += ` AND customer_id = ?`;
      queryParams.push(userId);
    } else if (userEmail) {
      query += ` AND customer_email = ?`;
      queryParams.push(userEmail);
    } else {
      return res.json({
        success: true,
        data: [],
        message: "No user information provided"
      });
    }

    query += ` ORDER BY created_at DESC, id DESC`;

    console.log('📝 User requests query:', query);
    console.log('📊 Query params:', queryParams);

    const db = getDB();
    const [rows] = await db.query(query, queryParams);

    console.log(`✅ Found ${rows.length} requests for user`);
    
    res.json({
      success: true,
      data: rows,
      total: rows.length
    });
  } catch (err) {
    console.error("❌ Error fetching user requests:", err);
    res.status(500).json({ 
      success: false,
      message: "Failed to fetch your trip requests",
      error: err.message 
    });
  }
};

// Get all requests (for public API - used by admin)
const getRequests = async (req, res) => {
  try {
    const db = getDB();
    const [rows] = await db.query("SELECT * FROM service_requests ORDER BY created_at DESC, id DESC");
    res.json({
      success: true,
      data: rows
    });
  } catch (err) {
    console.error("❌ Error fetching requests:", err);
    res.status(500).json({ 
      success: false,
      message: "Failed to fetch requests",
      error: err.message 
    });
  }
};

// Create request - now includes user info
const createRequest = async (req, res) => {
  const { customer_name, phone, pickup_location, dropoff_location, pickup_time, passengers, notes, customer_email, customer_id } = req.body;
  
  if (!customer_name || !phone || !pickup_location || !dropoff_location || !pickup_time || !passengers) {
    return res.status(400).json({ success: false, message: "Missing required fields" });
  }

  try {
    const db = getDB();
    const [result] = await db.query(
      `INSERT INTO service_requests 
       (customer_name, phone, pickup_location, dropoff_location, pickup_time, passengers, notes, customer_email, customer_id) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        customer_name, 
        phone, 
        pickup_location, 
        dropoff_location, 
        pickup_time, 
        passengers, 
        notes || '', 
        customer_email || null,
        customer_id || null
      ]
    );
    
    res.status(201).json({ 
      success: true,
      id: result.insertId, 
      message: "Trip request created successfully" 
    });
  } catch (err) {
    console.error("❌ Database error:", err);
    res.status(400).json({ success: false, message: "Invalid data", error: err.message });
  }
};

// Get requests with filtering and pagination (for admin)
const getAdminRequests = async (req, res) => {
  try {
    console.log('📋 Fetching admin requests with filters:', req.query);
    
    const { status = 'all', search = '', page = 1, limit = 10 } = req.query;

    let baseQuery = `SELECT * FROM service_requests WHERE 1=1`;
    let countQuery = `SELECT COUNT(*) as total FROM service_requests WHERE 1=1`;
    const queryParams = [];
    const countParams = [];

    if (status && status !== 'all') {
      baseQuery += ` AND status = ?`;
      countQuery += ` AND status = ?`;
      queryParams.push(status);
      countParams.push(status);
    }

    if (search && search.trim() !== '') {
      baseQuery += ` AND (customer_name LIKE ? OR phone LIKE ?)`;
      countQuery += ` AND (customer_name LIKE ? OR phone LIKE ?)`;
      const searchTerm = `%${search}%`;
      queryParams.push(searchTerm, searchTerm);
      countParams.push(searchTerm, searchTerm);
    }

    baseQuery += ` ORDER BY created_at DESC, id DESC`;
    const offset = (parseInt(page) - 1) * parseInt(limit);
    baseQuery += ` LIMIT ? OFFSET ?`;
    queryParams.push(parseInt(limit), offset);

    console.log('🔍 Final query:', baseQuery);
    console.log('📊 Query params:', queryParams);

    const db = getDB();
    const [countResult] = await db.query(countQuery, countParams);
    const total = countResult[0]?.total || 0;

    const [rows] = await db.query(baseQuery, queryParams);

    const pagination = {
      total,
      pages: Math.ceil(total / limit),
      current: parseInt(page),
      limit: parseInt(limit)
    };

    console.log(`✅ Found ${rows.length} requests`);
    console.log('📄 Pagination:', pagination);

    res.json({ success: true, requests: rows, pagination });
  } catch (err) {
    console.error("❌ Error fetching admin requests:", err);
    res.status(500).json({ success: false, message: "Failed to fetch requests", error: err.message });
  }
};

// Update request status
const updateRequestStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  console.log('🔄 Updating status for request:', id, 'to:', status);

  if (!status) {
    return res.status(400).json({ success: false, message: "Status is required" });
  }

  const validStatuses = ['pending', 'approved', 'rejected', 'scheduled'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ success: false, message: "Invalid status" });
  }

  try {
    const db = getDB();
    const [result] = await db.query(
      `UPDATE service_requests SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      [status, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Request not found" });
    }

    res.json({ success: true, message: "Status updated successfully" });
  } catch (err) {
    console.error("❌ Error updating status:", err);
    res.status(500).json({ success: false, message: "Failed to update status", error: err.message });
  }
};

// Schedule a request
const scheduleRequest = async (req, res) => {
  const { id } = req.params;
  const { scheduled_time, driver_id, vehicle_id } = req.body;

  console.log('📅 Scheduling request:', id, 'with data:', req.body);

  if (!scheduled_time) {
    return res.status(400).json({ success: false, message: "Scheduled time is required" });
  }

  try {
    const db = getDB();
    const [result] = await db.query(
      `UPDATE service_requests 
       SET status = 'scheduled', scheduled_time = ?, driver_id = ?, vehicle_id = ?, updated_at = CURRENT_TIMESTAMP 
       WHERE id = ?`,
      [scheduled_time, driver_id || null, vehicle_id || null, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Request not found" });
    }

    res.json({ success: true, message: "Request scheduled successfully" });
  } catch (err) {
    console.error("❌ Error scheduling request:", err);
    res.status(500).json({ success: false, message: "Failed to schedule request", error: err.message });
  }
};

// Contact form controller
const createContactMessage = async (req, res) => {
  const { name, email, phone, subject, message } = req.body;
  
  if (!name || !email || !subject || !message) {
    return res.status(400).json({ success: false, message: "Missing required fields: name, email, subject, and message are required" });
  }

  try {
    const db = getDB();
    const [result] = await db.query(
      `INSERT INTO contact_messages (name, email, phone, subject, message) VALUES (?, ?, ?, ?, ?)`,
      [name, email, phone || '', subject, message]
    );
    
    res.status(201).json({ success: true, id: result.insertId, message: "Thank you for your message! We'll get back to you soon." });
  } catch (err) {
    console.error("❌ Database error:", err);
    res.status(500).json({ success: false, message: "Failed to save your message. Please try again later.", error: err.message });
  }
};

// Get all contact messages (for admin panel)
const getContactMessages = async (req, res) => {
  try {
    const db = getDB();
    const [rows] = await db.query("SELECT * FROM contact_messages ORDER BY created_at DESC");
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch messages", error: err.message });
  }
};

// User registration
const registerUser = async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;

  if (!name || !email || !password || !confirmPassword) {
    return res.status(400).json({ success: false, message: "All fields are required" });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ success: false, message: "Passwords do not match" });
  }

  if (password.length < 6) {
    return res.status(400).json({ success: false, message: "Password must be at least 6 characters" });
  }

  try {
    const db = getDB();
    const [existingUsers] = await db.query("SELECT id FROM users WHERE email = ?", [email]);

    if (existingUsers.length > 0) {
      return res.status(400).json({ success: false, message: "User already exists with this email" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const [result] = await db.query("INSERT INTO users (name, email, password) VALUES (?, ?, ?)", [name, email, hashedPassword]);

    res.status(201).json({ success: true, id: result.insertId, message: "Registration successful! Please login." });
  } catch (err) {
    console.error("❌ Registration error:", err);
    res.status(500).json({ success: false, message: "Registration failed. Please try again.", error: err.message });
  }
};

// User login
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: "Email and password are required" });
  }

  try {
    const db = getDB();
    const [users] = await db.query("SELECT * FROM users WHERE email = ?", [email]);

    if (users.length === 0) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    const user = users[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    res.status(200).json({ 
      success: true,
      message: "Login successful!",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        profile_image: user.profile_image,
        role: user.role
      }
    });
  } catch (err) {
    console.error("❌ Login error:", err);
    res.status(500).json({ success: false, message: "Login failed. Please try again.", error: err.message });
  }
};

// Update user profile
const updateUserProfile = async (req, res) => {
  const { id, name, email, phone, profile_image } = req.body;
  
  console.log('👤 Updating profile for user ID:', id);
  
  if (!id) {
    return res.status(400).json({ success: false, message: "User ID is required" });
  }

  try {
    const db = getDB();
    const [result] = await db.query(
      `UPDATE users SET name = ?, email = ?, phone = ?, profile_image = ? WHERE id = ?`,
      [name, email, phone, profile_image, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const [users] = await db.query("SELECT * FROM users WHERE id = ?", [id]);
    const user = users[0];

    res.status(200).json({
      success: true,
      message: "Profile updated successfully!",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        profile_image: user.profile_image,
        role: user.role
      }
    });
  } catch (err) {
    console.error("❌ Profile update error:", err);
    res.status(500).json({ success: false, message: "Failed to update profile", error: err.message });
  }
};

// Get user by ID
const getUserById = async (req, res) => {
  const { id } = req.params;
  
  try {
    const db = getDB();
    const [users] = await db.query("SELECT * FROM users WHERE id = ?", [id]);
    
    if (users.length === 0) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const user = users[0];
    res.json({ success: true, data: { id: user.id, name: user.name, email: user.email, phone: user.phone, profile_image: user.profile_image, role: user.role } });
  } catch (err) {
    console.error("❌ Get user error:", err);
    res.status(500).json({ success: false, message: "Failed to get user", error: err.message });
  }
};

module.exports = { 
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
  getUserRequests
};
