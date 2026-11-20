import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'Abhishek@123',
  database: process.env.DB_NAME || 'rentease_pro_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  timezone: '+05:30'
};

export const pool = mysql.createPool(dbConfig);

// Helper query runner
export const query = async (sql, params = []) => {
  const [rows] = await pool.query(sql, params);
  return rows;
};

// Check DB Connection
export const checkDbConnection = async () => {
  try {
    const connection = await pool.getConnection();
    await connection.ping();
    connection.release();
    return true;
  } catch (err) {
    console.error('❌ MySQL Connection Failed:', err.message);
    return false;
  }
};
