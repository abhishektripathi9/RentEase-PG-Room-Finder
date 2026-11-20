import express from 'express';
import { query } from '../config/db.js';
import { verifyJWT } from '../middleware/auth.js';

const router = express.Router();

// 1. POST /api/wishlist/toggle
router.post('/toggle', verifyJWT, async (req, res) => {
  try {
    const { property_id } = req.body;
    if (!property_id) {
      return res.status(400).json({ success: false, message: 'property_id is required.' });
    }

    const existing = await query('SELECT id FROM wishlists WHERE user_id = ? AND property_id = ?', [req.user.id, property_id]);

    if (existing.length > 0) {
      await query('DELETE FROM wishlists WHERE id = ?', [existing[0].id]);
      return res.json({ success: true, wishlisted: false, message: 'Removed from wishlist.' });
    } else {
      await query('INSERT INTO wishlists (user_id, property_id, created_at) VALUES (?, ?, NOW())', [req.user.id, property_id]);
      return res.json({ success: true, wishlisted: true, message: 'Saved to wishlist!' });
    }
  } catch (err) {
    console.error('Wishlist toggle error:', err);
    return res.status(500).json({ success: false, message: 'Failed to update wishlist.' });
  }
});

// 2. GET /api/wishlist
router.get('/', verifyJWT, async (req, res) => {
  try {
    const sql = `
      SELECT p.*, w.created_at as wishlisted_at
      FROM wishlists w
      JOIN properties p ON w.property_id = p.id
      WHERE w.user_id = ?
      ORDER BY w.id DESC
    `;
    const rows = await query(sql, [req.user.id]);

    const formatted = rows.map(p => ({
      ...p,
      is_verified: !!p.is_verified,
      amenities: typeof p.amenities === 'string' ? JSON.parse(p.amenities) : (p.amenities || []),
      images: typeof p.images === 'string' ? JSON.parse(p.images) : (p.images || []),
      room_types: typeof p.room_types === 'string' ? JSON.parse(p.room_types) : (p.room_types || [])
    }));

    return res.json({ success: true, count: formatted.length, data: formatted });
  } catch (err) {
    console.error('Wishlist fetch error:', err);
    return res.status(500).json({ success: false, message: 'Failed to retrieve wishlist.' });
  }
});

export default router;
