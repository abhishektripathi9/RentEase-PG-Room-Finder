import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from '../config/db.js';
import { verifyJWT } from '../middleware/auth.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_jwt_key_rentease_pro_admin_2026_secure_emerald';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role, name: user.name },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
};

// 1. POST /api/auth/register (Student or Owner only)
router.post('/register', async (req, res) => {
  try {
    const { name, email, phone, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide name, email, and password.' });
    }

    const assignedRole = role ? role.toLowerCase() : 'student';

    // STRICT CHECK: Disallow registering as admin
    if (assignedRole === 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Security Violation: Administrator accounts cannot be created via public registration.'
      });
    }

    if (!['student', 'owner'].includes(assignedRole)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role specified. Only 'student' or 'owner' are permitted."
      });
    }

    // Check existing email
    const existing = await query('SELECT id FROM users WHERE email = ?', [email.toLowerCase().trim()]);
    if (existing.length > 0) {
      return res.status(409).json({ success: false, message: 'An account with this email address already exists.' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await query(
      `INSERT INTO users (name, email, phone, password, role, status, is_verified_host, created_at)
       VALUES (?, ?, ?, ?, ?, 'active', ?, NOW())`,
      [name.trim(), email.toLowerCase().trim(), phone || null, hashedPassword, assignedRole, assignedRole === 'owner' ? false : false]
    );

    const newUser = {
      id: result.insertId,
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone: phone || null,
      role: assignedRole,
      status: 'active',
      is_verified_host: false
    };

    const token = generateToken(newUser);

    return res.status(201).json({
      success: true,
      message: `Account registered successfully as ${assignedRole}.`,
      token,
      user: newUser
    });
  } catch (err) {
    console.error('Registration error:', err);
    return res.status(500).json({ success: false, message: 'Internal server error during registration.' });
  }
});

// 2. POST /api/auth/login (Customer & Owner portal login)
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    const users = await query('SELECT * FROM users WHERE email = ?', [email.toLowerCase().trim()]);
    if (users.length === 0) {
      return res.status(401).json({ success: false, message: 'Invalid credentials. User not found.' });
    }

    const user = users[0];

    // Check account status
    if (user.status === 'suspended') {
      return res.status(403).json({ success: false, message: 'Your account has been suspended. Please contact support.' });
    }

    // Admins must use /admin/login portal
    if (user.role === 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Admin accounts must authenticate via the RentEase PRO Admin Portal (/admin/login).'
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const userProfile = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      status: user.status,
      is_verified_host: !!user.is_verified_host
    };

    const token = generateToken(userProfile);

    return res.json({
      success: true,
      message: `Welcome back, ${user.name}!`,
      token,
      user: userProfile
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ success: false, message: 'Internal server error during login.' });
  }
});

// 3. POST /api/auth/admin-login (Strict Admin Portal Authentication)
router.post('/admin-login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    const users = await query('SELECT * FROM users WHERE email = ?', [email.toLowerCase().trim()]);
    if (users.length === 0) {
      return res.status(401).json({ success: false, message: 'Invalid administrative credentials.' });
    }

    const user = users[0];

    // Verify Role is strictly 'admin'
    if (user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access Denied: This portal requires Super Administrator privileges.'
      });
    }

    if (user.status === 'suspended') {
      return res.status(403).json({ success: false, message: 'This administrative account is disabled.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid administrative credentials.' });
    }

    const adminProfile = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: 'admin',
      status: user.status,
      is_verified_host: true
    };

    const token = generateToken(adminProfile);

    return res.json({
      success: true,
      message: 'Admin access authorized.',
      token,
      user: adminProfile
    });
  } catch (err) {
    console.error('Admin login error:', err);
    return res.status(500).json({ success: false, message: 'Internal server error during admin authentication.' });
  }
});

// 4. GET /api/auth/me (Current user session)
router.get('/me', verifyJWT, (req, res) => {
  return res.json({
    success: true,
    user: req.user
  });
});

export default router;
