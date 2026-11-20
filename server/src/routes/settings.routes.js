import express from 'express';
import { query } from '../config/db.js';

const router = express.Router();

// GET /api/settings/public (Public settings for Trust Banner, Guarantee & Cities)
router.get('/public', async (req, res) => {
  try {
    const rows = await query('SELECT * FROM platform_settings WHERE id = 1');
    const settings = rows.length > 0 ? rows[0] : {
      id: 1,
      token_amount: 500,
      zero_brokerage_text: '100% Zero Brokerage Guarantee on all Verified PGs',
      featured_cities: ['Bangalore', 'Prayagraj', 'Delhi NCR', 'Banda'],
      platform_name: 'RentEase PRO',
      support_phone: '+91 98765 43210',
      support_email: 'support@rentease.in'
    };

    if (typeof settings.featured_cities === 'string') {
      settings.featured_cities = JSON.parse(settings.featured_cities);
    }

    return res.json({
      success: true,
      data: {
        token_amount: settings.token_amount,
        zero_brokerage_text: settings.zero_brokerage_text,
        featured_cities: settings.featured_cities,
        platform_name: settings.platform_name,
        support_phone: settings.support_phone,
        support_email: settings.support_email
      }
    });
  } catch (err) {
    console.error('Public settings error:', err);
    return res.status(500).json({ success: false, message: 'Failed to retrieve public settings.' });
  }
});

export default router;
