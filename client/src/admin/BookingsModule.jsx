import React, { useEffect, useState } from 'react';
import {
  CalendarCheck,
  CreditCard,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Printer,
  X,
  Building2,
  User,
  ShieldCheck,
  FileText
} from 'lucide-react';
import { api } from '../services/api';

export default function BookingsModule() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeType, setActiveType] = useState('all'); // 'all', 'token_booking', 'visit_schedule'
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [toast, setToast] = useState('');

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 4000);
  };

  const loadBookings = async () => {
    try {
      setLoading(true);
      const data = await api.getAdminBookings(activeType, statusFilter);
      setBookings(data || []);
    } catch (err) {
      console.error('Failed to load admin bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, [activeType, statusFilter]);

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await api.updateAdminBooking(id, { status: newStatus });
      showToast(`Booking marked as '${newStatus}'.`);
      loadBookings();
    } catch (err) {
      alert(err.message || 'Update failed');
    }
  };

  const filteredBookings = bookings.filter((b) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      b.booking_code?.toLowerCase().includes(q) ||
      b.tenant_name?.toLowerCase().includes(q) ||
      b.property_title?.toLowerCase().includes(q) ||
      b.tenant_email?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      
      {/* Toast Alert */}
      {toast && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 px-4 py-3 rounded-xl flex items-center gap-2 text-sm font-semibold shadow-sm animate-fade-in">
          <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      {/* Control Panel Bar */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-xs">
        
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4 mb-4">
          
          {/* Type Tabs */}
          <div className="flex items-center gap-2">
            {[
              { id: 'all', label: 'All Records', icon: CalendarCheck },
              { id: 'token_booking', label: 'Token Advance Holds (₹500)', icon: CreditCard },
              { id: 'visit_schedule', label: 'Scheduled Visits', icon: Clock }
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeType === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveType(tab.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Icon size={14} className={isActive ? 'text-emerald-400' : 'text-slate-400'} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Filters & Search */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:border-emerald-500"
            >
              <option value="all">All Statuses</option>
              <option value="confirmed">Confirmed</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>

            <div className="relative flex-1 sm:w-60">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search by code, student, PG..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

        </div>

        <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
          <span>Total records: <strong className="text-slate-900 tabular-nums">{filteredBookings.length}</strong></span>
          <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 font-semibold">
            Zero Brokerage Protocol Active
          </span>
        </div>

      </div>

      {/* Bookings Table */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-700 uppercase font-bold text-[10px] border-b border-slate-200 tracking-wider">
              <tr>
                <th className="py-3 px-4">Booking Code</th>
                <th className="py-3 px-4">Student / Tenant</th>
                <th className="py-3 px-4">PG Property</th>
                <th className="py-3 px-4">Type &amp; Room</th>
                <th className="py-3 px-4">Target Date</th>
                <th className="py-3 px-4 text-right">Hold / Token</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    Loading records from database...
                  </td>
                </tr>
              ) : filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    No bookings found matching filters.
                  </td>
                </tr>
              ) : (
                filteredBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900 tabular-nums">
                      {b.booking_code}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{b.tenant_name}</div>
                      <div className="text-[11px] text-slate-500 font-mono">{b.tenant_phone}</div>
                      <div className="text-[10px] text-slate-400">{b.tenant_email}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-800 line-clamp-1">{b.property_title}</div>
                      <div className="text-[11px] text-slate-400">{b.locality}, {b.city}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold mb-1 ${
                        b.booking_type === 'token_booking'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-purple-50 text-purple-700 border border-purple-200'
                      }`}>
                        {b.booking_type === 'token_booking' ? '₹500 Bed Hold' : (b.visit_mode === 'video_call' ? 'Live Video Tour' : 'Physical Visit')}
                      </span>
                      <div className="text-[11px] text-slate-500">{b.room_type || 'Twin Sharing'}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      {b.move_in_date ? (
                        <div>
                          <span className="text-[10px] text-slate-400">Move-in: </span>
                          <span className="font-semibold text-slate-800">{new Date(b.move_in_date).toLocaleDateString()}</span>
                        </div>
                      ) : b.visit_date ? (
                        <div>
                          <div className="font-semibold text-slate-800">{new Date(b.visit_date).toLocaleDateString()}</div>
                          <div className="text-[10px] text-slate-400">{b.visit_time_slot}</div>
                        </div>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="font-black text-slate-900 tabular-nums">
                        {b.token_amount > 0 ? `₹${b.token_amount}` : 'Free Pass'}
                      </div>
                      <div className="text-[10px] text-emerald-600 font-semibold">{b.payment_status}</div>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <select
                        value={b.status}
                        onChange={(e) => handleUpdateStatus(b.id, e.target.value)}
                        className={`text-[11px] font-bold rounded-lg px-2 py-1 border cursor-pointer ${
                          b.status === 'confirmed'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : b.status === 'completed'
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : b.status === 'cancelled'
                            ? 'bg-rose-50 text-rose-700 border-rose-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}
                      >
                        <option value="confirmed">Confirmed</option>
                        <option value="pending">Pending</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setSelectedReceipt(b)}
                        className="px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-[11px] inline-flex items-center gap-1 cursor-pointer"
                      >
                        <FileText size={12} />
                        <span>Voucher</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Official Receipt / Voucher Modal */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 text-slate-800">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
              <div className="flex items-center gap-2">
                <ShieldCheck size={20} className="text-emerald-600" />
                <h3 className="font-heading font-extrabold text-base text-slate-900">
                  RentEase PRO Official Voucher
                </h3>
              </div>
              <button onClick={() => setSelectedReceipt(null)} className="text-slate-400 hover:text-slate-700">
                <X size={20} />
              </button>
            </div>

            {/* Printable Receipt Card */}
            <div id="printable-voucher" className="p-5 rounded-xl border border-dashed border-emerald-300 bg-emerald-50/30 space-y-4">
              
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-black text-lg text-slate-900 font-heading">RentEase <span className="text-emerald-600">PRO</span></div>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Zero-Brokerage Guarantee</p>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-slate-400 font-mono">Reference Code</div>
                  <div className="text-xs font-mono font-black text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200 tabular-nums">
                    {selectedReceipt.booking_code}
                  </div>
                </div>
              </div>

              <div className="py-2 border-y border-emerald-200/60 text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-500">Tenant / Student:</span>
                  <span className="font-bold text-slate-900">{selectedReceipt.tenant_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Contact:</span>
                  <span className="font-mono text-slate-700">{selectedReceipt.tenant_phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">PG Property:</span>
                  <span className="font-bold text-slate-900 text-right">{selectedReceipt.property_title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Room Type:</span>
                  <span className="font-semibold text-slate-800">{selectedReceipt.room_type || 'Twin Sharing'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Schedule / Move-in:</span>
                  <span className="font-semibold text-slate-800">
                    {selectedReceipt.move_in_date ? new Date(selectedReceipt.move_in_date).toLocaleDateString() : (selectedReceipt.visit_date ? `${new Date(selectedReceipt.visit_date).toLocaleDateString()} (${selectedReceipt.visit_time_slot})` : 'Flexible')}
                  </span>
                </div>
              </div>

              <div className="bg-white p-3 rounded-lg border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="text-[11px] font-bold text-slate-700">Token Advance Paid</div>
                  <div className="text-[10px] text-emerald-600">Refundable / Adjusted in 1st month rent</div>
                </div>
                <div className="text-base font-black text-emerald-600 font-heading tabular-nums">
                  {selectedReceipt.token_amount > 0 ? `₹${selectedReceipt.token_amount}` : 'FREE PASS'}
                </div>
              </div>

              <div className="text-[10px] text-slate-400 text-center">
                Verified digital token registered in RentEase PRO MySQL database. Present this pass at arrival.
              </div>

            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-200 mt-4">
              <button
                onClick={() => setSelectedReceipt(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
              >
                Close
              </button>
              <button
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5"
              >
                <Printer size={14} />
                <span>Print / Save PDF</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
