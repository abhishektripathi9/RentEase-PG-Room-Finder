USE rentease_pro_db;

-- Clear previous data
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE wishlists;
TRUNCATE TABLE bookings;
TRUNCATE TABLE properties;
TRUNCATE TABLE users;
TRUNCATE TABLE platform_settings;
SET FOREIGN_KEY_CHECKS = 1;

-- 1. Seed Users (Super Admin, PG Owners, Students)
-- Passwords will be populated by initDb.js using bcrypt hashes:
-- Super Admin: admin@rentease.in / Admin@123
-- Owners/Students: User@123
INSERT INTO users (id, name, email, phone, password, role, status, is_verified_host, created_at) VALUES
(1, 'Super Admin', 'admin@rentease.in', '+91 98765 00001', '$2a$10$tZ2eYVnFvPvZqW8c9Jm3q.EwN6s5eQ6P8dF7mK2hL1oR3pA9uYxTe', 'admin', 'active', TRUE, NOW()),
(2, 'Rohit Sharma', 'rohit.sharma@rentease.in', '+91 98450 12345', '$2a$10$tZ2eYVnFvPvZqW8c9Jm3q.EwN6s5eQ6P8dF7mK2hL1oR3pA9uYxTe', 'owner', 'active', TRUE, NOW()),
(3, 'Amit Verma', 'amit.verma@rentease.in', '+91 94150 67890', '$2a$10$tZ2eYVnFvPvZqW8c9Jm3q.EwN6s5eQ6P8dF7mK2hL1oR3pA9uYxTe', 'owner', 'active', TRUE, NOW()),
(4, 'Priya Singh', 'priya.singh@rentease.in', '+91 98110 54321', '$2a$10$tZ2eYVnFvPvZqW8c9Jm3q.EwN6s5eQ6P8dF7mK2hL1oR3pA9uYxTe', 'owner', 'active', TRUE, NOW()),
(5, 'Ramesh Gupta', 'ramesh.gupta@rentease.in', '+91 99360 11223', '$2a$10$tZ2eYVnFvPvZqW8c9Jm3q.EwN6s5eQ6P8dF7mK2hL1oR3pA9uYxTe', 'owner', 'active', TRUE, NOW()),
(6, 'Aarav Mehta', 'aarav.mehta@gmail.com', '+91 98200 44556', '$2a$10$tZ2eYVnFvPvZqW8c9Jm3q.EwN6s5eQ6P8dF7mK2hL1oR3pA9uYxTe', 'student', 'active', FALSE, NOW()),
(7, 'Ananya Patel', 'ananya.patel@gmail.com', '+91 97120 77889', '$2a$10$tZ2eYVnFvPvZqW8c9Jm3q.EwN6s5eQ6P8dF7mK2hL1oR3pA9uYxTe', 'student', 'active', FALSE, NOW());

