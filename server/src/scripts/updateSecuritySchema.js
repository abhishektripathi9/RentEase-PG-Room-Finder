import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

async function updateSecuritySchema() {
  const host = process.env.DB_HOST || 'localhost';
  const port = parseInt(process.env.DB_PORT || '3306', 10);
  const user = process.env.DB_USER || 'root';
  const password = process.env.DB_PASSWORD || 'Abhishek@123';
  const dbName = process.env.DB_NAME || 'rentease_pro_db';

  const db = await mysql.createConnection({ host, port, user, password, database: dbName });

  console.log('🔒 Applying Security & Access Control Schema updates...');

  // 1. Add permissions column to users if not present
  try {
    await db.query(`
      ALTER TABLE users 
      ADD COLUMN permissions JSON NULL AFTER is_verified_host;
    `);
    console.log('✅ Added `permissions` JSON column to users table.');
  } catch (err) {
    if (err.code === 'ER_DUP_FIELDNAME') {
      console.log('ℹ️ `permissions` column already exists.');
    } else {
      console.warn('Column notice:', err.message);
    }
  }

  // 2. Set Super Admin default permissions
  await db.query(`
    UPDATE users 
    SET permissions = '["all", "approve_pg", "manage_bookings", "manage_users", "manage_settings", "security_access"]'
    WHERE role = 'admin';
  `);

  // 3. Create Audit Logs Table for Security Tracking
  await db.query(`
    CREATE TABLE IF NOT EXISTS security_audit_logs (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NULL,
      actor_name VARCHAR(150) NOT NULL,
      actor_email VARCHAR(191) NOT NULL,
      action VARCHAR(100) NOT NULL,
      target_user_email VARCHAR(191) NULL,
      details TEXT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_actor (actor_email),
      INDEX idx_action (action)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);
  console.log('✅ `security_audit_logs` table verified.');

  // Insert initial seed logs
  const [existingLogs] = await db.query('SELECT COUNT(*) as count FROM security_audit_logs');
  if (existingLogs[0].count === 0) {
    await db.query(`
      INSERT INTO security_audit_logs (actor_name, actor_email, action, target_user_email, details, created_at)
      VALUES 
      ('Super Admin', 'admin@rentease.in', 'SYSTEM_INITIALIZED', 'admin@rentease.in', 'RentEase PRO Security Gateway Initialized with 256-bit JWT & Strict 3-Role RBAC', NOW() - INTERVAL 2 DAY),
      ('Super Admin', 'admin@rentease.in', 'ACCESS_POLICY_SET', 'rohit.sharma@rentease.in', 'Owner permissions granted for Bangalore Hub properties', NOW() - INTERVAL 1 DAY);
    `);
    console.log('✅ Initial security logs seeded.');
  }

  await db.end();
  console.log('🛡️ Security & Access Control database ready!');
}

updateSecuritySchema().catch(console.error);
