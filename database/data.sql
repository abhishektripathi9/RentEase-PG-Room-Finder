-- ==========================================================
-- RentEase: PG & Room Finder - Database Initial Data (DML)
-- ==========================================================

USE rentease_db;

-- 1. Insert Owners
INSERT INTO owners (id, name, email, phone, agency_name, verified, rating, total_properties) VALUES
(1, 'Vikram Malhotra', 'vikram.m@rentease.io', '+91 98450 12345', 'Malhotra Luxury Living', TRUE, 4.9, 3),
(2, 'Ananya Deshmukh', 'ananya.d@rentease.io', '+91 97123 45678', 'UrbanNest Co-living Spaces', TRUE, 4.8, 3);

-- 2. Insert Properties
INSERT INTO properties (id, name, description, pg_type, city, locality, address, latitude, longitude, starting_price, deposit_amount, notice_period_days, verified, rating, review_count, food_included, food_type, gate_closing_time, visitors_allowed, non_veg_allowed, nearby_landmark, distance_to_landmark, owner_id, owner_name, owner_phone, status) VALUES
(1, 'Zolo Starlight Luxury Co-Living', 'Premium smart co-living space in Koramangala 4th Block. High-speed 300 Mbps fiber, buffet meals 3 times a day, biometric keyless access, gaming lounge, and zero brokerage.', 'UNISEX', 'Bangalore', 'Koramangala 4th Block', 'Plot 104, 80 Feet Road, 4th Block, Koramangala, Bengaluru 560034', 12.9345, 77.6265, 12500.00, 15000.00, 30, TRUE, 4.9, 48, TRUE, 'VEG_NONVEG', 'No Curfew', TRUE, TRUE, 'Sony World Signal', '350m to Sony Signal', 1, 'Vikram Malhotra', '+91 98450 12345', 'ACTIVE'),
(2, 'UrbanHaven Girls Executive PG', 'Dedicated safe, upscale girls PG in HSR Layout Sector 1. 24x7 security guard, CCTV coverage, biometric entry, chef-cooked nutritious meals, and air-conditioned suites.', 'GIRLS', 'Bangalore', 'HSR Layout Sector 1', '14th Main Rd, Sector 1, HSR Layout, Bengaluru 560102', 12.9121, 77.6446, 10500.00, 12000.00, 30, TRUE, 4.8, 36, TRUE, 'VEG_NONVEG', '10:30 PM', FALSE, TRUE, 'Agara Lake Park', '600m to Agara Lake', 2, 'Ananya Deshmukh', '+91 97123 45678', 'ACTIVE'),
(3, 'TechHub Boys PG & Coliving', 'Modern tech-worker focused Boys PG located 5 minutes from ITPL Whitefield. High-speed Wi-Fi, study pods, laundry service, healthy meals, and spacious bike parking.', 'BOYS', 'Bangalore', 'Whitefield ITPL', 'Near Pattandur Agrahara Metro, Whitefield, Bengaluru 560066', 12.9798, 77.7289, 8000.00, 10000.00, 30, TRUE, 4.7, 52, TRUE, 'VEG_NONVEG', 'No Curfew', TRUE, TRUE, 'Pattandur Agrahara Metro', '300m to Metro Station', 1, 'Vikram Malhotra', '+91 98450 12345', 'ACTIVE'),
(4, 'Nexus Coliving & Suites', 'Vibrant co-living community in Phase 1 Hinjewadi. Fully furnished designer studios, cafeteria, gym, co-working workstations, regular events, and free shuttle to Infosys & Wipro campus.', 'UNISEX', 'Pune', 'Hinjewadi Phase 1', 'Behind Rajiv Gandhi Infotech Park, Hinjewadi Phase 1, Pune 411057', 18.5913, 73.7389, 9000.00, 12000.00, 30, TRUE, 4.8, 41, TRUE, 'VEG_NONVEG', 'No Curfew', TRUE, TRUE, 'Infosys Circle', '800m to Infosys Campus', 2, 'Ananya Deshmukh', '+91 97123 45678', 'ACTIVE'),
(5, 'Aura Elite Residences PG', 'Luxury PG & serviced accommodation 5 minutes from Cyber Hub Gurgaon. Ultra-modern amenities, soundproof rooms, gourmet North & Continental meals, ergonomic Herman Miller desks.', 'UNISEX', 'Delhi NCR', 'DLF Phase 2 / Cyber City', 'Sector 25, DLF Phase 2, Gurugram 122002', 28.4901, 77.0895, 14000.00, 18000.00, 30, TRUE, 4.9, 65, TRUE, 'VEG_NONVEG', 'No Curfew', TRUE, TRUE, 'Cyber Hub Rapid Metro', '400m to Cyber Hub', 1, 'Vikram Malhotra', '+91 98450 12345', 'ACTIVE'),
(6, 'Silicon Grove Luxury PG', 'Premier PG for IT professionals next to Raheja Mindspace. Fiber optics, Hyderabadi & North Indian cuisine, biometric security, air-conditioned rooms with power backup.', 'BOYS', 'Hyderabad', 'Madhapur / Hitec City', 'Near Mindspace Circle, Madhapur, Hyderabad 500081', 17.4435, 78.3772, 9500.00, 12000.00, 30, TRUE, 4.8, 29, TRUE, 'VEG_NONVEG', 'No Curfew', TRUE, TRUE, 'Hitec City Metro', '500m to Metro Station', 2, 'Ananya Deshmukh', '+91 97123 45678', 'ACTIVE');

