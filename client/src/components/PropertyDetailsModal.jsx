import React, { useState } from 'react';
import { X, ShieldCheck, MapPin, Calendar, ArrowRight, Check, Utensils, Wifi, Wind, Shield, Star, Phone, Send } from 'lucide-react';

export default function PropertyDetailsModal({
  property,
  onClose,
  onScheduleVisit,
  onBookNow,
  onSubmitReview
}) {
  if (!property) return null;

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [newReviewAuthor, setNewReviewAuthor] = useState('');
  const [newReviewRole, setNewReviewRole] = useState('');
  const [newReviewComment, setNewReviewComment] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [submittingReview, setSubmittingReview] = useState(false);

  const images = property.images && property.images.length > 0
    ? property.images
    : ["https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1000&q=80"];

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!newReviewAuthor.trim() || !newReviewComment.trim()) return;
    setSubmittingReview(true);
    await onSubmitReview(property.id, {
      authorName: newReviewAuthor,
      authorRole: newReviewRole || 'Resident Tenant',
      rating: Number(newReviewRating),
      comment: newReviewComment,
      cleanlinessRating: 4.8,
      foodRating: 4.6,
      wifiRating: 4.9,
      securityRating: 5.0,
      valueRating: 4.8
    });
    setNewReviewAuthor('');
    setNewReviewRole('');
    setNewReviewComment('');
    setSubmittingReview(false);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-container p-6 max-w-4xl border border-white/20"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
          <div className="flex items-center gap-2">
            <span className="tech-pill text-xs py-0.5 px-2.5">
              Verified Housing Portal
            </span>
            {property.verified && (
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                Physical Audit Verified
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

        {/* Media Gallery */}
        <div className="space-y-3 mb-6">
          <div className="h-80 w-full rounded-2xl overflow-hidden relative shadow-2xl">
            <img
              src={images[activeImageIndex]}
              alt={property.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-white">
              {activeImageIndex + 1} / {images.length} Photos
            </div>
          </div>
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-20 h-14 rounded-lg overflow-hidden shrink-0 border-2 transition-all ${
                    idx === activeImageIndex ? 'border-[#00D2FF] scale-105' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="thumb" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Title, Locality & Pricing Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10 mb-6">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-[#00D2FF] font-semibold mb-1">
              <MapPin className="w-3.5 h-3.5" />
              <span>{property.locality}, {property.city}</span>
              {property.distanceToLandmark && (
                <span className="text-slate-400">• {property.distanceToLandmark}</span>
              )}
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white font-['Outfit']">
              {property.name}
            </h2>
            <div className="flex items-center gap-2 mt-1 text-xs text-slate-400">
              <span className="text-amber-400 font-bold">★ {property.rating || '4.8'}</span>
              <span>•</span>
              <span>{property.reviews?.length || 24} Verified Reviews</span>
              <span>•</span>
              <span className="text-slate-300 font-medium">Host: {property.ownerName || 'Vikram Malhotra'}</span>
            </div>
          </div>

          <div className="flex flex-col sm:items-end">
            <div className="text-xs text-slate-400 font-medium">Beds starting at</div>
            <div className="text-2xl sm:text-3xl font-black text-white font-['Outfit'] text-[#00D2FF]">
              ₹{Number(property.startingPrice).toLocaleString('en-IN')}<span className="text-sm text-slate-400 font-normal">/mo</span>
            </div>
            <div className="text-[11px] text-emerald-400 font-semibold mt-0.5">0% Brokerage Guarantee</div>
          </div>
        </div>

        {/* Detailed Sections */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-8">
          
          {/* Main Info Column */}
          <div className="md:col-span-8 space-y-6">
            
            {/* Description */}
            <div>
              <h3 className="text-sm font-bold uppercase text-slate-400 tracking-wider mb-2 font-['Outfit']">
                About the Property
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                {property.description}
              </p>
            </div>

            {/* Room Options Matrix */}
            <div>
              <h3 className="text-sm font-bold uppercase text-slate-400 tracking-wider mb-3 font-['Outfit']">
                Room Sharing & Pricing Matrix
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {property.roomTypes?.map((room) => (
                  <div
                    key={room.id}
                    className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 flex flex-col justify-between hover:border-[#00D2FF]/40 transition-colors"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-white">{room.title}</span>
                        <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full font-semibold">
                          {room.availableBeds} beds left
                        </span>
                      </div>
                      <div className="text-xs text-slate-400 space-y-0.5">
                        <div>Attached Washroom: <span className="text-slate-200">{room.hasAttachedWashroom ? 'Yes' : 'No'}</span></div>
                        <div>Air Conditioner: <span className="text-slate-200">{room.hasAc ? 'Yes' : 'No'}</span></div>
                      </div>
                    </div>
                    <div className="mt-3 pt-2 border-t border-slate-800 flex items-center justify-between">
                      <div>
                        <span className="text-base font-extrabold text-[#00D2FF] font-['Outfit']">
                          ₹{Number(room.pricePerMonth).toLocaleString('en-IN')}
                        </span>
                        <span className="text-[10px] text-slate-500">/mo</span>
                      </div>
                      <button
                        onClick={() => {
                          onClose();
                          onBookNow(property, room);
                        }}
                        className="btn-cyber text-xs py-1.5 px-3 rounded-lg"
                      >
                        Book This Bed
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Amenities Included */}
            <div>
              <h3 className="text-sm font-bold uppercase text-slate-400 tracking-wider mb-3 font-['Outfit']">
                Amenities & Facilities
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {property.amenities?.map((amenity) => (
                  <div
                    key={amenity}
                    className="bg-slate-900/60 border border-slate-800/80 rounded-lg p-2 flex items-center gap-2 text-xs text-slate-200"
                  >
                    <Check className="w-3.5 h-3.5 text-[#00D2FF] shrink-0 stroke-[2.5]" />
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Weekly Food Menu Preview */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Utensils className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-sm font-bold text-white font-['Outfit']">Weekly Meals Schedule</h3>
                </div>
                <span className="text-[11px] bg-emerald-500/20 text-emerald-300 font-semibold px-2.5 py-0.5 rounded-full">
                  {property.foodIncluded ? 'Included in Rent' : 'Optional Service'}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="bg-slate-950/70 p-2.5 rounded-lg border border-slate-800">
                  <div className="text-[10px] font-bold uppercase text-slate-400 mb-1">Breakfast (7:30 - 10:00 AM)</div>
                  <div className="text-slate-300">Poha, Idli-Vada / Parathas, Tea & Coffee, Fresh Fruits</div>
                </div>
                <div className="bg-slate-950/70 p-2.5 rounded-lg border border-slate-800">
                  <div className="text-[10px] font-bold uppercase text-slate-400 mb-1">Lunch (Packed or Buffet)</div>
                  <div className="text-slate-300">Dal Makhani / Sambar, Seasonal Subzi, Roti, Rice & Curd</div>
                </div>
                <div className="bg-slate-950/70 p-2.5 rounded-lg border border-slate-800">
                  <div className="text-[10px] font-bold uppercase text-slate-400 mb-1">Dinner (8:00 - 10:30 PM)</div>
                  <div className="text-slate-300">Paneer Butter Masala / Chicken Curry (Wed/Sun), Biryani & Sweet</div>
                </div>
              </div>
            </div>

            {/* Verified Tenant Reviews */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold uppercase text-slate-400 tracking-wider font-['Outfit']">
                  Verified Resident Reviews ({property.reviews?.length || 0})
                </h3>
              </div>

              {/* Review List */}
              <div className="space-y-3 mb-5">
                {property.reviews && property.reviews.length > 0 ? (
                  property.reviews.map((rev) => (
                    <div key={rev.id} className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-xs font-bold text-white">{rev.authorName}</span>
                          <span className="text-[11px] text-slate-400 ml-2">• {rev.authorRole}</span>
                        </div>
                        <span className="text-xs font-bold text-amber-400">★ {rev.rating}</span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">{rev.comment}</p>
                    </div>
                  ))
                ) : (
                  <div className="text-xs text-slate-500 py-3 text-center">Be the first to review this PG!</div>
                )}
              </div>

              {/* Add Review Form */}
              <form onSubmit={handleReviewSubmit} className="bg-slate-900/60 border border-slate-800 rounded-xl p-3.5 space-y-3">
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  <span>Leave a Verified Tenant Review</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Your Name"
                    required
                    value={newReviewAuthor}
                    onChange={(e) => setNewReviewAuthor(e.target.value)}
                    className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#00D2FF]"
                  />
                  <input
                    type="text"
                    placeholder="Role (e.g. Software Dev, Student)"
                    value={newReviewRole}
                    onChange={(e) => setNewReviewRole(e.target.value)}
                    className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#00D2FF]"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-400">Rating:</span>
                  {[5, 4, 3, 2, 1].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewReviewRating(star)}
                      className={`text-xs px-2 py-0.5 rounded border transition-colors ${
                        newReviewRating === star
                          ? 'bg-amber-400 text-slate-950 font-bold border-amber-400'
                          : 'bg-slate-950 border-slate-800 text-slate-300'
                      }`}
                    >
                      {star} ★
                    </button>
                  ))}
                </div>
                <textarea
                  placeholder="Share your experience regarding food, cleanliness, internet speed and landlord support..."
                  required
                  rows={2}
                  value={newReviewComment}
                  onChange={(e) => setNewReviewComment(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-[#00D2FF]"
                />
                <button
                  type="submit"
                  disabled={submittingReview}
                  className="btn-cyber text-xs py-1.5 px-4 font-bold flex items-center gap-1.5"
                >
                  <Send className="w-3 h-3" />
                  <span>{submittingReview ? 'Submitting...' : 'Post Review'}</span>
                </button>
              </form>
            </div>

          </div>

          {/* Right Sidebar: Rules & Quick Action Sticky Card */}
          <div className="md:col-span-4 space-y-4">
            
            {/* Quick Action Card */}
            <div className="bg-slate-900/90 border border-[#00D2FF]/30 p-4 rounded-xl space-y-3 sticky top-4">
              <div className="text-xs uppercase font-bold text-[#00D2FF] tracking-wider">
                Direct Landlord Booking
              </div>

              <div className="space-y-1.5 text-xs text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-400">Security Deposit:</span>
                  <span className="font-semibold text-white">₹{Number(property.depositAmount || 12000).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Notice Period:</span>
                  <span className="font-semibold text-white">{property.noticePeriodDays || 30} Days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Brokerage:</span>
                  <span className="font-bold text-emerald-400">₹0 (Free)</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 space-y-2">
                <button
                  onClick={() => {
                    onClose();
                    onBookNow(property);
                  }}
                  className="w-full btn-cyber py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(0,210,255,0.4)]"
                >
                  <span>Book Bed Now</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => {
                    onClose();
                    onScheduleVisit(property);
                  }}
                  className="w-full btn-outline py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2"
                >
                  <Calendar className="w-3.5 h-3.5 text-[#00D2FF]" />
                  <span>Schedule Free Visit</span>
                </button>
              </div>

              {/* Host Profile */}
              <div className="pt-3 border-t border-slate-800 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-500 to-purple-600 flex items-center justify-center text-white font-black text-sm">
                  {property.ownerName ? property.ownerName.charAt(0) : 'V'}
                </div>
                <div>
                  <div className="text-xs font-bold text-white">{property.ownerName || 'Vikram Malhotra'}</div>
                  <div className="text-[11px] text-slate-400">Property Manager</div>
                  <div className="text-[10px] text-emerald-400 flex items-center gap-1 mt-0.5">
                    <Phone className="w-2.5 h-2.5" />
                    <span>{property.ownerPhone || '+91 98450 12345'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* House Rules */}
            <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl space-y-2.5 text-xs">
              <div className="text-xs uppercase font-bold text-slate-400 tracking-wider">
                House Policies & Rules
              </div>
              <ul className="space-y-1.5 text-slate-300">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#00D2FF]" />
                  <span>Gate Closing: <strong>{property.gateClosingTime || 'No Curfew'}</strong></span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#00D2FF]" />
                  <span>Visitors: <strong>{property.visitorsAllowed ? 'Allowed in Common Areas' : 'Not Allowed'}</strong></span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#00D2FF]" />
                  <span>Food Preferences: <strong>{property.foodType === 'VEG' ? 'Pure Vegetarian Only' : 'Veg & Non-Veg'}</strong></span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#00D2FF]" />
                  <span>Notice Period: <strong>{property.noticePeriodDays || 30} Days before vacating</strong></span>
                </li>
              </ul>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
