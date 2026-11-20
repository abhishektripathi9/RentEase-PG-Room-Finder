import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Building2,
  PlusCircle,
  Heart,
  CalendarCheck,
  User,
  LogOut,
  MapPin,
  Sparkles,
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
    <header className="sticky top-0 z-40 bg-[#071917]/95 backdrop-blur-md border-b border-emerald-950/80 text-white font-body">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand Group */}
        <Link to="/" className="flex items-center gap-3 group text-decoration-none">
          <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-[#10B981] shadow-[0_0_20px_rgba(16,185,129,0.25)] group-hover:scale-105 transition-transform">
            <Building2 size={24} className="text-[#10B981]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-heading font-black text-xl text-white tracking-tight">
                RentEase <span className="text-[#10B981]">PRO</span>
              </span>
              <span className="hidden sm:inline-block text-[9px] uppercase font-black tracking-widest bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/30">
                0% Brokerage
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium tracking-wide">
              Zero Brokerage Homes &amp; Verified PGs
            </p>
          </div>
        </Link>

        {/* Center Nav Links (Desktop) */}
        <nav className="hidden md:flex items-center gap-7 text-xs font-bold text-slate-300">
          <Link
            to="/"
            className={`hover:text-emerald-400 transition-colors ${location.pathname === '/' ? 'text-emerald-400' : ''}`}
          >
            Explore PGs
          </Link>
          <Link
            to="/saved"
            className={`flex items-center gap-1.5 hover:text-emerald-400 transition-colors ${location.pathname === '/saved' ? 'text-emerald-400' : ''}`}
          >
            <Heart size={14} className="text-emerald-400" />
            <span>Saved PGs</span>
          </Link>
          <Link
            to="/bookings"
            className={`flex items-center gap-1.5 hover:text-emerald-400 transition-colors ${location.pathname === '/bookings' ? 'text-emerald-400' : ''}`}
          >
            <CalendarCheck size={14} className="text-emerald-400" />
            <span>My Bookings</span>
          </Link>
        </nav>

        {/* Right CTA Actions */}
        <div className="flex items-center gap-3">
          
          {/* Emerald Outline "+ List PG" Button */}
          <Link
            to="/list-pg"
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-emerald-400 border border-emerald-500/40 bg-emerald-950/30 hover:bg-emerald-500 hover:text-slate-950 hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all cursor-pointer"
          >
            <PlusCircle size={15} />
            <span>+ List PG</span>
          </Link>

          {/* User Auth / Profile */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 p-1.5 pr-3 rounded-full bg-[#0D2623] border border-emerald-900/60 hover:border-emerald-500 text-xs font-bold text-slate-200 transition-all cursor-pointer"
              >
                <div className="w-8 h-8 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center font-black text-xs">
                  {user.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <span className="hidden sm:inline-block max-w-[100px] truncate">{user.name}</span>
              </button>

              {/* User Dropdown */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-[#0D2623] border border-emerald-900/80 rounded-2xl shadow-2xl py-2 z-50 text-xs animate-fade-in font-medium">
                  <div className="px-4 py-2 border-b border-emerald-950 text-slate-300">
                    <p className="font-bold text-white truncate">{user.name}</p>
                    <p className="text-[11px] text-emerald-400/80 font-mono truncate">{user.email}</p>
                    <span className="inline-block mt-1 text-[9px] uppercase font-black bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full">
                      {user.role}
                    </span>
                  </div>
                  {user.role === 'owner' && (
                    <Link
                      to="/owner/dashboard"
                      onClick={() => setDropdownOpen(false)}
                      className="block px-4 py-2 text-slate-300 hover:text-white hover:bg-emerald-950/60"
                    >
                      Owner Dashboard
                    </Link>
                  )}
                  <Link
                    to="/bookings"
                    onClick={() => setDropdownOpen(false)}
                    className="block px-4 py-2 text-slate-300 hover:text-white hover:bg-emerald-950/60"
                  >
                    My Bookings &amp; Passes
                  </Link>
                  <Link
                    to="/saved"
                    onClick={() => setDropdownOpen(false)}
                    className="block px-4 py-2 text-slate-300 hover:text-white hover:bg-emerald-950/60"
                  >
                    Wishlist
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-rose-400 hover:bg-rose-950/30 flex items-center gap-2 cursor-pointer border-t border-emerald-950"
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
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-900 bg-emerald-500 hover:bg-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all cursor-pointer flex items-center gap-1.5"
            >
              <User size={14} />
              <span>Login / Sign In</span>
            </Link>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-300 hover:text-white"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

        </div>

      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#071917] border-b border-emerald-950 px-5 py-4 space-y-3 animate-fade-in text-sm font-semibold">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-slate-300 hover:text-emerald-400 py-1"
          >
            Explore PGs
          </Link>
          <Link
            to="/saved"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-slate-300 hover:text-emerald-400 py-1"
          >
            Saved PGs
          </Link>
          <Link
            to="/bookings"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-slate-300 hover:text-emerald-400 py-1"
          >
            My Bookings &amp; Visits
          </Link>
          <Link
            to="/list-pg"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-emerald-400 font-bold py-1"
          >
            + List Your PG (Zero Brokerage)
          </Link>
        </div>
      )}
    </header>
  );
}
