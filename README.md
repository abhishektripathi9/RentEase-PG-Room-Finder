# 🏠 RentEase – PG & Room Finder

[![Full Stack](https://img.shields.io/badge/Full_Stack-2026_Featured-00D2FF?style=for-the-badge&logo=codeigniter&logoColor=black)](https://github.com)
[![React.js](https://img.shields.io/badge/React.js-19.x-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![Java](https://img.shields.io/badge/Java-21_/_22-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)](https://openjdk.org)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.3.3-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=for-the-badge&logo=mysql&logoColor=white)](https://mysql.com)
[![REST API](https://img.shields.io/badge/REST_API-OpenAPI_/_Swagger-499D4A?style=for-the-badge&logo=swagger&logoColor=white)](http://localhost:8080/swagger-ui.html)

> **Comprehensive full-stack PG and rental housing portal with intuitive filter search, booking workflow, verified listings, owner portal, and interactive map interface.**

---

## 🌟 Key Capabilities

### 🔍 1. Intuitive Filter Search
- **Multi-parameter Filters**:
  - **Gender / PG Type**: Unisex / Co-living, Boys, Girls
  - **Room Sharing**: Private Single Room, Twin Sharing, Triple Sharing
  - **Budget Slider**: Dynamic monthly rent filter (₹4,000 – ₹30,000/mo)
  - **Amenities Multi-Select**: Wi-Fi, 3 Meals Buffet, AC, Power Backup, Attached Bathroom, Daily Housekeeping, Washing Machine, Biometric Security, Gym
  - **House Rules**: Curfew-free (No Curfew), Visitors Allowed, Non-Veg Allowed
  - **Locality Search**: Instant search across tech hubs (Koramangala, HSR Layout, Hinjewadi, Cyber City, Hitec City, Whitefield)

### 🗺️ 2. Interactive Map Interface (Leaflet + OpenStreetMap)
- Custom neon price pins on map (e.g. `₹12.5k`)
- Two-way interactive sync: Hovering over a property card highlights its map marker; clicking a map marker scrolls to and highlights the property card
- Proximity tags showing walking distance to Metro stations, Tech parks, and Universities

### 🛡️ 3. Verified Listings & Room Tours
- **Physical Inspection & KYC Badges**: 100% physically audited properties with verified landlord credentials
- **Photo Galleries**: High-res room walkthroughs and amenities
- **Weekly Meal Menu**: Comprehensive daily schedule (Breakfast, Lunch, Dinner - Veg/Non-Veg)
- **Verified Resident Reviews**: Category ratings for Cleanliness, Food Quality, Wi-Fi Speed, Security, and Value

### 💳 4. Seamless Booking & Visit Scheduling Workflow
- **Free Property Visit Scheduling**: Pick visit date, time slot (Morning, Afternoon, Evening), and tour mode (In-Person Walkthrough or Live Video Tour) with instant visit pass
- **Instant Bed Reservation**: Room selection, tenant KYC details (Aadhar/PAN/Passport), transparent rent breakdown (0% Brokerage guarantee, refundable security deposit), simulated payment (UPI, Card, NetBanking), and instant printable digital confirmation voucher with celebratory confetti

### 🏢 5. Landlord / Owner Management Portal
- **Real-Time KPI Dashboard**: Total listed properties, occupancy rate (%), active tenants, monthly rent inflow, and pending visit requests
- **Listing Manager**: View, update, pause, or remove PG listings
- **4-Step Property Creator Wizard**: Multi-step wizard to list new PGs with coordinates, room sharing prices, amenities, and house rules
- **Tenant Applications & Visit Queue**: Instant approve/decline actions on incoming inquiries
- **Tenant Rent Ledger**: Track monthly rent status (Paid, Due, Overdue) with one-click automated reminder triggers

---

## 🛠️ Technology Stack

| Layer | Technologies Used |
|---|---|
| **Frontend** | React 19, Vite, Vanilla Modern CSS Design System, Lucide Icons, Leaflet & React-Leaflet, Canvas Confetti |
| **Backend** | Java 21/22, Spring Boot 3.3.3, Spring Web MVC, Spring Data JPA / Hibernate, Spring Validation, Springdoc OpenAPI / Swagger |
| **Database** | MySQL 8.0 (Production DDL/DML scripts in `database/`) + Zero-Config Embedded H2 in MySQL Compatibility Mode |
| **Architecture** | Clean Layered REST Architecture (`controller`, `service`, `repository`, `model`, `config`) |

---

## 🚀 Quick Start Guide

### 1. Launch Frontend (React + Vite)
```bash
# Double-click run-frontend.bat or in terminal:
cd frontend
npm run dev
```
Open **`http://localhost:5173`** in your browser.

---

### 2. Launch Backend (Java + Spring Boot)

#### Option A: One-Click Runner (Zero-Config In-Memory DB with MySQL Mode)
```bash
# Double-click run-backend.bat or in terminal:
cd backend
run.bat
```
The backend starts on **`http://localhost:8080`**.
- **Swagger UI Interactive API Docs**: [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)
- **H2 Database Console**: [http://localhost:8080/h2-console](http://localhost:8080/h2-console) (JDBC URL: `jdbc:h2:mem:renteasedb`, User: `sa`, Password: empty)

#### Option B: Running with Standalone MySQL
1. Initialize the database schema and sample seeds:
   ```bash
   mysql -u root -p < database/schema.sql
   mysql -u root -p rentease_db < database/data.sql
   ```
2. Run backend with the MySQL profile:
   ```bash
   cd backend
   run.bat -Dspring-boot.run.profiles=mysql
   ```

---

## 📡 REST API Documentation (Swagger / OpenAPI)

When the backend is running, explore all endpoints interactively at:
**`http://localhost:8080/swagger-ui.html`**

Key REST endpoints:
- `GET /api/properties`: Search & filter PGs by city, gender, price, amenities, keyword
- `GET /api/properties/{id}`: Detailed property profile with rooms, reviews, and amenities
- `POST /api/properties`: Create new property listing (Owner portal)
- `PUT /api/properties/{id}`: Update property details
- `DELETE /api/properties/{id}`: Delete listing
- `POST /api/bookings`: Create new room reservation
- `GET /api/bookings`: List all reservations
- `PATCH /api/bookings/{id}/status`: Update booking status (`CONFIRMED`, `CANCELLED`)
- `POST /api/visits`: Schedule a free visit tour
- `GET /api/visits`: Retrieve scheduled visits
- `POST /api/properties/{id}/reviews`: Submit a verified tenant review
- `GET /api/owners/stats`: Retrieve aggregated landlord dashboard metrics

---

## 📁 Repository Structure

```
RentEase – PG & Room Finder/
├── backend/
│   ├── src/main/java/com/rentease/
│   │   ├── RentEaseApplication.java
│   │   ├── config/              # CORS, OpenAPI Swagger, DataInitializer
│   │   ├── controller/          # REST Controllers
│   │   ├── model/               # JPA Entities: Property, RoomType, Booking, Visit, Review, Owner
│   │   ├── repository/         # Spring Data JPA Repositories
│   │   └── service/            # Business Logic & Workflow Services
│   ├── src/main/resources/
│   │   ├── application.properties        # Default H2 MySQL-mode config
│   │   └── application-mysql.properties  # Standalone MySQL profile
│   ├── pom.xml
│   ├── run.bat / run.ps1
│   └── .maven/                 # Embedded portable Maven 3.9.6
├── frontend/
│   ├── src/
│   │   ├── components/         # Navbar, HeroSection, FilterSidebar, PropertyCard, InteractiveMap,
│   │   │                       # QuickViewModal, PropertyDetailsModal, BookingModal, ScheduleVisitModal,
│   │   │                       # CompareModal, OwnerDashboard, AddPropertyModal, MyBookingsModal, Toast
│   │   ├── services/           # api.js client & mockData.js
│   │   ├── App.jsx
│   │   ├── index.css           # Modern Cyber Glow Design System
│   │   └── main.jsx
│   ├── index.html
│   └── package.json
├── database/
│   ├── schema.sql              # MySQL DDL table definitions & indexes
│   ├── data.sql                # Verified PG seed records
│   └── README.md
├── run-backend.bat
├── run-frontend.bat
└── README.md
```
