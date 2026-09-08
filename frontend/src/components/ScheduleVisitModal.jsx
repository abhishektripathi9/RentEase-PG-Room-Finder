import React, { useState } from 'react';
import { X, Calendar, Clock, Video, MapPin, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';

export default function ScheduleVisitModal({
  property,
  onClose,
  onVisitScheduled
}) {
  if (!property) return null;

  const [visitorName, setVisitorName] = useState('Rahul Verma');
  const [visitorEmail, setVisitorEmail] = useState('rahul.v@gmail.com');
  const [visitorPhone, setVisitorPhone] = useState('+91 98450 67890');
  const [visitDate, setVisitDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return d.toISOString().split('T')[0];
  });
  const [timeSlot, setTimeSlot] = useState('10:00 AM - 12:00 PM');
  const [visitType, setVisitType] = useState('IN_PERSON'); // IN_PERSON, VIDEO_TOUR
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedVisit, setConfirmedVisit] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const visitData = {
      propertyId: property.id,
      propertyName: property.name,
      visitorName,
      visitorEmail,
      visitorPhone,
      visitDate,
      timeSlot,
      visitType,
      notes,
      status: 'SCHEDULED'
    };

    const result = await onVisitScheduled(visitData);
    setConfirmedVisit(result);
    setIsSubmitting(false);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-container p-6 max-w-lg border border-[#00D2FF]/40"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
          <div className="flex items-center gap-2">
            <span className="tech-pill text-xs">Free Property Tour</span>
            <span className="text-xs text-slate-400 font-medium truncate max-w-[200px]">
              {property.name}
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {!confirmedVisit ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <div className="text-base font-bold text-white font-['Outfit'] mb-1">
                Schedule a Visit at {property.name}
              </div>
              <div className="text-xs text-slate-400 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#00D2FF]" />
                <span>{property.locality}, {property.city}</span>
              </div>
            </div>

            {/* Visit Type Selector */}
            <div>
              <label className="text-xs font-bold uppercase text-slate-400 tracking-wider block mb-2">
                Tour Format
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setVisitType('IN_PERSON')}
                  className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                    visitType === 'IN_PERSON'
                      ? 'bg-cyan-500/20 border-[#00D2FF] text-[#00D2FF]'
                      : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`}
                >
                  <MapPin className="w-4 h-4" />
                  <span>In-Person Walkthrough</span>
                </button>
                <button
                  type="button"
                  onClick={() => setVisitType('VIDEO_TOUR')}
                  className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                    visitType === 'VIDEO_TOUR'
                      ? 'bg-purple-500/20 border-[#9B51E0] text-[#9B51E0]'
                      : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`}
                >
                  <Video className="w-4 h-4" />
                  <span>Live Video Call Tour</span>
                </button>
              </div>
            </div>

            {/* Date & Slot */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold uppercase text-slate-400 tracking-wider block mb-1">
                  Visit Date
                </label>
                <input
                  type="date"
                  required
                  value={visitDate}
                  onChange={(e) => setVisitDate(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#00D2FF]"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-slate-400 tracking-wider block mb-1">
                  Time Slot
                </label>
                <select
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#00D2FF]"
                >
                  <option value="10:00 AM - 12:00 PM" className="bg-slate-900">Morning (10 AM - 12 PM)</option>
                  <option value="02:00 PM - 04:00 PM" className="bg-slate-900">Afternoon (2 PM - 4 PM)</option>
                  <option value="05:00 PM - 07:00 PM" className="bg-slate-900">Evening (5 PM - 7 PM)</option>
                </select>
              </div>
            </div>

            {/* Visitor Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold uppercase text-slate-400 tracking-wider block mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  required
                  value={visitorName}
                  onChange={(e) => setVisitorName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#00D2FF]"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-slate-400 tracking-wider block mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  required
                  value={visitorPhone}
                  onChange={(e) => setVisitorPhone(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#00D2FF]"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold uppercase text-slate-400 tracking-wider block mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                value={visitorEmail}
                onChange={(e) => setVisitorEmail(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#00D2FF]"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase text-slate-400 tracking-wider block mb-1">
                Notes for Landlord (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Inquiring about single room, parking space..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#00D2FF]"
              />
            </div>

            <div className="pt-3 flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-cyber py-2.5 px-6 rounded-xl text-xs font-bold flex items-center gap-2"
              >
                <span>{isSubmitting ? 'Confirming Visit...' : 'Confirm Free Tour'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        ) : (
          <div className="text-center py-4 space-y-4">
            <div className="w-12 h-12 mx-auto rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-7 h-7" />
            </div>

            <div>
              <h3 className="text-xl font-black text-white font-['Outfit']">
                Visit Scheduled!
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                The property manager has been notified and your pass is confirmed.
              </p>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 text-left space-y-2 text-xs">
              <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                <span className="text-slate-400">Visit Pass Code:</span>
                <span className="font-mono font-bold text-[#00D2FF] text-sm">{confirmedVisit.visitCode}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Date & Slot:</span>
                <span className="font-semibold text-white">{confirmedVisit.visitDate} • {confirmedVisit.timeSlot}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Tour Format:</span>
                <span className="font-semibold text-white">{confirmedVisit.visitType === 'IN_PERSON' ? 'In-Person Walkthrough' : 'Live Video Call'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Host Contact:</span>
                <span className="font-semibold text-emerald-400">{property.ownerPhone || '+91 98450 12345'}</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="btn-cyber text-xs py-2 px-6 rounded-xl font-bold"
            >
              Done
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
