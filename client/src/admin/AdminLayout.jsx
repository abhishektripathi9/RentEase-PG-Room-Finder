import React, { useEffect, useState } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Building2,
  CalendarCheck,
  Users,
  Sliders,
  ExternalLink,
  LogOut,
  ShieldCheck,
  Bell,
  Search,
  CheckCircle2,
  Menu,
  X
} from 'lucide-react';
import { getAdminToken, removeAdminToken } from '../services/api';

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Authentication Guard: Redirect to /admin/login if no token
  useEffect(() => {
    const token = getAdminToken();
    if (!token) {
      navigate('/admin/login', { replace: true });
    }
  }, [navigate]);

  const handleLogout = () => {
    removeAdminToken();
    navigate('/admin/login');
  };

  const navItems = [
    { name: 'Executive Overview', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'PG Verification & Catalog', path: '/admin/properties', icon: Building2 },
    { name: 'Bookings & Visits', path: '/admin/bookings', icon: CalendarCheck },
    { name: 'Users & Owners Directory', path: '/admin/users', icon: Users },
    { name: 'Security & Access Control', path: '/admin/security', icon: ShieldCheck },
    { name: 'Platform Settings', path: '/admin/settings', icon: Sliders }
  ];

  const currentRouteName = navItems.find(item => location.pathname.startsWith(item.path))?.name || 'Admin Console';

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-body text-slate-800 antialiased selection:bg-[#10B981] selection:text-white">
      
      {/* 1. Deep Forest-Slate Sidebar (#071917) */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#071917] border-r border-[#0D2623] flex flex-col transition-transform duration-300 md:translate-x-0 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        
        {/* Brand Header */}
        <div className="p-6 border-b border-[#0E2F2A] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-[#10B981] shadow-[0_0_15px_rgba(16,185,129,0.2)]">
              <Building2 size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-heading font-black text-lg text-white tracking-tight">RentEase</span>
                <span className="text-[10px] font-black tracking-wider px-2 py-0.5 rounded-full bg-emerald-500 text-slate-950">
                  PRO
                </span>
              </div>
              <p className="text-[11px] font-medium text-emerald-400/80">Admin Control Panel</p>
            </div>
          </div>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="md:hidden text-slate-400 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation List */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          <div className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Control Center
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-semibold transition-all duration-200 group ${
                    isActive
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.15)] font-bold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-[#0D2623]/80 border border-transparent'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon size={18} className={isActive ? 'text-[#10B981]' : 'text-slate-400 group-hover:text-slate-200'} />
                    <span>{item.name}</span>
                    {isActive && (
                      <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#10B981] shadow-[0_0_6px_#10B981]" />
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Admin User Footer Card */}
        <div className="p-4 border-t border-[#0E2F2A] bg-[#051412]">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 text-xs font-bold">
              SA
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-white truncate">Super Administrator</span>
                <ShieldCheck size={13} className="text-emerald-400 shrink-0" />
              </div>
              <p className="text-[11px] text-slate-400 truncate">admin@rentease.in</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full py-2 px-3 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <LogOut size={14} />
            <span>Sign Out Admin</span>
          </button>
        </div>

      </aside>

      {/* 2. Main Content Area */}
      <div className="flex-1 md:ml-72 flex flex-col min-w-0">
        
        {/* Top Header Bar */}
        <header className="sticky top-0 z-40 bg-white border-b border-[#E2E8F0] px-6 py-3.5 flex items-center justify-between shadow-xs">
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            >
              <Menu size={20} />
            </button>
            <div>
              <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                <span>RentEase PRO</span>
                <span>/</span>
                <span className="text-emerald-600 font-semibold">{currentRouteName}</span>
              </div>
              <h1 className="text-base font-extrabold text-slate-900 font-heading tracking-tight">
                {currentRouteName}
              </h1>
            </div>
          </div>

          {/* Header Actions */}
          <div className="flex items-center gap-3">
            
            {/* Live Database Status Indicator */}
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>MySQL 8.0 Live</span>
            </div>

            {/* ONE-WAY NAVIGATION RULE: View Live Website Button */}
            <button
              type="button"
              onClick={() => window.open('/', '_blank')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm hover:shadow transition-all cursor-pointer group"
              title="Inspect customer PG listings in a new browser tab"
            >
              <span>View Live Website</span>
              <ExternalLink size={14} className="text-emerald-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>

          </div>

        </header>

        {/* Dynamic Nested View Canvas */}
        <main className="flex-1 p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>

      </div>

    </div>
  );
}
