// backend/models.js
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

dotenv.config();

const DB_NAME = process.env.DB_NAME || 'trip_requests';

let dbPool; // Will hold the pool connected to the database

// 1️⃣ Connect to MySQL server without specifying a database
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'db',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  port: process.env.DB_PORT || 3306,
});

// 2️⃣ Wait for MySQL server to be ready
const waitForDB = async () => {
  let connected = false;
  while (!connected) {
    try {
      await pool.query('SELECT 1');
      connected = true;
      console.log('✅ MySQL server connected!');
    } catch (err) {
      console.log('⏳ Waiting for DB...', err.message);
      await new Promise(res => setTimeout(res, 2000));
    }
  }
};

// 3️⃣ Initialize database and tables
const initDB = async () => {
  await waitForDB();

  try {
    // Create the database if it doesn't exist
    await pool.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\`;`);
    console.log(`✅ Database '${DB_NAME}' ensured`);

    // Connect to the newly created database
    dbPool = mysql.createPool({
      host: process.env.DB_HOST || 'db',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: DB_NAME,
      port: process.env.DB_PORT || 3306,
    });

    // Create tables
    await dbPool.query(`
      CREATE TABLE IF NOT EXISTS service_requests (
        id INT AUTO_INCREMENT PRIMARY KEY,
        customer_name VARCHAR(255),
        phone VARCHAR(50),
        pickup_location VARCHAR(255),
        dropoff_location VARCHAR(255),
        pickup_time DATETIME,
        passengers INT,
        notes TEXT,
        status VARCHAR(50) DEFAULT 'pending',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        scheduled_time DATETIME NULL,
        driver_id INT NULL,
        vehicle_id INT NULL,
        customer_email VARCHAR(255) NULL,
        customer_id INT NULL
      );
    `);

    await dbPool.query(`
      CREATE TABLE IF NOT EXISTS contact_messages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL,
        phone VARCHAR(20),
        subject VARCHAR(200),
        message TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        status ENUM('new','read','replied') DEFAULT 'new'
      );
    `);

    await dbPool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        phone VARCHAR(20),
        profile_image LONGTEXT,
        role ENUM('user','admin') DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      );
    `);

    await dbPool.query(`
      CREATE TABLE IF NOT EXISTS vehicles (
        id INT AUTO_INCREMENT PRIMARY KEY,
        plate VARCHAR(50) NOT NULL,
        capacity INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await dbPool.query(`
      CREATE TABLE IF NOT EXISTS drivers (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        phone VARCHAR(20),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Seed default admin
    const [admins] = await dbPool.query(`SELECT * FROM users WHERE role='admin'`);
    if (admins.length === 0) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await dbPool.query(
        `INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)`,
        ['Admin', 'admin@gmail.com', hashedPassword, 'admin']
      );
      console.log('➕ Default admin created: admin@gmail.com / admin123');
    }

    // Seed vehicles
    const [vehicles] = await dbPool.query(`SELECT * FROM vehicles`);
    if (vehicles.length === 0) {
      await dbPool.query(`
        INSERT INTO vehicles (plate, capacity) VALUES
        ('ABC-123', 15),
        ('XYZ-789', 25),
        ('DEF-456', 30)
      `);
      console.log('➕ Default vehicles added');
    }

    // Seed drivers
    const [drivers] = await dbPool.query(`SELECT * FROM drivers`);
    if (drivers.length === 0) {
      await dbPool.query(`
        INSERT INTO drivers (name, phone) VALUES
        ('John Driver', '+1-555-0101'),
        ('Sarah Smith', '+1-555-0102'),
        ('Mike Johnson', '+1-555-0103')
      `);
      console.log('➕ Default drivers added');
    }

    console.log("✅ DB initialization completed!");
  } catch (err) {
    console.error('❌ DB init error:', err);
  }
};

// Export the pool connected to the DB AFTER initDB runs
const getDB = () => {
  if (!dbPool) {
    throw new Error('DB not initialized yet. Call initDB() first.');
  }
  return dbPool;
};

module.exports = { initDB, getDB, bcrypt };
