import React from 'react';
import { X, ShieldCheck, MapPin, Calendar, ArrowRight, Check, Utensils, Wifi, Wind, Shield } from 'lucide-react';

export default function QuickViewModal({
  property,
  onClose,
  onOpenDetails,
  onScheduleVisit,
  onBookNow
}) {
  if (!property) return null;

  const images = property.images && property.images.length > 0
    ? property.images
    : ["https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80"];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-container p-6 border border-[#00D2FF]/40"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Close */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
          <div className="flex items-center gap-2">
            <span className="tech-pill text-xs py-0.5 px-2.5">
              Quick View
            </span>
            {property.verified && (
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                Verified Listing
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Left Column: Image & Highlights */}
          <div className="md:col-span-6 space-y-4">
            <div className="h-64 w-full rounded-xl overflow-hidden relative shadow-lg">
              <img
                src={images[0]}
                alt={property.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-lg text-xs font-bold text-white">
                ★ {property.rating || '4.8'} ({property.reviewCount || 24} reviews)
              </div>
            </div>

            {/* Quick Specs Grid */}
            <div className="grid grid-cols-2 gap-2.5 text-xs">
              <div className="bg-slate-900/80 border border-slate-800 p-2.5 rounded-xl">
                <div className="text-slate-400 text-[10px] uppercase font-bold">Food Included</div>
                <div className="text-emerald-400 font-semibold mt-0.5 flex items-center gap-1">
                  <Utensils className="w-3.5 h-3.5" />
                  {property.foodIncluded ? '3 Meals Buffet' : 'Self Cooking / Order'}
                </div>
              </div>

              <div className="bg-slate-900/80 border border-slate-800 p-2.5 rounded-xl">
                <div className="text-slate-400 text-[10px] uppercase font-bold">Gate Timing</div>
                <div className="text-slate-200 font-semibold mt-0.5">
                  {property.gateClosingTime || 'No Curfew'}
                </div>
              </div>

              <div className="bg-slate-900/80 border border-slate-800 p-2.5 rounded-xl">
                <div className="text-slate-400 text-[10px] uppercase font-bold">Security Deposit</div>
                <div className="text-slate-200 font-semibold mt-0.5">
                  ₹{Number(property.depositAmount || 12000).toLocaleString('en-IN')} (1 Mo)
                </div>
              </div>

              <div className="bg-slate-900/80 border border-slate-800 p-2.5 rounded-xl">
                <div className="text-slate-400 text-[10px] uppercase font-bold">Notice Period</div>
                <div className="text-slate-200 font-semibold mt-0.5">
                  {property.noticePeriodDays || 30} Days
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Details & Room Selection */}
          <div className="md:col-span-6 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                <MapPin className="w-3.5 h-3.5 text-[#00D2FF]" />
                <span>{property.locality}, {property.city}</span>
              </div>

              <h2 className="text-2xl font-black text-white font-['Outfit'] mb-2">
                {property.name}
              </h2>

              <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed mb-4">
                {property.description}
              </p>

              {/* Room Sharing Options */}
              <div className="space-y-2 mb-4">
                <div className="text-xs uppercase font-bold text-slate-400 tracking-wider">
                  Available Room Types
                </div>
                <div className="space-y-1.5">
                  {property.roomTypes?.map((room) => (
                    <div
                      key={room.id}
                      className="bg-slate-900/80 border border-slate-800 hover:border-[#00D2FF]/40 rounded-xl p-2.5 flex items-center justify-between transition-colors"
                    >
                      <div>
                        <div className="text-xs font-bold text-white">{room.title}</div>
                        <div className="text-[10px] text-slate-400">
                          {room.availableBeds} beds left • {room.hasAttachedWashroom ? 'Attached Bath' : 'Common Bath'}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-extrabold text-[#00D2FF] font-['Outfit']">
                          ₹{Number(room.pricePerMonth).toLocaleString('en-IN')}
                        </div>
                        <div className="text-[10px] text-slate-500">per month</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions Bar */}
            <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row gap-2.5">
              <button
                onClick={() => {
                  onClose();
                  onScheduleVisit(property);
                }}
                className="btn-outline text-xs py-2.5 flex-1 font-bold flex items-center justify-center gap-2"
              >
                <Calendar className="w-3.5 h-3.5 text-[#00D2FF]" />
                <span>Schedule Visit</span>
              </button>

              <button
                onClick={() => {
                  onClose();
                  onBookNow(property);
                }}
                className="btn-cyber text-xs py-2.5 flex-1 font-bold flex items-center justify-center gap-2"
              >
                <span>Instant Booking</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>

        </div>

        {/* View Full Property Details Link */}
        <div className="mt-5 pt-3 border-t border-white/5 text-center">
          <button
            onClick={() => {
              onClose();
              onOpenDetails(property);
            }}
            className="text-xs font-semibold text-slate-400 hover:text-[#00D2FF] transition-colors inline-flex items-center gap-1"
          >
            <span>View Full Property Details, Food Menu & Verified Reviews</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

      </div>
    </div>
  );
}
