-- RentEase PRO - Database Schema (MySQL 8.0+)
CREATE DATABASE IF NOT EXISTS rentease_pro_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE rentease_pro_db;

-- 1. Users Table (Strict 3-Role Architecture)
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  email VARCHAR(191) NOT NULL UNIQUE,
  phone VARCHAR(25) NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('student', 'owner', 'admin') NOT NULL DEFAULT 'student',
  status ENUM('active', 'suspended') NOT NULL DEFAULT 'active',
  is_verified_host BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_role (role),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Properties Table (Indian PG & Co-Living Listings)
CREATE TABLE IF NOT EXISTS properties (
  id INT AUTO_INCREMENT PRIMARY KEY,
  owner_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NULL,
  category ENUM('Boys', 'Girls', 'Unisex') NOT NULL DEFAULT 'Unisex',
  city VARCHAR(100) NOT NULL,
  locality VARCHAR(150) NOT NULL,
  address TEXT NOT NULL,
  landmark_distance VARCHAR(150) NULL,
  latitude DECIMAL(10, 7) NULL,
  longitude DECIMAL(10, 7) NULL,
  price_starting DECIMAL(10, 2) NOT NULL,
  security_deposit DECIMAL(10, 2) DEFAULT 0.00,
  token_amount DECIMAL(10, 2) DEFAULT 500.00,
  available_beds INT NOT NULL DEFAULT 8,
  total_beds INT NOT NULL DEFAULT 12,
  is_verified BOOLEAN NOT NULL DEFAULT FALSE,
  verification_status ENUM('pending', 'approved', 'rejected') NOT NULL DEFAULT 'pending',
  rejection_reason TEXT NULL,
  description TEXT NULL,
  amenities JSON NULL,
  house_rules JSON NULL,
  images JSON NULL,
  rating DECIMAL(3, 2) DEFAULT 4.80,
  reviews_count INT DEFAULT 16,
  room_types JSON NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_city (city),
  INDEX idx_category (category),
  INDEX idx_verified (is_verified),
  INDEX idx_status_prop (verification_status),
  INDEX idx_price (price_starting)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Bookings & Scheduled Visits Table
CREATE TABLE IF NOT EXISTS bookings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  booking_code VARCHAR(50) UNIQUE NOT NULL,
  property_id INT NOT NULL,
  user_id INT NOT NULL,
  booking_type ENUM('token_booking', 'visit_schedule') NOT NULL DEFAULT 'token_booking',
  room_type VARCHAR(100) DEFAULT 'Twin Sharing',
  move_in_date DATE NULL,
  visit_date DATE NULL,
  visit_time_slot VARCHAR(50) NULL,
  visit_mode ENUM('in_person', 'video_call') DEFAULT 'in_person',
  token_amount DECIMAL(10, 2) DEFAULT 500.00,
  monthly_rent DECIMAL(10, 2) DEFAULT 0.00,
  status ENUM('confirmed', 'pending', 'completed', 'cancelled') NOT NULL DEFAULT 'confirmed',
  payment_status ENUM('paid', 'pending', 'waived') NOT NULL DEFAULT 'paid',
  payment_method VARCHAR(50) DEFAULT 'UPI / Card',
  tenant_name VARCHAR(150) NOT NULL,
  tenant_phone VARCHAR(30) NOT NULL,
  tenant_email VARCHAR(191) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_booking_user (user_id),
  INDEX idx_booking_property (property_id),
  INDEX idx_booking_code (booking_code),
  INDEX idx_booking_type (booking_type),
  INDEX idx_booking_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Wishlist Table
CREATE TABLE IF NOT EXISTS wishlists (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  property_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_user_property (user_id, property_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Platform Settings Table
CREATE TABLE IF NOT EXISTS platform_settings (
  id INT PRIMARY KEY DEFAULT 1,
  token_amount DECIMAL(10, 2) DEFAULT 500.00,
  zero_brokerage_text VARCHAR(255) DEFAULT '100% Zero Brokerage Guarantee on all Verified PGs',
  featured_cities JSON NULL,
  platform_name VARCHAR(100) DEFAULT 'RentEase PRO',
  support_phone VARCHAR(50) DEFAULT '+91 98765 43210',
  support_email VARCHAR(100) DEFAULT 'support@rentease.in',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
