import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Building2,
  Clock,
  CalendarCheck,
  Users,
  TrendingUp,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Eye,
  Check,
  X,
  CreditCard,
  MapPin
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';
import { api } from '../services/api';

export default function DashboardModule() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    verifiedPgsLive: 6,
    pendingApprovalQueue: 2,
    totalStudentBookings: 48,
    activePgOwners: 4,
    totalRevenue: 24000,
    totalVisits: 142
  });
  const [chartData, setChartData] = useState([]);
  const [recentBookings, setRecentBookings] = useState([]);
  const [pendingProperties, setPendingProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionSuccess, setActionSuccess] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await api.getAdminStats();
      if (data && data.stats) {
        setStats(data.stats);
        setChartData(data.chartData || []);
        setRecentBookings(data.recentBookings || []);
      }

      // Load pending properties for quick action
      const pending = await api.getAdminProperties('pending');
      setPendingProperties(pending || []);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleQuickApprove = async (id, title) => {
    try {
      await api.verifyAdminProperty(id, 'approved');
      setActionSuccess(`"${title}" published LIVE to website!`);
      setTimeout(() => setActionSuccess(''), 4000);
      loadData();
    } catch (err) {
      alert(err.message || 'Approval failed');
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Toast Notification */}
      {actionSuccess && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 px-4 py-3 rounded-xl flex items-center gap-2 text-sm font-semibold shadow-sm animate-fade-in">
          <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* 1. 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Card 1: Verified PGs Live */}
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Verified PGs Live</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
              <Building2 size={20} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 font-heading tabular-nums">{stats.verifiedPgsLive}</span>
            <span className="text-xs font-bold text-emerald-600 flex items-center bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              <ArrowUpRight size={12} /> Live on Web
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-2">Active student PG listings across 4 cities</p>
        </div>

        {/* Card 2: Pending Approval Queue */}
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pending Approvals</span>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100">
              <Clock size={20} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 font-heading tabular-nums">{stats.pendingApprovalQueue}</span>
            <span className="text-xs font-bold text-amber-700 flex items-center bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
              <AlertCircle size={12} className="mr-1" /> Needs Audit
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-2">Submitted PGs awaiting KYC verification</p>
        </div>

        {/* Card 3: Total Student Bookings */}
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Student Bookings</span>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
              <CalendarCheck size={20} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 font-heading tabular-nums">{stats.totalStudentBookings}</span>
            <span className="text-xs font-bold text-blue-700 flex items-center bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
              ₹500 Token Holds
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-2">Atomic room reservations + {stats.totalVisits || 142} physical visits</p>
        </div>

        {/* Card 4: Active PG Owners */}
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active PG Owners</span>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100">
              <Users size={20} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 font-heading tabular-nums">{stats.activePgOwners}</span>
            <span className="text-xs font-bold text-indigo-700 flex items-center bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200">
              <ShieldCheck size={12} className="mr-1" /> Verified Hosts
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-2">Registered landlords &amp; hostel managers</p>
        </div>

      </div>

      {/* 2. Bookings & Revenue Growth Chart (Recharts) */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <TrendingUp size={20} className="text-emerald-600" />
              <h2 className="text-base font-extrabold text-slate-900 font-heading">
                Platform Bookings &amp; Token Revenue Growth
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Monthly trends across verified PGs and token advance holds (₹500 per booking)
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs font-semibold">
            <div className="flex items-center gap-1.5 text-slate-600">
              <span className="w-3 h-3 rounded-sm bg-emerald-500" />
              <span>Token Revenue (₹)</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-600">
              <span className="w-3 h-3 rounded-sm bg-teal-300" />
              <span>Confirmed Bookings</span>
            </div>
          </div>
        </div>

        {/* Chart Canvas */}
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="emeraldRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="tealBookings" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#14B8A6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#14B8A6" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="month" stroke="#94A3B8" fontSize={12} tickLine={false} />
              <YAxis stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#071917',
                  borderColor: '#10B981',
                  borderRadius: '12px',
                  color: '#FFFFFF',
                  fontSize: '12px',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
                }}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                name="Revenue (₹)"
                stroke="#10B981"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#emeraldRevenue)"
              />
              <Area
                type="monotone"
                dataKey="bookings"
                name="Bookings"
                stroke="#14B8A6"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#tealBookings)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 3. Grid: Pending Approval Fast-Track & Recent Bookings */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Pending Approval Fast-Track */}
        <div className="lg:col-span-1 bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-xs flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Clock size={18} className="text-amber-500" />
              <h3 className="text-sm font-extrabold text-slate-900 font-heading">
                Pending Verification ({pendingProperties.length})
              </h3>
            </div>
            <button
              onClick={() => navigate('/admin/properties?status=pending')}
              className="text-xs font-bold text-emerald-600 hover:text-emerald-700"
            >
              View All
            </button>
          </div>

          <p className="text-xs text-slate-500 mb-4">
            PG listings submitted by owners requiring physical and landmark inspection.
          </p>

          <div className="space-y-3 flex-1 overflow-y-auto">
            {pendingProperties.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                <CheckCircle2 size={24} className="mx-auto text-emerald-500 mb-2" />
                <span>Verification queue clear! All properties are audited.</span>
              </div>
            ) : (
              pendingProperties.map((prop) => (
                <div key={prop.id} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors">
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{prop.title}</h4>
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md tabular-nums shrink-0">
                      ₹{prop.price_starting}/mo
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-slate-500 mb-3">
                    <MapPin size={12} className="text-slate-400" />
                    <span>{prop.locality}, {prop.city}</span>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-200/80">
                    <span className="text-[10px] text-slate-400 font-medium">By {prop.owner_name}</span>
                    <button
                      onClick={() => handleQuickApprove(prop.id, prop.title)}
                      className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] flex items-center gap-1 shadow-xs transition-all cursor-pointer"
                    >
                      <Check size={12} />
                      <span>Approve Live</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Token Bookings Table */}
        <div className="lg:col-span-2 bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <CreditCard size={18} className="text-emerald-600" />
              <h3 className="text-sm font-extrabold text-slate-900 font-heading">
                Recent Token Bookings (₹500 Hold)
              </h3>
            </div>
            <button
              onClick={() => navigate('/admin/bookings')}
              className="text-xs font-bold text-emerald-600 hover:text-emerald-700"
            >
              View Full Monitor →
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-700 uppercase font-bold text-[10px] border-y border-slate-200 tracking-wider">
                <tr>
                  <th className="py-2.5 px-3">Code</th>
                  <th className="py-2.5 px-3">Student</th>
                  <th className="py-2.5 px-3">Property</th>
                  <th className="py-2.5 px-3">Type</th>
                  <th className="py-2.5 px-3 text-right">Hold Amount</th>
                  <th className="py-2.5 px-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-slate-900 tabular-nums">
                      {b.booking_code}
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-semibold text-slate-900">{b.tenant_name}</div>
                      <div className="text-[10px] text-slate-400">{b.tenant_phone}</div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-medium text-slate-800 line-clamp-1">{b.property_title}</div>
                      <div className="text-[10px] text-slate-400">{b.city}</div>
                    </td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        b.booking_type === 'token_booking'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-blue-50 text-blue-700 border border-blue-200'
                      }`}>
                        {b.booking_type === 'token_booking' ? 'Token Hold' : 'Visit Pass'}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right font-bold text-slate-900 tabular-nums">
                      {b.token_amount > 0 ? `₹${b.token_amount}` : 'Free'}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

    </div>
  );
}
