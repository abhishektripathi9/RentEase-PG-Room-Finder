import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Building2,
  PlusCircle,
  Heart,
  CalendarCheck,
  User,
  LogOut,
  Menu,
  X,
  ShieldCheck
} from 'lucide-react';
import { getCurrentUser, removeUserToken } from '../services/api';

export default function PublicNavbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(getCurrentUser());
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setUser(getCurrentUser());
  }, [location]);

  const handleLogout = () => {
    removeUserToken();
    setUser(null);
    setDropdownOpen(false);
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 text-slate-900 font-body">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        
        {/* Clean Airbnb Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group text-decoration-none">
          <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-sm group-hover:bg-black transition-colors">
            <Building2 size={20} className="text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-heading font-black text-xl text-slate-900 tracking-tight">
                RentEase
              </span>
              <span className="hidden sm:inline-block text-[10px] uppercase font-bold tracking-wider bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full border border-slate-200">
                0% Brokerage
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-normal">
              Verified PG &amp; Room Finder
            </p>
          </div>
        </Link>

        {/* Center Nav Links (Desktop) */}
        <nav className="hidden md:flex items-center gap-7 text-xs font-semibold text-slate-600">
          <Link
            to="/"
            className={`hover:text-slate-900 transition-colors ${location.pathname === '/' ? 'text-slate-900 font-bold' : ''}`}
          >
            Explore
          </Link>
          <Link
            to="/saved"
            className={`flex items-center gap-1.5 hover:text-slate-900 transition-colors ${location.pathname === '/saved' ? 'text-slate-900 font-bold' : ''}`}
          >
            <Heart size={14} className="text-rose-500" />
            <span>Saved PGs</span>
          </Link>
          <Link
            to="/bookings"
            className={`flex items-center gap-1.5 hover:text-slate-900 transition-colors ${location.pathname === '/bookings' ? 'text-slate-900 font-bold' : ''}`}
          >
            <CalendarCheck size={14} className="text-slate-600" />
            <span>My Bookings</span>
          </Link>
        </nav>

        {/* Right CTA Actions */}
        <div className="flex items-center gap-3">
          
          {/* Subtle Clean "+ List Your PG" Button */}
          <Link
            to="/list-pg"
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-400 hover:text-slate-900 transition-all cursor-pointer shadow-sm"
          >
            <PlusCircle size={14} className="text-slate-600" />
            <span>List Your PG</span>
          </Link>

          {/* User Auth / Profile */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 p-1.5 pr-3 rounded-full bg-slate-100 border border-slate-200 hover:border-slate-400 text-xs font-bold text-slate-800 transition-all cursor-pointer"
              >
                <div className="w-7 h-7 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
                  {user.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <span className="hidden sm:inline-block max-w-[100px] truncate">{user.name}</span>
              </button>

              {/* User Dropdown */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-white border border-slate-200 rounded-2xl shadow-xl py-2 z-50 text-xs font-medium text-slate-700">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="font-bold text-slate-900 truncate">{user.name}</p>
                    <p className="text-[11px] text-slate-500 font-mono truncate">{user.email}</p>
                    <span className="inline-block mt-1 text-[9px] uppercase font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full border border-slate-200">
                      {user.role}
                    </span>
                  </div>
                  {user.role === 'owner' && (
                    <Link
                      to="/owner/dashboard"
                      onClick={() => setDropdownOpen(false)}
                      className="block px-4 py-2 hover:bg-slate-50 hover:text-slate-900"
                    >
                      Owner Dashboard
                    </Link>
                  )}
                  <Link
                    to="/bookings"
                    onClick={() => setDropdownOpen(false)}
                    className="block px-4 py-2 hover:bg-slate-50 hover:text-slate-900"
                  >
                    My Bookings &amp; Passes
                  </Link>
                  <Link
                    to="/saved"
                    onClick={() => setDropdownOpen(false)}
                    className="block px-4 py-2 hover:bg-slate-50 hover:text-slate-900"
                  >
                    Saved Wishlist
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-rose-600 hover:bg-rose-50 flex items-center gap-2 cursor-pointer border-t border-slate-100"
                  >
                    <LogOut size={13} />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-black transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
            >
              <User size={13} />
              <span>Login</span>
            </Link>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-600 hover:text-slate-900"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

        </div>

      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-5 py-4 space-y-3 text-sm font-semibold text-slate-700">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block hover:text-slate-900 py-1"
          >
            Explore PGs
          </Link>
          <Link
            to="/saved"
            onClick={() => setMobileMenuOpen(false)}
            className="block hover:text-slate-900 py-1"
          >
            Saved PGs
          </Link>
          <Link
            to="/bookings"
            onClick={() => setMobileMenuOpen(false)}
            className="block hover:text-slate-900 py-1"
          >
            My Bookings &amp; Passes
          </Link>
          <Link
            to="/list-pg"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-slate-900 font-bold py-1 border-t border-slate-100 pt-2"
          >
            + List Your PG
          </Link>
        </div>
      )}
    </header>
  );
}