-- 2. Seed 8 Realistic PG Listings (Prayagraj, Banda, Delhi NCR, Bangalore)
INSERT INTO properties (
  id, owner_id, title, slug, category, city, locality, address, landmark_distance,
  latitude, longitude, price_starting, security_deposit, token_amount, available_beds, total_beds,
  is_verified, verification_status, description, amenities, house_rules, images, rating, reviews_count, room_types
) VALUES
(
  1, 3, 'Shanti Niwas PG', 'shanti-niwas-pg-civil-lines', 'Unisex', 'Prayagraj', 'Civil Lines',
  '14/2 MG Marg, Near All Saints Cathedral, Civil Lines, Prayagraj 211001', '300m from Civil Lines Bus Stand',
  25.4519, 81.8340, 6500.00, 5000.00, 500.00, 2, 12,
  TRUE, 'approved',
  'Peaceful student residence in prime Civil Lines. Clean hygienic meals, high-speed Wi-Fi, 24-hr power backup, and dedicated silent study desks.',
  '["Wi-Fi", "Food Included", "Power Backup", "RO Water", "CCTV Security", "Daily Cleaning"]',
  '["Curfew 10:00 PM", "Zero Brokerage", "Quiet Study Hours"]',
  '["https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1000&q=80", "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1000&q=80"]',
  4.90, 84,
  '[{"type": "Twin Sharing Room", "price": 6500, "beds_total": 8, "beds_available": 2}, {"type": "Single Private Room", "price": 9500, "beds_total": 4, "beds_available": 0}]'
),
(
  2, 3, 'Scholar Heights', 'scholar-heights-near-uit-campus', 'Boys', 'Prayagraj', 'Near UIT Campus, Jhalwa',
  'Jhalwa Main Road, Opp. United Institute of Technology Gate 1, Prayagraj 211012', '200m from UIT Campus Gate',
  25.4312, 81.7705, 5800.00, 4500.00, 500.00, 4, 16,
  TRUE, 'approved',
  'Most preferred residence for UIT and IIIT-A students. Homely veg meals, fast broadband, and 24x7 inverter backup.',
  '["Wi-Fi", "3 Meals Daily", "Inverter Backup", "Study Desks", "RO Drinking Water", "Daily Cleaning"]',
  '["Curfew 10:30 PM", "Quiet Hours after 11 PM"]',
  '["https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1000&q=80", "https://images.unsplash.com/photo-1540518614846-7ede433c4b18?auto=format&fit=crop&w=1000&q=80"]',
  4.85, 62,
  '[{"type": "Twin Sharing Room", "price": 5800, "beds_total": 12, "beds_available": 3}, {"type": "Triple Sharing Room", "price": 4500, "beds_total": 4, "beds_available": 1}]'
),
(
  3, 3, 'Sangam Elite Residency', 'sangam-elite-residency-civil-lines', 'Girls', 'Prayagraj', 'Civil Lines',
  'Plot 8, Sardar Patel Marg, Civil Lines, Prayagraj 211001', '400m from High Court & Metro Link',
  25.4530, 81.8360, 7200.00, 6000.00, 500.00, 3, 14,
  TRUE, 'approved',
  'Ultra-secure residence for female students and civil service aspirants. Full-time warden supervision, AC rooms, and hygienic food.',
  '["Wi-Fi", "3 Meals Daily", "Split AC", "24x7 Warden", "Biometric Access", "Daily Housekeeping"]',
  '["Curfew 9:30 PM", "Parents Visit Welcome"]',
  '["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1000&q=80", "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=1000&q=80"]',
  4.92, 41,
  '[{"type": "Private Single Room", "price": 11000, "beds_total": 4, "beds_available": 1}, {"type": "Twin Sharing Room", "price": 7200, "beds_total": 10, "beds_available": 2}]'
),
(
  4, 5, 'Bundelkhand Stays', 'bundelkhand-stays-station-road-banda', 'Boys', 'Banda', 'Station Road',
  'Opp. Railway Station, Main Market, Banda 210001', '250m from Banda Railway Station',
  25.4754, 80.3347, 4500.00, 3000.00, 500.00, 5, 12,
  TRUE, 'approved',
  'Affordable and homely stay for banking and competitive exam aspirants in Banda. Fresh meals and power backup included.',
  '["Wi-Fi", "Fresh Homely Meals", "Power Inverter", "RO Filtered Water", "Study Desks"]',
  '["Curfew 10:00 PM", "Zero Brokerage"]',
  '["https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1000&q=80", "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1000&q=80"]',
  4.70, 23,
  '[{"type": "Twin Sharing Room", "price": 4500, "beds_total": 8, "beds_available": 3}, {"type": "Triple Sharing Room", "price": 3800, "beds_total": 4, "beds_available": 2}]'
),
(
  5, 2, 'Stanza Living - Koramangala Hub', 'stanza-living-koramangala-hub', 'Unisex', 'Bangalore', 'Koramangala 4th Block',
  '#42, 80 Feet Road, Near Sony World Signal, Koramangala, Bangalore 560034', '350m from Sony World Signal',
  12.9345, 77.6265, 12500.00, 12500.00, 500.00, 3, 16,
  TRUE, 'approved',
  'Modern tech-professional co-living with fiber internet, 3-course chef buffet, gym, and gaming lounge.',
  '["High-Speed Wi-Fi", "3 Meals Daily Buffet", "Split AC", "100% Power Backup", "Washing Machine", "Gym Access"]',
  '["No Curfew", "Visitors Allowed till 10 PM", "Zero Brokerage"]',
  '["https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1000&q=80", "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1000&q=80"]',
  4.95, 96,
  '[{"type": "Private Single Room", "price": 18500, "beds_total": 4, "beds_available": 1}, {"type": "Twin Sharing Room", "price": 12500, "beds_total": 12, "beds_available": 2}]'
),
(
  6, 2, 'Zolo Euphoria - HSR Layout', 'zolo-euphoria-hsr-layout', 'Boys', 'Bangalore', 'HSR Layout Sector 3',
  'Sector 3, 14th Main Road, HSR Layout, Bengaluru 560102', '500m from BDA Complex',
  12.9116, 77.6388, 9500.00, 9500.00, 500.00, 4, 14,
  TRUE, 'approved',
  'Comfortable PG for software interns and tech employees. Dedicated workstation desk in every room.',
  '["Wi-Fi", "North & South Indian Meals", "Air Conditioner", "Power Backup", "Laundromat", "CCTV 24x7"]',
  '["Curfew 11:30 PM", "Zero Brokerage"]',
  '["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1000&q=80", "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1000&q=80"]',
  4.80, 51,
  '[{"type": "Private Single Room", "price": 15000, "beds_total": 4, "beds_available": 1}, {"type": "Twin Sharing Room", "price": 9500, "beds_total": 10, "beds_available": 3}]'
),
(
  7, 4, 'Urban Oasis Co-Living', 'urban-oasis-noida-sector-62', 'Unisex', 'Delhi NCR', 'Noida Sector 62',
  'C-25, Sector 62, Near Electronic City Metro Station, Noida 201309', '600m from Metro Station',
  28.6280, 77.3649, 10500.00, 10500.00, 500.00, 6, 20,
  TRUE, 'approved',
  'Spacious co-living apartment tower in Noida IT Hub with coworking lounge, cafeteria, and fast Wi-Fi.',
  '["Fast Wi-Fi", "All Meals Included", "Split AC", "24/7 Power Backup", "Coworking Space", "Automatic Laundry"]',
  '["No Curfew", "Visitors Welcome", "Zero Brokerage"]',
  '["https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1000&q=80", "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1000&q=80"]',
  4.88, 73,
  '[{"type": "Private Single Room", "price": 16500, "beds_total": 6, "beds_available": 2}, {"type": "Twin Sharing Room", "price": 10500, "beds_total": 14, "beds_available": 4}]'
),
(
  8, 2, 'Green Nest Boutique Hostel', 'green-nest-boutique-indiranagar', 'Girls', 'Bangalore', 'Indiranagar 100ft Road',
  '#88, 12th Main Road, HAL 2nd Stage, Indiranagar, Bangalore 560038', '150m from Metro Station',
  12.9719, 77.6412, 13000.00, 13000.00, 500.00, 2, 10,
  TRUE, 'approved',
  'Newly renovated boutique PG for working women and tech professionals with chef-prepared meals and smart digital locks.',
  '["Fast Wi-Fi", "Breakfast & Dinner", "AC in All Rooms", "Washing Machine", "Smart Lock", "Daily Housekeeping"]',
  '["No Curfew", "Female Guests Only", "Zero Brokerage"]',
  '["https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1000&q=80", "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1000&q=80"]',
  4.94, 38,
  '[{"type": "Private Single Room", "price": 19500, "beds_total": 4, "beds_available": 1}, {"type": "Twin Sharing Room", "price": 13000, "beds_total": 6, "beds_available": 1}]'
);

