import express from 'express';
import { query } from '../config/db.js';
import { verifyJWT, requireRole } from '../middleware/auth.js';

const router = express.Router();

// Protect all owner routes: Must be verified JWT and role 'owner' or 'admin'
router.use(verifyJWT, requireRole('owner', 'admin'));

// 1. POST /api/owner/properties (Submit new PG for Admin review)
router.post('/properties', async (req, res) => {
  try {
    const {
      title,
      category = 'Unisex',
      city,
      locality,
      address,
      landmark_distance,
      latitude,
      longitude,
      price_starting,
      security_deposit = 0,
      total_beds = 10,
      description,
      amenities = [],
      house_rules = [],
      images = [],
      room_types = []
    } = req.body;

    if (!title || !city || !locality || !address || !price_starting) {
      return res.status(400).json({
        success: false,
        message: 'Please provide required property details (title, city, locality, address, starting price).'
      });
    }

    const defaultImages = images && images.length > 0 ? images : [
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1000&q=80'
    ];

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const insertSql = `
      INSERT INTO properties (
        owner_id, title, slug, category, city, locality, address, landmark_distance,
        latitude, longitude, price_starting, security_deposit, token_amount, available_beds,
        total_beds, is_verified, verification_status, description, amenities, house_rules,
        images, rating, reviews_count, room_types, created_at
      ) VALUES (
        ?, ?, ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, 500.00, ?,
        ?, FALSE, 'pending', ?, ?, ?,
        ?, 5.00, 0, ?, NOW()
      )
    `;

    const result = await query(insertSql, [
      req.user.id,
      title,
      slug,
      category,
      city,
      locality,
      address,
      landmark_distance || null,
      latitude || 12.9352,
      longitude || 77.6245,
      parseFloat(price_starting),
      parseFloat(security_deposit) || 0,
      parseInt(total_beds, 10),
      parseInt(total_beds, 10),
      description || '',
      JSON.stringify(amenities),
      JSON.stringify(house_rules),
      JSON.stringify(defaultImages),
      JSON.stringify(room_types.length > 0 ? room_types : [
        { type: 'Twin Sharing Room', price: parseFloat(price_starting), beds_total: total_beds, beds_available: total_beds }
      ])
    ]);

    return res.status(201).json({
      success: true,
      message: 'PG listing submitted successfully! Sent to RentEase PRO Admin queue for physical/KYC audit.',
      propertyId: result.insertId
    });
  } catch (err) {
    console.error('Error submitting owner property:', err);
    return res.status(500).json({ success: false, message: 'Failed to submit property listing.' });
  }
});

// 2. GET /api/owner/properties (List properties owned by this owner)
router.get('/properties', async (req, res) => {
  try {
    const rows = await query('SELECT * FROM properties WHERE owner_id = ? ORDER BY id DESC', [req.user.id]);

    const formatted = rows.map(p => ({
      ...p,
      is_verified: !!p.is_verified,
      amenities: typeof p.amenities === 'string' ? JSON.parse(p.amenities) : (p.amenities || []),
      house_rules: typeof p.house_rules === 'string' ? JSON.parse(p.house_rules) : (p.house_rules || []),
      images: typeof p.images === 'string' ? JSON.parse(p.images) : (p.images || []),
      room_types: typeof p.room_types === 'string' ? JSON.parse(p.room_types) : (p.room_types || [])
    }));

    return res.json({ success: true, count: formatted.length, data: formatted });
  } catch (err) {
    console.error('Error loading owner properties:', err);
    return res.status(500).json({ success: false, message: 'Failed to retrieve owner listings.' });
  }
});

// 3. GET /api/owner/bookings (Bookings and visits for this owner's properties)
router.get('/bookings', async (req, res) => {
  try {
    const sql = `
      SELECT b.*, p.title as property_title, p.city, p.locality
      FROM bookings b
      JOIN properties p ON b.property_id = p.id
      WHERE p.owner_id = ?
      ORDER BY b.id DESC
    `;
    const rows = await query(sql, [req.user.id]);
    return res.json({ success: true, count: rows.length, data: rows });
  } catch (err) {
    console.error('Error fetching owner bookings:', err);
    return res.status(500).json({ success: false, message: 'Failed to load bookings.' });
  }
});

// 4. PATCH /api/owner/bookings/:id (Update status e.g. confirmed/completed/cancelled)
router.patch('/bookings/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['confirmed', 'completed', 'cancelled', 'pending'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value.' });
    }

    // Verify ownership of property
    const checkSql = `
      SELECT b.id FROM bookings b
      JOIN properties p ON b.property_id = p.id
      WHERE b.id = ? AND (p.owner_id = ? OR ? = 'admin')
    `;
    const existing = await query(checkSql, [id, req.user.id, req.user.role]);

    if (existing.length === 0) {
      return res.status(403).json({ success: false, message: 'Unauthorized or booking not found.' });
    }

    await query('UPDATE bookings SET status = ?, updated_at = NOW() WHERE id = ?', [status, id]);

    return res.json({ success: true, message: `Booking status updated to '${status}'.` });
  } catch (err) {
    console.error('Error updating booking:', err);
    return res.status(500).json({ success: false, message: 'Failed to update booking status.' });
  }
});

export default router;
