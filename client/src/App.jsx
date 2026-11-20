import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';

// Public Components
import PublicNavbar from './components/PublicNavbar';
import MobileBottomNav from './components/MobileBottomNav';

// Public Pages
import HomePage from './pages/HomePage';
import PropertyDetailPage from './pages/PropertyDetailPage';
import SavedPage from './pages/SavedPage';
import MyBookingsPage from './pages/MyBookingsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ListPgPage from './pages/ListPgPage';
import OwnerDashboardPage from './pages/OwnerDashboardPage';

// Admin Components & Modules
import AdminLogin from './admin/AdminLogin';
import AdminLayout from './admin/AdminLayout';
import DashboardModule from './admin/DashboardModule';
import PropertiesModule from './admin/PropertiesModule';
import BookingsModule from './admin/BookingsModule';
import UsersModule from './admin/UsersModule';
import SecurityModule from './admin/SecurityModule';
import SettingsModule from './admin/SettingsModule';

// Public Layout Wrapper (with PublicNavbar and MobileBottomNav, ZERO admin links)
function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col font-body bg-[#F8FAFC]">
      <PublicNavbar />
      <div className="flex-1">
        <Outlet />
      </div>
      <MobileBottomNav />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        
        {/* ========================================================
            1. PUBLIC CUSTOMER & OWNER WEBSITE (Zero links to /admin)
            ======================================================== */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/pg/:id" element={<PropertyDetailPage />} />
          <Route path="/saved" element={<SavedPage />} />
          <Route path="/bookings" element={<MyBookingsPage />} />
          <Route path="/list-pg" element={<ListPgPage />} />
          <Route path="/owner/dashboard" element={<OwnerDashboardPage />} />
        </Route>

        {/* Public Authentication Pages */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* ========================================================
            2. RENTEASE PRO ADMIN CONTROL PANEL
            ======================================================== */}
        <Route path="/admin/login" element={<AdminLogin />} />

        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardModule />} />
          <Route path="properties" element={<PropertiesModule />} />
          <Route path="bookings" element={<BookingsModule />} />
          <Route path="users" element={<UsersModule />} />
          <Route path="security" element={<SecurityModule />} />
          <Route path="settings" element={<SettingsModule />} />
        </Route>

        {/* Catch-all redirect to public website */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </BrowserRouter>
  );
}
