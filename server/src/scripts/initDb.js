import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function initDatabase() {
  console.log('🔄 Initializing RentEase PRO MySQL Database...');

  const host = process.env.DB_HOST || 'localhost';
  const port = parseInt(process.env.DB_PORT || '3306', 10);
  const user = process.env.DB_USER || 'root';
  const password = process.env.DB_PASSWORD || 'Abhishek@123';
  const dbName = process.env.DB_NAME || 'rentease_pro_db';

  // 1. Root Connection to ensure DB exists
  const rootConn = await mysql.createConnection({ host, port, user, password });
  await rootConn.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
  await rootConn.end();
  console.log(`✅ Database '${dbName}' created/verified.`);

  // 2. Connect directly to target database
  const db = await mysql.createConnection({ host, port, user, password, database: dbName, multipleStatements: true });

  // Read schema.sql
  const schemaPath = path.resolve(__dirname, '../../database/schema.sql');
  const schemaSql = fs.readFileSync(schemaPath, 'utf8');
  await db.query(schemaSql);
  console.log('✅ Tables created successfully from schema.sql');

  // Precompute Bcrypt hashes
  const adminPasswordHash = await bcrypt.hash('Admin@123', 10);
  const userPasswordHash = await bcrypt.hash('User@123', 10);

  // Check if users already seeded
  const [existingUsers] = await db.query('SELECT COUNT(*) as count FROM users');
  if (existingUsers[0].count === 0) {
    console.log('🌱 Seeding initial users...');
    await db.query(`
      INSERT INTO users (id, name, email, phone, password, role, status, is_verified_host, created_at) VALUES
      (1, 'Super Admin', 'admin@rentease.in', '+91 98765 00001', ?, 'admin', 'active', TRUE, NOW()),
      (2, 'Rohit Sharma (Bangalore Stays)', 'rohit.sharma@rentease.in', '+91 98450 12345', ?, 'owner', 'active', TRUE, NOW()),
      (3, 'Amit Verma (Prayagraj Hostels)', 'amit.verma@rentease.in', '+91 94150 67890', ?, 'owner', 'active', TRUE, NOW()),
      (4, 'Priya Singh (Delhi NCR Co-Living)', 'priya.singh@rentease.in', '+91 98110 54321', ?, 'owner', 'active', TRUE, NOW()),
      (5, 'Ramesh Gupta (Banda Stays)', 'ramesh.gupta@rentease.in', '+91 99360 11223', ?, 'owner', 'active', TRUE, NOW()),
      (6, 'Aarav Mehta', 'aarav.mehta@gmail.com', '+91 98200 44556', ?, 'student', 'active', FALSE, NOW()),
      (7, 'Ananya Patel', 'ananya.patel@gmail.com', '+91 97120 77889', ?, 'student', 'active', FALSE, NOW()),
      (8, 'Vikram Malhotra (Unverified Owner)', 'vikram.pending@rentease.in', '+91 91234 56780', ?, 'owner', 'active', FALSE, NOW());
    `, [
      adminPasswordHash,
      userPasswordHash,
      userPasswordHash,
      userPasswordHash,
      userPasswordHash,
      userPasswordHash,
      userPasswordHash,
      userPasswordHash
    ]);
  }

  // Check if properties already seeded
  const [existingProps] = await db.query('SELECT COUNT(*) as count FROM properties');
  if (existingProps[0].count === 0) {
    console.log('🌱 Seeding realistic Indian PG listings...');
    const seedPath = path.resolve(__dirname, '../../database/seed.sql');
    const seedSql = fs.readFileSync(seedPath, 'utf8');
    // Remove the user inserts since we already handled them with bcrypt hashes
    const propSeedSql = seedSql.substring(seedSql.indexOf('-- 2. Seed Properties'));
    await db.query(propSeedSql);
    console.log('✅ PG Properties, Bookings, Wishlists & Settings seeded successfully.');
  }

  await db.end();
  console.log('🎉 RentEase PRO Database Initialization Complete!');
}

initDatabase().catch(err => {
  console.error('❌ Database Initialization Failed:', err);
  process.exit(1);
});
