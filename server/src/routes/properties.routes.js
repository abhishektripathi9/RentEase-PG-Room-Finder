import express from 'express';
import { query } from '../config/db.js';

const router = express.Router();

// 1. GET /api/properties (Public Storefront with Multi-Criteria Filtering)
router.get('/', async (req, res) => {
  try {
    const {
      city,
      category,
      roomType,
      maxBudget,
      locality,
      query: searchQuery,
      sort
    } = req.query;

    let sql = `
      SELECT p.*, u.name as owner_name, u.phone as owner_phone, u.is_verified_host
      FROM properties p
      JOIN users u ON p.owner_id = u.id
      WHERE p.is_verified = TRUE AND p.verification_status = 'approved'
    `;
    const params = [];

    // Filter by City
    if (city && city !== 'All Cities' && city !== 'ALL') {
      sql += ' AND p.city = ?';
      params.push(city);
    }

    // Filter by Category (Boys, Girls, Unisex)
    if (category && category !== 'ALL') {
      sql += ' AND p.category = ?';
      params.push(category);
    }

    // Filter by Max Budget
    if (maxBudget) {
      sql += ' AND p.price_starting <= ?';
      params.push(parseFloat(maxBudget));
    }

    // Filter by Locality
    if (locality) {
      sql += ' AND p.locality LIKE ?';
      params.push(`%${locality}%`);
    }

    // Search query (matches title, locality, address, landmark)
    if (searchQuery && searchQuery.trim() !== '') {
      sql += ' AND (p.title LIKE ? OR p.locality LIKE ? OR p.address LIKE ? OR p.landmark_distance LIKE ?)';
      const term = `%${searchQuery.trim()}%`;
      params.push(term, term, term, term);
    }

    // Sorting
    if (sort === 'price_asc') {
      sql += ' ORDER BY p.price_starting ASC';
    } else if (sort === 'price_desc') {
      sql += ' ORDER BY p.price_starting DESC';
    } else if (sort === 'rating_desc') {
      sql += ' ORDER BY p.rating DESC, p.reviews_count DESC';
    } else {
      sql += ' ORDER BY p.id DESC';
    }

    const rows = await query(sql, params);

    // Parse JSON columns safely
    const formatted = rows.map(item => ({
      ...item,
      is_verified: !!item.is_verified,
      is_verified_host: !!item.is_verified_host,
      amenities: typeof item.amenities === 'string' ? JSON.parse(item.amenities) : (item.amenities || []),
      house_rules: typeof item.house_rules === 'string' ? JSON.parse(item.house_rules) : (item.house_rules || []),
      images: typeof item.images === 'string' ? JSON.parse(item.images) : (item.images || []),
      room_types: typeof item.room_types === 'string' ? JSON.parse(item.room_types) : (item.room_types || [])
    }));

    // If roomType filter requested, filter post-parse
    let result = formatted;
    if (roomType && roomType !== 'ALL') {
      result = formatted.filter(p => {
        return p.room_types && p.room_types.some(rt => rt.type.toLowerCase().includes(roomType.toLowerCase()));
      });
    }

    return res.json({
      success: true,
      count: result.length,
      data: result
    });
  } catch (err) {
    console.error('Error fetching properties:', err);
    return res.status(500).json({ success: false, message: 'Failed to retrieve properties.' });
  }
});

// 2. GET /api/properties/:id (Property Details)
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const sql = `
      SELECT p.*, u.name as owner_name, u.email as owner_email, u.phone as owner_phone, u.is_verified_host
      FROM properties p
      JOIN users u ON p.owner_id = u.id
      WHERE p.id = ?
    `;
    const rows = await query(sql, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Property not found.' });
    }

    const item = rows[0];
    const property = {
      ...item,
      is_verified: !!item.is_verified,
      is_verified_host: !!item.is_verified_host,
      amenities: typeof item.amenities === 'string' ? JSON.parse(item.amenities) : (item.amenities || []),
      house_rules: typeof item.house_rules === 'string' ? JSON.parse(item.house_rules) : (item.house_rules || []),
      images: typeof item.images === 'string' ? JSON.parse(item.images) : (item.images || []),
      room_types: typeof item.room_types === 'string' ? JSON.parse(item.room_types) : (item.room_types || [])
    };

    return res.json({
      success: true,
      data: property
    });
  } catch (err) {
    console.error('Error retrieving property:', err);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
});

export default router;
