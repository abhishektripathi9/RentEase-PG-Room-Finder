# 🏠 RentEase PRO – Zero Brokerage PG & Room Finder Platform

[![Full Stack Monorepo](https://img.shields.io/badge/Architecture-Monorepo_Full_Stack-00D2FF?style=for-the-badge&logo=codeigniter&logoColor=black)](https://github.com/abhishektripathi9/RentEase-PG-Room-Finder)
[![React 19](https://img.shields.io/badge/Frontend-React_19_+_Vite-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![Node.js Express](https://img.shields.io/badge/Backend-Node.js_+_Express-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org)
[![MySQL 8.0](https://img.shields.io/badge/Database-MySQL_8.0-4479A1?style=for-the-badge&logo=mysql&logoColor=white)](https://mysql.com)
[![JWT Security](https://img.shields.io/badge/Security-JWT_RBAC_+_Audit_Logs-F58220?style=for-the-badge&logo=jsonwebtokens&logoColor=white)](https://jwt.io)
[![Tailwind CSS](https://img.shields.io/badge/UI_Style-Tailwind_+_Minimalism-38BDF8?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)

> **RentEase PRO** is an enterprise-grade full-stack platform built to modernize student and co-living housing discovery across major Indian education and tech hubs (Bangalore, Prayagraj, Delhi NCR, and Banda). Engineered with an **Airbnb-inspired minimalist UI**, **atomic bed reservations**, a dedicated **RentEase PRO Admin Control Panel (`/admin`)**, and an **Owner Security & Access Control Gateway** with persistent audit logging.

---

## 🌟 Key System Capabilities

### 🎨 1. Airbnb-Inspired Clean & Airy Public Storefront (`/`)
- **Minimalist Aesthetic**: Pure white canvas (`#FFFFFF`), subtle `1px solid #E2E8F0` borders, dark slate typography (`#0F172A`), and clean high-contrast black action buttons.
- **Single-Row Instant Search**: Filter instantly across target cities (*Civil Lines, Prayagraj; Koramangala, Bangalore; Banda*), room configurations (*Single Studio, Twin Share, Triple Share*), and maximum monthly budget.
- **Responsive 3-Column PG Grid**: Verified high-resolution room photos, zero-brokerage badges, landmark walking distances, 4-box essential amenity badges (Wi-Fi, 3x Meals, Daily Housekeeping, Biometric entry), and live bed counters.
- **One-Way Navigation Rule**: Strict security rule ensuring **ZERO links, buttons, or mentions** of `/admin` appear anywhere on the public storefront.

### 🛡️ 2. Owner Admin Security & Access Control Gateway (`/admin/security`)
- **Granular Access Delegation**: The Owner/Super Admin can delegate role-based managerial privileges to team members by email:
  - `Can Manage PG Catalog` (approve/reject property submissions)
  - `Can Manage Bookings` (confirm/cancel token reservations & physical visits)
  - `Can Manage Users` (suspend/activate student and owner accounts)
  - `Can Edit Settings` (configure platform token fees and trust banners)
- **Revoke & Modify Permissions**: Instant permission elevation or one-click access revocation.
- **Security Audit Trail (`security_audit_logs`)**: Automatically logs every security event with IP address, action type, admin user ID, and timestamp into MySQL for complete compliance.

### ⚙️ 3. RentEase PRO Admin Control Panel (`/admin`)
- **Executive KPI Dashboard (`/admin/dashboard`)**: Real-time counters for Verified PGs Live, Pending Verification Queue, Total Confirmed Bookings, and Active PG Owners, paired with interactive booking growth charts (Recharts).
- **PG Verification & Catalog Manager (`/admin/properties`)**: Review student-submitted or owner-submitted PGs with photos, sharing prices, amenities, and host KYC. Approve to instantly publish live on `/` or reject with one click.
- **Bookings & Physical Visits Monitor (`/admin/bookings`)**: Real-time view of student ₹500 token deposits and scheduled property walkthroughs with status filtering.
- **User & Host Directory (`/admin/users`)**: Directory of registered students and PG owners with account status toggles (`ACTIVE` / `SUSPENDED`).
- **One-Click Live Switcher**: Prominent **"View Live Website ↗"** button in the admin top header opening the public platform in a new tab.

### 💳 4. Atomic Bed Booking & Visit Scheduling
- **Live Inventory Synchronization**: Bed booking executes atomic SQL decrements (`UPDATE properties SET available_beds = available_beds - 1 WHERE id = ? AND available_beds > 0`), completely eliminating double-booking hazards.
- **Token Advance Reservation (₹500)**: Instant reservation workflow generating a printable **Zero-Brokerage Digital Booking Pass** complete with transaction ID, host contact, and room specifics.
- **Physical Walkthrough Booking**: Schedule in-person property tours by selecting preferred date and time slot.

---

## 🛠️ Technology Stack & Monorepo Architecture

```
RentEase – PG & Room Finder/
├── client/                     # Frontend Application (React 19 + Vite + Tailwind)
│   ├── src/
│   │   ├── admin/              # RentEase PRO Admin Control Panel
│   │   │   ├── AdminLayout.jsx
│   │   │   ├── AdminLogin.jsx
│   │   │   ├── DashboardModule.jsx
│   │   │   ├── PropertiesModule.jsx
│   │   │   ├── BookingsModule.jsx
│   │   │   ├── UsersModule.jsx
│   │   │   ├── SettingsModule.jsx
│   │   │   └── SecurityModule.jsx # Owner Access Delegation & Audit Logs
│   │   ├── components/         # Clean UI Components (Navbar, Cards, Modals, Pass)
│   │   ├── pages/              # Public Pages (Home, PG Details, List PG, My Bookings)
│   │   ├── App.jsx             # React Router 7 Configuration
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
├── server/                     # Backend API (Node.js + Express + MySQL2 Pool)
│   ├── database/
│   │   ├── schema.sql          # MySQL Schema with RBAC & Audit Tables
│   │   └── seed.sql            # Realistic Seed Data (Prayagraj, Bangalore, Banda, Delhi)
│   ├── src/
│   │   ├── config/db.js        # MySQL2 Connection Pool
│   │   ├── middleware/auth.js  # JWT Auth & Role-Based Access Guards
│   │   ├── routes/             # REST Endpoints (auth, properties, bookings, admin, security)
│   │   └── index.js            # Express Application Entry Point
│   ├── package.json
│   └── .env.example
├── package.json                # Root Monorepo Orchestrator (concurrently)
└── README.md
```

| Layer | Technologies & Libraries |
|---|---|
| **Frontend** | React 19, Vite, Tailwind CSS, Lucide React, Recharts, Canvas Confetti |
| **Backend** | Node.js, Express.js 4, MySQL2, JSON Web Tokens (JWT), Bcrypt.js, CORS |
| **Database** | MySQL 8.0 with InnoDB Relational Foreign Keys & Indices |
| **Security** | Role-Based Access Control (`student`, `owner`, `admin`), Bcrypt Hashing, Prepared Statements, Security Audit Logging |

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js** (v18.x or v20.x+)
- **MySQL Server 8.0** running locally on port `3306`

### 2. Database Initialization
1. Start your local MySQL service (e.g. `net start MySQL80` on Windows).
2. Create the database and import schema and seeds:
```bash
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS rentease_pro_db;"
mysql -u root -p rentease_pro_db < server/database/schema.sql
mysql -u root -p rentease_pro_db < server/database/seed.sql
```

### 3. Environment Configuration
Create a `.env` file in the `/server` directory (or copy from `server/.env.example`):
```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=YourMySQLPassword
DB_NAME=rentease_pro_db
JWT_SECRET=rentease_super_secret_jwt_key_2026
```

### 4. Install Dependencies & Launch
From the root directory:
```bash
# 1. Install root, server, and client dependencies
npm install
cd server && npm install
cd ../client && npm install
cd ..

# 2. Run both backend (:5000) and frontend (:5173) with a single command
npm run dev
```

Platform access URLs:
- **Public Customer Website**: [http://localhost:5173](http://localhost:5173)
- **RentEase PRO Admin Panel**: [http://localhost:5173/admin/login](http://localhost:5173/admin/login)
  - *Default Admin Credentials*: `admin@rentease.in` / `Admin@123`
- **Backend REST API**: [http://localhost:5000](http://localhost:5000)

---

## 📡 REST API Architecture

### Authentication & Profiles (`/api/auth`)
- `POST /api/auth/register` – Register tenant (`student`) or PG host (`owner`). Rejects `admin` self-registration.
- `POST /api/auth/login` – Public login for students and PG owners.
- `POST /api/auth/admin-login` – Dedicated secure login for administrators and authorized managers.
- `GET /api/auth/me` – Retrieve current authenticated user profile (`Bearer JWT`).

### Public Catalog & Bookings (`/api`)
- `GET /api/properties` – Filter active verified listings by city, room type, and budget.
- `GET /api/properties/:id` – Detailed property view with photos, amenities, and live bed count.
- `POST /api/bookings` – Reserve a bed with token advance (atomically decrements bed count).
- `GET /api/bookings/my` – Retrieve logged-in student's booking history and digital passes.
- `POST /api/owner/properties` – Submit a new PG listing for administrative review (`is_verified = 0`).

### Admin Control & Verification (`/api/admin`)
- `GET /api/admin/stats` – Aggregate analytics (Verified PGs, pending queue, active hosts, revenue).
- `GET /api/admin/properties` – Fetch full property catalog with approval status filters.
- `PATCH /api/admin/properties/:id/verify` – Approve (`is_verified = 1`) or reject property.
- `GET /api/admin/bookings` – Manage all tenant reservations and scheduled property visits.
- `GET /api/admin/users` – User management and account status toggles (`ACTIVE` / `SUSPENDED`).

### Owner Security & Access Control (`/api/admin/security`)
- `GET /api/admin/security/access-list` – Retrieve all managers with assigned permission matrices.
- `POST /api/admin/security/grant-access` – Grant manager privileges to an existing or new user.
- `PATCH /api/admin/security/update-permissions/:id` – Update granular permissions for a manager.
- `DELETE /api/admin/security/revoke-access/:id` – Revoke administrative privileges.
- `GET /api/admin/security/audit-logs` – Retrieve immutable security access and audit trail.

---

## 🔒 Security Best Practices Implemented
1. **Zero-Trust Access Control**: Public registration strictly restricts accounts to `student` or `owner` roles. Admin privileges cannot be self-assigned.
2. **One-Way Navigation Rule**: Zero references to `/admin` in the public DOM, headers, or footers, preventing discovery via public web scraping.
3. **Prepared Statements**: All MySQL queries utilize parameterized inputs via `mysql2/promise` to prevent SQL Injection.
4. **Bcrypt Hashing**: Passwords stored using industry-standard salt rounds.
5. **Atomic DB Transactions**: Bed bookings execute atomic condition updates preventing concurrency race conditions.
6. **Immutable Audit Trail**: Security actions are recorded in `security_audit_logs` with admin identity and network IP.

---

## 👨‍💻 Author & License
- **Lead Full-Stack Developer**: Abhishek Tripathi ([GitHub Profile](https://github.com/abhishektripathi9))
- **Portfolio**: [Abhishek Tripathi Portfolio](https://github.com/abhishektripathi9/Abhishek_Portfolio)
- **License**: MIT License