-- 3. Seed Bookings
INSERT INTO bookings (
  id, booking_code, property_id, user_id, booking_type, room_type, move_in_date, visit_date,
  visit_time_slot, visit_mode, token_amount, monthly_rent, status, payment_status, payment_method,
  tenant_name, tenant_phone, tenant_email, created_at
) VALUES
(
  1, 'RE-2026-8941', 1, 6, 'token_booking', 'Twin Sharing Room', '2026-12-01', NULL,
  NULL, 'in_person', 500.00, 6500.00, 'confirmed', 'paid', 'UPI (GooglePay)',
  'Aarav Mehta', '+91 98200 44556', 'aarav.mehta@gmail.com', NOW() - INTERVAL 1 DAY
),
(
  2, 'RE-2026-8942', 2, 7, 'visit_schedule', 'Twin Sharing Room', NULL, '2026-11-25',
  '02:00 PM - 05:00 PM', 'in_person', 0.00, 5800.00, 'confirmed', 'waived', 'Visit Pass',
  'Ananya Patel', '+91 97120 77889', 'ananya.patel@gmail.com', NOW() - INTERVAL 5 HOUR
);

-- 4. Seed Platform Settings
INSERT INTO platform_settings (id, token_amount, zero_brokerage_text, featured_cities, platform_name, support_phone, support_email)
VALUES (
  1,
  500.00,
  '100% Zero Brokerage Guarantee on all Verified PGs',
  '["Prayagraj", "Banda", "Delhi NCR", "Bangalore"]',
  'RentEase',
  '+91 98765 43210',
  'support@rentease.in'
)
ON DUPLICATE KEY UPDATE token_amount = VALUES(token_amount);