-- 3. Insert Property Images
INSERT INTO property_images (property_id, image_url) VALUES
(1, 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1200&q=80'),
(1, 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80'),
(2, 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1200&q=80'),
(2, 'https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=1200&q=80'),
(3, 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1200&q=80'),
(4, 'https://images.unsplash.com/photo-1540518614846-7ede433c4ef0?auto=format&fit=crop&w=1200&q=80'),
(5, 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80'),
(6, 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1200&q=80');

-- 4. Insert Amenities
INSERT INTO property_amenities (property_id, amenity) VALUES
(1, 'Wi-Fi'), (1, '3 Meals Included'), (1, 'AC'), (1, 'Power Backup'), (1, 'Attached Bathroom'), (1, 'Daily Housekeeping'), (1, 'Washing Machine'), (1, 'Biometric Access'), (1, 'Gym'), (1, 'Gaming Zone'),
(2, 'Wi-Fi'), (2, '3 Meals Included'), (2, 'AC'), (2, 'Power Backup'), (2, 'Attached Bathroom'), (2, 'Daily Housekeeping'), (2, 'Washing Machine'), (2, 'Biometric Access'), (2, 'CCTV Security'),
(3, 'Wi-Fi'), (3, '3 Meals Included'), (3, 'Power Backup'), (3, 'Attached Bathroom'), (3, 'Daily Housekeeping'), (3, 'Washing Machine'), (3, 'CCTV Security'),
(4, 'Wi-Fi'), (4, '3 Meals Included'), (4, 'AC'), (4, 'Power Backup'), (4, 'Attached Bathroom'), (4, 'Daily Housekeeping'), (4, 'Washing Machine'), (4, 'Gym'), (4, 'Coworking Space'),
(5, 'Wi-Fi'), (5, '3 Meals Included'), (5, 'AC'), (5, 'Power Backup'), (5, 'Attached Bathroom'), (5, 'Daily Housekeeping'), (5, 'Washing Machine'), (5, 'Biometric Access'), (5, 'Gym'),
(6, 'Wi-Fi'), (6, '3 Meals Included'), (6, 'AC'), (6, 'Power Backup'), (6, 'Attached Bathroom'), (6, 'Daily Housekeeping'), (6, 'Washing Machine'), (6, 'Biometric Access'), (6, 'Gym');

-- 5. Insert Room Types
INSERT INTO room_types (property_id, room_category, title, price_per_month, deposit_amount, total_beds, available_beds, has_attached_washroom, has_ac, has_balcony) VALUES
(1, 'SINGLE', 'Private Executive Single Room', 18500.00, 20000.00, 1, 1, TRUE, TRUE, TRUE),
(1, 'DOUBLE', 'Twin Sharing Premium Room', 12500.00, 15000.00, 2, 2, TRUE, TRUE, FALSE),
(1, 'TRIPLE', 'Triple Sharing Economy Suite', 9500.00, 12000.00, 3, 1, TRUE, TRUE, FALSE),
(2, 'SINGLE', 'Deluxe Single Room with Balcony', 16000.00, 18000.00, 1, 1, TRUE, TRUE, TRUE),
(2, 'DOUBLE', 'Twin Sharing Air-Conditioned', 10500.00, 12000.00, 2, 2, TRUE, TRUE, FALSE),
(3, 'SINGLE', 'Single Studio Pod', 14000.00, 15000.00, 1, 1, TRUE, TRUE, FALSE),
(3, 'DOUBLE', 'Double Sharing Executive', 9500.00, 11000.00, 2, 1, TRUE, FALSE, FALSE),
(4, 'SINGLE', 'Studio Apartment with Kitchenette', 17000.00, 18000.00, 1, 1, TRUE, TRUE, TRUE),
(4, 'DOUBLE', 'Twin Sharing Premium', 9000.00, 11000.00, 2, 2, TRUE, TRUE, FALSE),
(5, 'SINGLE', 'Executive Studio Suite', 22000.00, 25000.00, 1, 1, TRUE, TRUE, TRUE),
(5, 'DOUBLE', 'Twin Sharing Luxury Room', 14000.00, 16000.00, 2, 2, TRUE, TRUE, FALSE),
(6, 'SINGLE', 'Single Room with Workstation', 16500.00, 18000.00, 1, 1, TRUE, TRUE, FALSE),
(6, 'DOUBLE', 'Twin Sharing Executive', 9500.00, 11000.00, 2, 2, TRUE, TRUE, FALSE);

-- 6. Insert Sample Bookings
INSERT INTO bookings (booking_code, property_id, property_name, room_category, tenant_name, tenant_email, tenant_phone, id_proof_type, id_proof_number, move_in_date, duration_months, monthly_rent, deposit_paid, total_amount_paid, booking_status, payment_method, payment_id) VALUES
('RE-2026-B1042', 1, 'Zolo Starlight Luxury Co-Living', 'DOUBLE', 'Arjun Verma', 'arjun.v@gmail.com', '+91 99887 76655', 'AADHAR', 'XXXX-XXXX-9842', '2026-09-15', 6, 12500.00, 15000.00, 15000.00, 'CONFIRMED', 'UPI', 'UPI/REF/938472910');

-- 7. Insert Sample Visits
INSERT INTO visits (visit_code, property_id, property_name, visitor_name, visitor_email, visitor_phone, visit_date, time_slot, visit_type, status, notes) VALUES
('VST-4821', 1, 'Zolo Starlight Luxury Co-Living', 'Rahul Mehta', 'rahul.m@gmail.com', '+91 98765 43210', '2026-09-12', '10:00 AM - 12:00 PM', 'IN_PERSON', 'SCHEDULED', 'Wants to inspect room ventilation and Wi-Fi speed.');
