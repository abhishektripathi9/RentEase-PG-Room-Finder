import express from 'express';
import { query, pool } from '../config/db.js';
import { verifyJWT } from '../middleware/auth.js';

const router = express.Router();

// 1. POST /api/bookings (Create token booking or visit schedule)
// Optional auth - if authenticated, links to user_id, otherwise uses student user or tenant info
router.post('/', async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const {
      property_id,
      booking_type, // 'token_booking' | 'visit_schedule'
      room_type,
      move_in_date,
      visit_date,
      visit_time_slot,
      visit_mode,
      token_amount = 500,
      monthly_rent,
      payment_method,
      tenant_name,
      tenant_phone,
      tenant_email,
      user_id: explicitUserId
    } = req.body;

    if (!property_id || !tenant_name || !tenant_phone || !tenant_email) {
      connection.release();
      return res.status(400).json({
        success: false,
        message: 'Missing required booking details (property, name, phone, email).'
      });
    }

    await connection.beginTransaction();

    // Verify property exists
    const [properties] = await connection.query(
      'SELECT id, title, available_beds, total_beds, price_starting, room_types FROM properties WHERE id = ? FOR UPDATE',
      [property_id]
    );

    if (properties.length === 0) {
      await connection.rollback();
      connection.release();
      return res.status(404).json({ success: false, message: 'Selected property does not exist.' });
    }

    const prop = properties[0];

    // Atomically decrement available beds if token booking
    if (booking_type === 'token_booking') {
      if (prop.available_beds <= 0) {
        await connection.rollback();
        connection.release();
        return res.status(400).json({
          success: false,
          message: 'Sorry! No vacant beds currently available for instant reservation at this property.'
        });
      }

      await connection.query(
        'UPDATE properties SET available_beds = available_beds - 1 WHERE id = ? AND available_beds > 0',
        [property_id]
      );
    }

    // Determine user ID (either from auth token or existing student or default)
    let assignedUserId = explicitUserId;
    if (!assignedUserId && req.headers.authorization) {
      try {
        const token = req.headers.authorization.split(' ')[1];
        const jwtSecret = process.env.JWT_SECRET || 'super_secret_jwt_key_rentease_pro_admin_2026_secure_emerald';
        const decoded = (await import('jsonwebtoken')).default.verify(token, jwtSecret);
        assignedUserId = decoded.id;
      } catch (e) {
        // Continue with lookup by email
      }
    }

    if (!assignedUserId) {
      // Find or link with tenant email
      const [matchedUsers] = await connection.query('SELECT id FROM users WHERE email = ?', [tenant_email.toLowerCase().trim()]);
      if (matchedUsers.length > 0) {
        assignedUserId = matchedUsers[0].id;
      } else {
        // Fallback default student user id 6 or first student
        const [defaultStudents] = await connection.query("SELECT id FROM users WHERE role = 'student' LIMIT 1");
        assignedUserId = defaultStudents.length > 0 ? defaultStudents[0].id : 1;
      }
    }

    // Generate unique booking reference code
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const bookingCode = `RE-2026-${randomSuffix}`;

    const insertSql = `
      INSERT INTO bookings (
        booking_code, property_id, user_id, booking_type, room_type, move_in_date,
        visit_date, visit_time_slot, visit_mode, token_amount, monthly_rent,
        status, payment_status, payment_method, tenant_name, tenant_phone, tenant_email, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
    `;

    const finalTokenAmount = booking_type === 'token_booking' ? (parseFloat(token_amount) || 500) : 0;
    const finalPaymentStatus = booking_type === 'token_booking' ? 'paid' : 'waived';
    const finalMonthlyRent = parseFloat(monthly_rent) || prop.price_starting;

    const [insertResult] = await connection.query(insertSql, [
      bookingCode,
      property_id,
      assignedUserId,
      booking_type || 'token_booking',
      room_type || 'Twin Sharing Room',
      move_in_date || null,
      visit_date || null,
      visit_time_slot || null,
      visit_mode || 'in_person',
      finalTokenAmount,
      finalMonthlyRent,
      'confirmed',
      finalPaymentStatus,
      payment_method || (booking_type === 'token_booking' ? 'UPI / NetBanking' : 'Free Pass'),
      tenant_name,
      tenant_phone,
      tenant_email
    ]);

    await connection.commit();
    connection.release();

    return res.status(201).json({
      success: true,
      message: booking_type === 'token_booking'
        ? `Reservation confirmed! ₹${finalTokenAmount} token received. Beds hold active.`
        : 'Property visit scheduled successfully! Digital pass issued.',
      booking: {
        id: insertResult.insertId,
        booking_code: bookingCode,
        property_id,
        property_title: prop.title,
        booking_type,
        room_type: room_type || 'Twin Sharing Room',
        token_amount: finalTokenAmount,
        monthly_rent: finalMonthlyRent,
        status: 'confirmed',
        tenant_name,
        tenant_phone,
        tenant_email,
        created_at: new Date()
      }
    });
  } catch (err) {
    await connection.rollback();
    connection.release();
    console.error('Booking creation error:', err);
    return res.status(500).json({ success: false, message: 'Failed to process booking.' });
  }
});

// 2. GET /api/bookings/my (Student's Bookings and Scheduled Visits)
router.get('/my', verifyJWT, async (req, res) => {
  try {
    const sql = `
      SELECT b.*, p.title as property_title, p.city, p.locality, p.address, p.images
      FROM bookings b
      JOIN properties p ON b.property_id = p.id
      WHERE b.user_id = ? OR b.tenant_email = ?
      ORDER BY b.id DESC
    `;
    const rows = await query(sql, [req.user.id, req.user.email]);

    const formatted = rows.map(b => ({
      ...b,
      images: typeof b.images === 'string' ? JSON.parse(b.images) : (b.images || [])
    }));

    return res.json({
      success: true,
      count: formatted.length,
      data: formatted
    });
  } catch (err) {
    console.error('Error fetching student bookings:', err);
    return res.status(500).json({ success: false, message: 'Failed to load bookings.' });
  }
});

export default router;
