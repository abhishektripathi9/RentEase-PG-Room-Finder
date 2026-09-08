import React, { useState, useEffect } from 'react';
import { Building2, Plus, Users, Calendar, DollarSign, TrendingUp, CheckCircle2, XCircle, AlertCircle, Phone, Mail, Trash2, ArrowUpRight, ShieldCheck } from 'lucide-react';
import { api } from '../services/api';

export default function OwnerDashboard({
  onOpenAddProperty,
  onViewProperty,
  showToast
}) {
  const [activeTab, setActiveTab] = useState('listings'); // 'listings', 'bookings', 'visits', 'tenants'
  const [stats, setStats] = useState({
    totalProperties: 0,
    totalBookings: 0,
    totalVisits: 0,
    monthlyRevenue: 0,
    occupancyRate: 88.5,
    activeTenants: 26,
    pendingVisits: 0
  });

  const [properties, setProperties] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [statsData, propsData, bookingsData, visitsData] = await Promise.all([
        api.getOwnerStats(1),
        api.getProperties(),
        api.getBookings(),
        api.getVisits()
      ]);
      setStats(statsData);
      setProperties(propsData);
      setBookings(bookingsData);
      setVisits(visitsData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleBookingStatus = async (id, status) => {
    await api.updateBookingStatus(id, status);
    showToast(`Booking marked as ${status}`);
    loadDashboardData();
  };

  const handleVisitStatus = async (id, status) => {
    await api.updateVisitStatus(id, status);
    showToast(`Visit marked as ${status}`);
    loadDashboardData();
  };

  const handleDeleteProperty = async (id) => {
    if (window.confirm('Are you sure you want to remove this property listing?')) {
      await api.deleteProperty(id);
      showToast('Property listing deleted');
      loadDashboardData();
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-8">
      
      {/* Top Banner */}
      <div className="glass-panel p-6 rounded-2xl border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="tech-pill text-xs">Landlord Portal</span>
            <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              KYC Verified Landlord
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white font-['Outfit']">
            Owner Management Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Track inquiries, manage bed inventory, approve bookings, and monitor tenant revenue in real time.
          </p>
        </div>

        <button
          onClick={onOpenAddProperty}
          className="btn-cyber py-3 px-6 rounded-xl font-bold text-xs flex items-center gap-2 self-start md:self-auto shadow-[0_0_20px_rgba(0,210,255,0.4)]"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>List New Property / PG</span>
        </button>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="glass-panel p-4 rounded-xl border-white/10">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Total Properties</span>
            <Building2 className="w-4 h-4 text-[#00D2FF]" />
          </div>
          <div className="text-2xl font-black text-white font-['Outfit']">
            {stats.totalProperties}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Across 4 major tech hubs</div>
        </div>

        <div className="glass-panel p-4 rounded-xl border-white/10">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Monthly Rent Inflow</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400 font-['Outfit']">
            ₹{Number(stats.monthlyRevenue || 142500).toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-emerald-300 flex items-center gap-1 mt-1">
            <TrendingUp className="w-3 h-3" /> +14.2% from last month
          </div>
        </div>

        <div className="glass-panel p-4 rounded-xl border-white/10">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Occupancy Rate</span>
            <Users className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-black text-white font-['Outfit']">
            {stats.occupancyRate}%
          </div>
          <div className="text-[11px] text-slate-400 mt-1">{stats.activeTenants} Active Tenants Occupying</div>
        </div>

        <div className="glass-panel p-4 rounded-xl border-white/10">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Scheduled Visits</span>
            <Calendar className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-400 font-['Outfit']">
            {stats.pendingVisits} Pending
          </div>
          <div className="text-[11px] text-slate-400 mt-1">{visits.length} Total visits recorded</div>
        </div>

      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-white/10 gap-4 overflow-x-auto pb-1">
        {[
          { id: 'listings', label: `My Properties (${properties.length})` },
          { id: 'bookings', label: `Booking Applications (${bookings.length})` },
          { id: 'visits', label: `Scheduled Tours (${visits.length})` },
          { id: 'tenants', label: `Tenant Rent Ledger` }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`pb-3 text-xs sm:text-sm font-bold tracking-tight whitespace-nowrap transition-colors relative ${
              activeTab === tab.id
                ? 'text-[#00D2FF] font-extrabold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#00D2FF] shadow-[0_0_8px_#00D2FF]" />
            )}
          </button>
        ))}
      </div>

      {/* TAB CONTENT: Listings */}
      {activeTab === 'listings' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {properties.map((p) => (
            <div key={p.id} className="glass-panel rounded-2xl overflow-hidden border-white/10 flex flex-col justify-between">
              <div className="relative h-44 w-full">
                <img
                  src={p.images?.[0]}
                  alt={p.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md px-2.5 py-0.5 rounded-full text-xs font-bold text-white border border-white/10">
                  {p.city}
                </div>
                <div className="absolute top-3 right-3 bg-emerald-500 text-slate-950 px-2 py-0.5 rounded-full text-[10px] font-black uppercase">
                  {p.status || 'ACTIVE'}
                </div>
              </div>

              <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-base text-white font-['Outfit'] line-clamp-1">{p.name}</h3>
                  <div className="text-xs text-slate-400">{p.locality}, {p.city}</div>
                  <div className="flex items-center gap-2 mt-2 text-xs text-slate-300">
                    <span className="font-extrabold text-[#00D2FF]">₹{Number(p.startingPrice).toLocaleString('en-IN')}/mo</span>
                    <span>•</span>
                    <span>{p.roomTypes?.length || 2} Room Categories</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                  <button
                    onClick={() => onViewProperty(p)}
                    className="text-xs text-[#00D2FF] hover:underline font-semibold flex items-center gap-1"
                  >
                    <span>View Portal Card</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteProperty(p.id)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                    title="Delete listing"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB CONTENT: Bookings */}
      {activeTab === 'bookings' && (
        <div className="glass-panel rounded-2xl border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/80 border-b border-white/10 text-slate-400 uppercase font-bold text-[10px] tracking-wider">
                <tr>
                  <th className="p-3.5">Code & Date</th>
                  <th className="p-3.5">Tenant Details</th>
                  <th className="p-3.5">Property & Room</th>
                  <th className="p-3.5">Rent & Token</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {bookings.map((b) => (
                  <tr key={b.id} className="hover:bg-white/[0.02]">
                    <td className="p-3.5 font-mono">
                      <div className="font-bold text-[#00D2FF]">{b.bookingCode}</div>
                      <div className="text-[10px] text-slate-500">Move-in: {b.moveInDate}</div>
                    </td>
                    <td className="p-3.5">
                      <div className="font-bold text-white">{b.tenantName}</div>
                      <div className="text-[10px] text-slate-400">{b.tenantPhone} • {b.tenantEmail}</div>
                      <div className="text-[10px] text-slate-500">{b.idProofType}: {b.idProofNumber}</div>
                    </td>
                    <td className="p-3.5">
                      <div className="font-medium text-white">{b.propertyName}</div>
                      <div className="text-[10px] text-slate-400">{b.roomCategory} Sharing ({b.durationMonths} Mos)</div>
                    </td>
                    <td className="p-3.5">
                      <div className="font-extrabold text-white">₹{Number(b.monthlyRent).toLocaleString('en-IN')}/mo</div>
                      <div className="text-[10px] text-emerald-400 font-semibold">Paid: ₹{Number(b.totalAmountPaid).toLocaleString('en-IN')}</div>
                    </td>
                    <td className="p-3.5">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        b.bookingStatus === 'CONFIRMED'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : b.bookingStatus === 'CANCELLED'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}>
                        {b.bookingStatus}
                      </span>
                    </td>
                    <td className="p-3.5 text-right space-x-1.5">
                      {b.bookingStatus !== 'CONFIRMED' && (
                        <button
                          onClick={() => handleBookingStatus(b.id, 'CONFIRMED')}
                          className="p-1 rounded bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-slate-950 transition-colors"
                          title="Confirm booking"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                      {b.bookingStatus !== 'CANCELLED' && (
                        <button
                          onClick={() => handleBookingStatus(b.id, 'CANCELLED')}
                          className="p-1 rounded bg-rose-500/20 text-rose-400 hover:bg-rose-500 hover:text-white transition-colors"
                          title="Cancel booking"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB CONTENT: Visits */}
      {activeTab === 'visits' && (
        <div className="glass-panel rounded-2xl border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/80 border-b border-white/10 text-slate-400 uppercase font-bold text-[10px] tracking-wider">
                <tr>
                  <th className="p-3.5">Pass Code</th>
                  <th className="p-3.5">Visitor</th>
                  <th className="p-3.5">Date & Time</th>
                  <th className="p-3.5">Mode</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {visits.map((v) => (
                  <tr key={v.id} className="hover:bg-white/[0.02]">
                    <td className="p-3.5 font-mono font-bold text-[#00D2FF]">
                      {v.visitCode}
                    </td>
                    <td className="p-3.5">
                      <div className="font-bold text-white">{v.visitorName}</div>
                      <div className="text-[10px] text-slate-400">{v.visitorPhone} • {v.visitorEmail}</div>
                      {v.notes && <div className="text-[10px] text-slate-500 italic mt-0.5">"{v.notes}"</div>}
                    </td>
                    <td className="p-3.5">
                      <div className="font-semibold text-white">{v.visitDate}</div>
                      <div className="text-[10px] text-slate-400">{v.timeSlot}</div>
                    </td>
                    <td className="p-3.5">
                      <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full border border-slate-700">
                        {v.visitType === 'IN_PERSON' ? 'In-Person Tour' : 'Live Video Tour'}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        v.status === 'COMPLETED'
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : v.status === 'CANCELLED'
                          ? 'bg-rose-500/20 text-rose-300'
                          : 'bg-amber-500/20 text-amber-300'
                      }`}>
                        {v.status}
                      </span>
                    </td>
                    <td className="p-3.5 text-right space-x-1.5">
                      {v.status !== 'COMPLETED' && (
                        <button
                          onClick={() => handleVisitStatus(v.id, 'COMPLETED')}
                          className="px-2 py-1 rounded bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-slate-950 font-bold transition-colors"
                        >
                          Mark Completed
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB CONTENT: Tenant Ledger */}
      {activeTab === 'tenants' && (
        <div className="glass-panel rounded-2xl border-white/10 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-white font-['Outfit']">Active Tenant Rent Ledger</h3>
            <span className="text-xs text-slate-400">Due on 5th of every month</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { name: 'Arjun Verma', room: 'Zolo Starlight - Double #204', rent: 12500, status: 'PAID', due: '05 Sep 2026', phone: '+91 99887 76655' },
              { name: 'Pooja Hegde', room: 'UrbanHaven Girls - Deluxe #102', rent: 10500, status: 'PAID', due: '05 Sep 2026', phone: '+91 98451 90812' },
              { name: 'Karan Sharma', room: 'Zolo Starlight - Single #301', rent: 18500, status: 'DUE', due: '05 Sep 2026', phone: '+91 97123 00982' },
              { name: 'Sneha Mukherjee', room: 'UrbanHaven Girls - Twin #201', rent: 10500, status: 'PAID', due: '05 Sep 2026', phone: '+91 99012 43210' },
              { name: 'Rohan Patel', room: 'TechHub Boys - Executive #104', rent: 9500, status: 'OVERDUE', due: '01 Sep 2026', phone: '+91 98765 11223' },
              { name: 'Aditya Joshi', room: 'Nexus Coliving - Studio #405', rent: 17000, status: 'PAID', due: '05 Sep 2026', phone: '+91 96543 88990' }
            ].map((tenant, idx) => (
              <div key={idx} className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-bold text-white text-sm">{tenant.name}</div>
                    <div className="text-[11px] text-slate-400">{tenant.room}</div>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    tenant.status === 'PAID'
                      ? 'bg-emerald-500/20 text-emerald-300'
                      : tenant.status === 'OVERDUE'
                      ? 'bg-rose-500/20 text-rose-300'
                      : 'bg-amber-500/20 text-amber-300'
                  }`}>
                    {tenant.status}
                  </span>
                </div>

                <div className="flex justify-between text-xs pt-1 border-t border-slate-800">
                  <span className="text-slate-400">Monthly Rent:</span>
                  <span className="font-bold text-white font-['Outfit']">₹{tenant.rent.toLocaleString('en-IN')}</span>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <span className="text-[11px] text-slate-500">DueDate: {tenant.due}</span>
                  <button
                    onClick={() => showToast(`Automated WhatsApp Rent reminder sent to ${tenant.name}`)}
                    className="text-[11px] text-[#00D2FF] hover:underline font-semibold"
                  >
                    Send Reminder
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
