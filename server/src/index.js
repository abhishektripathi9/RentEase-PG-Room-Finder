import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { checkDbConnection } from './config/db.js';

import authRoutes from './routes/auth.routes.js';
import propertiesRoutes from './routes/properties.routes.js';
import bookingsRoutes from './routes/bookings.routes.js';
import wishlistRoutes from './routes/wishlist.routes.js';
import ownerRoutes from './routes/owner.routes.js';
import adminRoutes from './routes/admin.routes.js';
import settingsRoutes from './routes/settings.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Health & Status
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    service: 'RentEase PRO Backend API (Node.js + Express + MySQL)',
    timestamp: new Date().toISOString()
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/properties', propertiesRoutes);
app.use('/api/bookings', bookingsRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/owner', ownerRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/settings', settingsRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

// Start Server
app.listen(PORT, async () => {
  console.log(`🚀 RentEase PRO Backend running on http://localhost:${PORT}`);
  const isConnected = await checkDbConnection();
  if (isConnected) {
    console.log('✅ Connected to MySQL Database (rentease_pro_db).');
  } else {
    console.warn('⚠️ Warning: MySQL database connection check failed. Verify DB credentials in .env.');
  }
});
