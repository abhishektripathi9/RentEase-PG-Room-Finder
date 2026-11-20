import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  CalendarCheck,
  CreditCard,
  Clock,
  Printer,
  X,
  Building2,
  MapPin,
  CheckCircle2,
  FileText,
  ShieldCheck,
  ArrowRight
} from 'lucide-react';
import { api, getCurrentUser } from '../services/api';

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const user = getCurrentUser();

  const loadBookings = async () => {
    try {
      setLoading(true);
      const data = await api.getMyBookings();
      setBookings(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-body text-slate-800 pb-20 md:pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center">
              <CalendarCheck size={20} />
            </div>
            <div>
              <h1 className="text-2xl font-black font-heading text-slate-900 tracking-tight">
                My Bookings &amp; Passes
              </h1>
              <p className="text-xs text-slate-500">
                Track scheduled property walkthroughs and active bed reservations
              </p>
            </div>
          </div>

          <Link
            to="/"
            className="self-start sm:self-auto px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs inline-flex items-center gap-1.5"
          >
            <span>Explore More PGs</span>
            <ArrowRight size={13} />
          </Link>
        </div>

        {loading ? (
          <div className="p-12 text-center text-slate-400">
            <div className="w-8 h-8 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <p className="text-xs font-semibold">Loading bookings...</p>
          </div>
        ) : bookings.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-md mx-auto">
            <CalendarCheck size={44} className="mx-auto text-slate-300 mb-3" />
            <h3 className="font-heading font-bold text-base text-slate-800">No active bookings found</h3>
            <p className="text-xs text-slate-500 mt-1 mb-5">
              Schedule a free visit or reserve a bed with ₹500 token advance on any verified PG.
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#10B981] text-slate-950 font-black text-xs shadow-md"
            >
              <span>Explore Verified PGs</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((b) => (
              <div
                key={b.id}
                className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                
                {/* Left info */}
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono font-black text-xs bg-slate-100 text-slate-800 px-2.5 py-0.5 rounded-md tabular-nums">
                      {b.booking_code}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      b.booking_type === 'token_booking'
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : 'bg-purple-50 text-purple-800 border border-purple-200'
                    }`}>
                      {b.booking_type === 'token_booking' ? '⚡ ₹500 Token Bed Lock' : '🚶 Scheduled Visit'}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      {b.status || 'Confirmed'}
                    </span>
                  </div>

                  <h3 className="font-heading font-extrabold text-base text-slate-900">
                    {b.property_title || 'Verified PG Residence'}
                  </h3>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                    <span className="font-semibold text-slate-700">{b.room_type || 'Twin Sharing'}</span>
                    <span>•</span>
                    <span>
                      {b.move_in_date ? `Move-in: ${new Date(b.move_in_date).toLocaleDateString()}` : `Visit: ${new Date(b.visit_date || b.created_at).toLocaleDateString()} (${b.visit_time_slot || 'Afternoon'})`}
                    </span>
                    <span>•</span>
                    <span className="font-mono">{b.tenant_phone}</span>
                  </div>
                </div>

                {/* Right Action & Amount */}
                <div className="flex items-center justify-between md:justify-end gap-4 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                  <div className="text-left md:text-right">
                    <div className="text-base font-black font-heading text-slate-900 tabular-nums">
                      {b.token_amount > 0 ? `₹${b.token_amount}` : 'Free Pass'}
                    </div>
                    <div className="text-[10px] font-bold text-emerald-600">
                      {b.payment_status === 'paid' ? 'Paid Online' : 'No Charge'}
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedReceipt(b)}
                    className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <FileText size={13} />
                    <span>View Pass</span>
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>

      {/* Official Voucher Modal */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 text-slate-800">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <ShieldCheck size={22} className="text-emerald-600" />
                <h3 className="font-heading font-black text-base text-slate-900">
                  RentEase PRO Pass Voucher
                </h3>
              </div>
              <button onClick={() => setSelectedReceipt(null)} className="text-slate-400 hover:text-slate-700">
                <X size={20} />
              </button>
            </div>

            <div className="p-5 rounded-2xl border border-dashed border-emerald-300 bg-emerald-50/40 space-y-3 mb-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-heading font-black text-lg text-slate-900">
                    RentEase <span className="text-emerald-600">PRO</span>
                  </div>
                  <div className="text-[10px] text-emerald-800 font-bold uppercase">Zero-Brokerage Pass</div>
                </div>
                <div className="bg-white px-2.5 py-1 rounded-lg border border-slate-200 text-xs font-mono font-black tabular-nums">
                  {selectedReceipt.booking_code}
                </div>
              </div>

              <div className="py-2 border-y border-emerald-200/60 text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">Student:</span>
                  <span className="font-bold text-slate-900">{selectedReceipt.tenant_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Residence:</span>
                  <span className="font-bold text-slate-900 text-right">{selectedReceipt.property_title || 'PG Residence'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Room Sharing:</span>
                  <span className="font-semibold text-slate-800">{selectedReceipt.room_type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Token Amount:</span>
                  <span className="font-black text-emerald-600">
                    {selectedReceipt.token_amount > 0 ? `₹${selectedReceipt.token_amount} (PAID)` : 'FREE PASS'}
                  </span>
                </div>
              </div>

              <div className="text-[10px] text-slate-500 text-center">
                Valid for check-in &amp; physical audit. Show this pass on arrival.
              </div>
            </div>

            <div className="flex items-center justify-end gap-2">
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
                <span>Print Voucher</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
