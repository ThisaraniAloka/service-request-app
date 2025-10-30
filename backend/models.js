const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
});

const initDB = async () => {
  try {
    // First, check if the table exists and has the correct structure
    const [tableInfo] = await pool.query(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'service_requests'
    `, [process.env.DB_NAME]);

    console.log('🔍 Checking service_requests table structure...');

    // Check if user tracking columns exist
    const hasCustomerEmail = tableInfo.some(column => column.COLUMN_NAME === 'customer_email');
    const hasCustomerId = tableInfo.some(column => column.COLUMN_NAME === 'customer_id');

    // Add missing columns
    const missingColumns = [
      { name: 'customer_email', type: 'VARCHAR(100)' },
      { name: 'customer_id', type: 'INT' },
      { name: 'created_at', type: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP' },
      { name: 'updated_at', type: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP' },
      { name: 'scheduled_time', type: 'DATETIME NULL' },
      { name: 'driver_id', type: 'INT NULL' },
      { name: 'vehicle_id', type: 'INT NULL' }
    ];

    for (const column of missingColumns) {
      const columnExists = tableInfo.some(col => col.COLUMN_NAME === column.name);
      if (!columnExists) {
        console.log(`➕ Adding ${column.name} column...`);
        try {
          await pool.query(`ALTER TABLE service_requests ADD COLUMN ${column.name} ${column.type}`);
        } catch (err) {
          console.log(`ℹ️ ${column.name} column might already exist:`, err.message);
        }
      }
    }

    // Create other tables if they don't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS contact_messages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL,
        phone VARCHAR(20),
        subject VARCHAR(200) NOT NULL,
        message TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        status ENUM('new','read','replied') DEFAULT 'new'
      );
    `);

    await pool.query(`
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

    console.log("✅ Database initialization completed successfully!");

  } catch (error) {
    console.error("❌ Database initialization error:", error);
  }
};

module.exports = { pool, initDB, bcrypt };