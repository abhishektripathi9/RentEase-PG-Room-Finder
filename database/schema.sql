-- ==========================================================
-- RentEase: PG & Room Finder - Database DDL Schema (MySQL)
-- ==========================================================

CREATE DATABASE IF NOT EXISTS rentease_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE rentease_db;

-- Table: owners
CREATE TABLE IF NOT EXISTS owners (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(50) NOT NULL,
    agency_name VARCHAR(255),
    verified BOOLEAN DEFAULT TRUE,
    rating DOUBLE DEFAULT 4.9,
    total_properties INT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: properties
CREATE TABLE IF NOT EXISTS properties (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    pg_type ENUM('BOYS', 'GIRLS', 'UNISEX', 'CO_LIVING') NOT NULL DEFAULT 'UNISEX',
    city VARCHAR(100) NOT NULL,
    locality VARCHAR(150) NOT NULL,
    address TEXT,
    latitude DOUBLE,
    longitude DOUBLE,
    starting_price DECIMAL(10,2) NOT NULL,
    deposit_amount DECIMAL(10,2) NOT NULL,
    notice_period_days INT DEFAULT 30,
    verified BOOLEAN DEFAULT TRUE,
    rating DOUBLE DEFAULT 4.8,
    review_count INT DEFAULT 0,
    food_included BOOLEAN DEFAULT TRUE,
    food_type ENUM('VEG', 'NON_VEG', 'VEG_NONVEG') DEFAULT 'VEG_NONVEG',
    gate_closing_time VARCHAR(50) DEFAULT '11:00 PM',
    visitors_allowed BOOLEAN DEFAULT TRUE,
    non_veg_allowed BOOLEAN DEFAULT TRUE,
    nearby_landmark VARCHAR(255),
    distance_to_landmark VARCHAR(100),
    owner_id BIGINT,
    owner_name VARCHAR(255),
    owner_phone VARCHAR(50),
    status VARCHAR(50) DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (owner_id) REFERENCES owners(id) ON DELETE SET NULL
);

-- Table: property_images
CREATE TABLE IF NOT EXISTS property_images (
    property_id BIGINT NOT NULL,
    image_url TEXT NOT NULL,
    FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE
);

-- Table: property_amenities
CREATE TABLE IF NOT EXISTS property_amenities (
    property_id BIGINT NOT NULL,
    amenity VARCHAR(100) NOT NULL,
    FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE
);

-- Table: room_types
CREATE TABLE IF NOT EXISTS room_types (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    property_id BIGINT NOT NULL,
    room_category ENUM('SINGLE', 'DOUBLE', 'TRIPLE', 'FOUR_PLUS') NOT NULL,
    title VARCHAR(255),
    price_per_month DECIMAL(10,2) NOT NULL,
    deposit_amount DECIMAL(10,2),
    total_beds INT DEFAULT 2,
    available_beds INT DEFAULT 1,
    has_attached_washroom BOOLEAN DEFAULT TRUE,
    has_ac BOOLEAN DEFAULT TRUE,
    has_balcony BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE
);

-- Table: bookings
CREATE TABLE IF NOT EXISTS bookings (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    booking_code VARCHAR(50) NOT NULL UNIQUE,
    property_id BIGINT NOT NULL,
    property_name VARCHAR(255),
    room_type_id BIGINT,
    room_category VARCHAR(50),
    tenant_name VARCHAR(255) NOT NULL,
    tenant_email VARCHAR(255) NOT NULL,
    tenant_phone VARCHAR(50) NOT NULL,
    id_proof_type VARCHAR(50),
    id_proof_number VARCHAR(100),
    move_in_date DATE,
    duration_months INT DEFAULT 6,
    monthly_rent DECIMAL(10,2) NOT NULL,
    deposit_paid DECIMAL(10,2),
    total_amount_paid DECIMAL(10,2),
    booking_status ENUM('CONFIRMED', 'PENDING', 'CANCELLED', 'COMPLETED') DEFAULT 'CONFIRMED',
    payment_method VARCHAR(50) DEFAULT 'UPI',
    payment_id VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: visits
CREATE TABLE IF NOT EXISTS visits (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    visit_code VARCHAR(50) NOT NULL UNIQUE,
    property_id BIGINT NOT NULL,
    property_name VARCHAR(255),
    visitor_name VARCHAR(255) NOT NULL,
    visitor_email VARCHAR(255) NOT NULL,
    visitor_phone VARCHAR(50) NOT NULL,
    visit_date DATE NOT NULL,
    time_slot VARCHAR(100) NOT NULL,
    visit_type ENUM('IN_PERSON', 'VIDEO_TOUR') DEFAULT 'IN_PERSON',
    status ENUM('SCHEDULED', 'COMPLETED', 'CANCELLED') DEFAULT 'SCHEDULED',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: reviews
CREATE TABLE IF NOT EXISTS reviews (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    property_id BIGINT NOT NULL,
    author_name VARCHAR(255) NOT NULL,
    author_role VARCHAR(255),
    rating DOUBLE NOT NULL DEFAULT 5.0,
    comment TEXT,
    cleanliness_rating DOUBLE DEFAULT 4.8,
    food_rating DOUBLE DEFAULT 4.5,
    wifi_rating DOUBLE DEFAULT 4.9,
    security_rating DOUBLE DEFAULT 4.9,
    value_rating DOUBLE DEFAULT 4.7,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE
);

-- Indexes for lightning fast searching
CREATE INDEX idx_properties_city ON properties(city);
CREATE INDEX idx_properties_pg_type ON properties(pg_type);
CREATE INDEX idx_properties_price ON properties(starting_price);
CREATE INDEX idx_bookings_tenant ON bookings(tenant_email);
CREATE INDEX idx_visits_visitor ON visits(visitor_email);
