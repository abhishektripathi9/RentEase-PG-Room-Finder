import React, { useState, useEffect } from 'react';
import { X, Calendar, KeyRound, Clock, ShieldCheck, MapPin } from 'lucide-react';
import { api } from '../services/api';

export default function MyBookingsModal({ onClose, onBookNew }) {
  const [activeTab, setActiveTab] = useState('bookings'); // 'bookings' or 'visits'
  const [bookings, setBookings] = useState([]);
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [b, v] = await Promise.all([api.getBookings(), api.getVisits()]);
        setBookings(b);
        setVisits(v);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-container p-6 max-w-2xl border border-white/20"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#00D2FF]" />
            <h2 className="text-lg font-black text-white font-['Outfit']">
              My Scheduled Visits & Reservations
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Buttons */}
        <div className="flex gap-3 border-b border-white/10 pb-3 mb-4">
          <button
            onClick={() => setActiveTab('bookings')}
            className={`text-xs sm:text-sm font-bold pb-1 transition-colors ${
              activeTab === 'bookings'
                ? 'text-[#00D2FF] border-b-2 border-[#00D2FF]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Confirmed Bed Bookings ({bookings.length})
          </button>
          <button
            onClick={() => setActiveTab('visits')}
            className={`text-xs sm:text-sm font-bold pb-1 transition-colors ${
              activeTab === 'visits'
                ? 'text-[#00D2FF] border-b-2 border-[#00D2FF]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Scheduled Property Visits ({visits.length})
          </button>
        </div>

        {/* Content */}
        {activeTab === 'bookings' && (
          <div className="space-y-3">
            {bookings.length > 0 ? (
              bookings.map((b) => (
                <div key={b.id} className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-sm font-bold text-white">{b.propertyName}</div>
                      <div className="text-xs text-slate-400">{b.roomCategory} Sharing Bed</div>
                    </div>
                    <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {b.bookingStatus}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-300 pt-1 border-t border-slate-800">
                    <div>Booking Code: <span className="font-mono text-[#00D2FF] font-bold">{b.bookingCode}</span></div>
                    <div>Move-in: <span className="font-semibold text-white">{b.moveInDate}</span></div>
                    <div>Monthly Rent: <span className="font-semibold text-white">₹{Number(b.monthlyRent).toLocaleString('en-IN')}/mo</span></div>
                    <div>Token Paid: <span className="font-semibold text-emerald-400">₹{Number(b.totalAmountPaid).toLocaleString('en-IN')}</span></div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-xs text-slate-400">
                No active bookings yet. Explore verified PGs and reserve your bed!
              </div>
            )}
          </div>
        )}

        {activeTab === 'visits' && (
          <div className="space-y-3">
            {visits.length > 0 ? (
              visits.map((v) => (
                <div key={v.id} className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-sm font-bold text-white">{v.propertyName}</div>
                      <div className="text-xs text-slate-400">
                        {v.visitType === 'IN_PERSON' ? 'In-Person Walkthrough' : 'Live Video Tour'}
                      </div>
                    </div>
                    <span className="bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {v.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-300 pt-1 border-t border-slate-800">
                    <div>Visit Pass: <span className="font-mono text-[#00D2FF] font-bold">{v.visitCode}</span></div>
                    <div>Date: <span className="font-semibold text-white">{v.visitDate}</span></div>
                    <div>Time Slot: <span className="font-semibold text-white">{v.timeSlot}</span></div>
                    <div>Visitor: <span className="font-semibold text-white">{v.visitorName}</span></div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-xs text-slate-400">
                No scheduled visits. Book a free walkthrough anytime!
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
