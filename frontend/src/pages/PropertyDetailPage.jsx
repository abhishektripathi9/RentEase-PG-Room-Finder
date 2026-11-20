import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  MapPin,
  Star,
  Zap,
  ShieldCheck,
  Building2,
  Calendar,
  Clock,
  CheckCircle2,
  Phone,
  Mail,
  User,
  Heart,
  Share2,
  X,
  CreditCard,
  Printer,
  Sparkles,
  Wifi,
  Utensils,
  Wind,
  BatteryCharging,
  Video
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { api, getCurrentUser } from '../services/api';

export default function PropertyDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [isWish, setIsWish] = useState(false);

  // Modals
  const [visitModalOpen, setVisitModalOpen] = useState(false);
  const [bookModalOpen, setBookModalOpen] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Form states
  const currentUser = getCurrentUser();
  const [tenantName, setTenantName] = useState(currentUser?.name || '');
  const [tenantPhone, setTenantPhone] = useState(currentUser?.phone || '');
  const [tenantEmail, setTenantEmail] = useState(currentUser?.email || '');
  const [moveInDate, setMoveInDate] = useState('');
  const [visitDate, setVisitDate] = useState('');
  const [visitSlot, setVisitSlot] = useState('02:00 PM - 05:00 PM');
  const [visitMode, setVisitMode] = useState('in_person');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const loadProperty = async () => {
    try {
      setLoading(true);
      const data = await api.getPropertyById(id);
      if (data) {
        setProperty(data);
        if (data.room_types && data.room_types.length > 0) {
          setSelectedRoom(data.room_types[0]);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProperty();
    setIsWish(api.isWishlisted(parseInt(id, 10)));
  }, [id]);

  const handleToggleWishlist = async () => {
    const res = await api.toggleWishlist(parseInt(id, 10));
    setIsWish(res.wishlisted);
    showToast(res.wishlisted ? 'Saved to wishlist!' : 'Removed from wishlist.');
  };

  // Schedule Visit Submit
  const handleScheduleVisit = async (e) => {
    e.preventDefault();
    if (!tenantName || !tenantPhone || !tenantEmail || !visitDate) {
      alert('Please fill out all visit details.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.createBooking({
        property_id: property.id,
        booking_type: 'visit_schedule',
        room_type: selectedRoom?.type || 'Twin Sharing Room',
        visit_date: visitDate,
        visit_time_slot: visitSlot,
        visit_mode: visitMode,
        token_amount: 0,
        monthly_rent: selectedRoom?.price || property.price_starting,
        tenant_name: tenantName,
        tenant_phone: tenantPhone,
        tenant_email: tenantEmail
      });

      setVisitModalOpen(false);
      setConfirmedBooking(res.booking);
      confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
    } catch (err) {
      alert(err.message || 'Failed to schedule visit');
    } finally {
      setSubmitting(false);
    }
  };

  // Token Advance Booking Submit (₹500 Hold)
  const handleBookWithToken = async (e) => {
    e.preventDefault();
    if (!tenantName || !tenantPhone || !tenantEmail || !moveInDate) {
      alert('Please complete tenant details and select target move-in date.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.createBooking({
        property_id: property.id,
        booking_type: 'token_booking',
        room_type: selectedRoom?.type || 'Twin Sharing Room',
        move_in_date: moveInDate,
        token_amount: 500,
        monthly_rent: selectedRoom?.price || property.price_starting,
        tenant_name: tenantName,
        tenant_phone: tenantPhone,
        tenant_email: tenantEmail
      });

      // Reload property to reflect live decremented bed inventory
      loadProperty();
      setBookModalOpen(false);
      setConfirmedBooking(res.booking);

      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#10B981', '#34D399', '#059669', '#38BDF8']
      });
    } catch (err) {
      alert(err.message || 'Booking reservation failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-8">
        <div className="text-center">
          <div className="w-10 h-10 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs font-bold text-slate-500">Loading PG verified walkthrough...</p>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] p-8 text-center">
        <Building2 size={40} className="mx-auto text-slate-300 mb-3" />
        <h2 className="text-lg font-bold text-slate-800">Property not found</h2>
        <Link to="/" className="inline-block mt-4 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold">
          Return to Explore
        </Link>
      </div>
    );
  }

  const images = property.images && property.images.length > 0 ? property.images : [
    'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1200&q=80'
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-body text-slate-800 pb-20 md:pb-12">
      
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-24 right-5 z-50 bg-[#071917] text-white border border-emerald-500/50 px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 text-xs font-bold animate-fade-in">
          <Sparkles size={16} className="text-[#10B981]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Breadcrumb & Actions Bar */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between text-xs">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 font-bold text-slate-600 hover:text-emerald-600 transition-colors cursor-pointer"
          >
            <ArrowLeft size={16} />
            <span>Back to listings</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleWishlist}
              className={`p-2 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer flex items-center gap-1.5 font-bold ${
                isWish ? 'text-rose-600 bg-rose-50 border-rose-200' : 'text-slate-600'
              }`}
            >
              <Heart size={15} className={isWish ? 'fill-rose-600' : ''} />
              <span>{isWish ? 'Saved' : 'Save'}</span>
            </button>
            <button
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                showToast('Link copied to clipboard!');
              }}
              className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <Share2 size={15} />
              <span>Share</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        
        {/* Title Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500 text-slate-950">
                ✓ 0% Brokerage Verified
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-900 text-white">
                {property.category} PG
              </span>
              <span className="flex items-center gap-1 text-xs font-black text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                <Star size={12} className="fill-amber-500 text-amber-500" />
                <span>{property.rating || '4.9'}</span>
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black font-heading text-slate-900 tracking-tight">
              {property.title}
            </h1>
            <div className="flex items-center gap-2 text-xs text-slate-500 mt-1.5">
              <MapPin size={14} className="text-emerald-600 shrink-0" />
              <span>{property.address}</span>
            </div>
          </div>

          {/* Quick Bed Vacancy Pill */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center font-black">
              <Zap size={20} />
            </div>
            <div>
              <div className="text-xs font-extrabold text-emerald-900 tabular-nums">
                {property.available_beds} Vacant Beds Left
              </div>
              <div className="text-[11px] text-emerald-700">
                Live sync with RentEase MySQL Inventory
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================
            PHOTO GALLERY CAROUSEL / GRID
            ======================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
          {/* Main Large Photo */}
          <div className="lg:col-span-2 h-[380px] sm:h-[440px] rounded-3xl overflow-hidden relative shadow-md bg-slate-950">
            <img
              src={images[selectedImage]}
              alt={property.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-4 left-4 bg-slate-900/80 backdrop-blur-xs text-white px-3 py-1 rounded-full text-xs font-bold">
              Photo {selectedImage + 1} of {images.length}
            </div>
          </div>

          {/* Side Thumbnail List */}
          <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-y-auto max-h-[440px] no-scrollbar">
            {images.map((img, idx) => (
              <div
                key={idx}
                onClick={() => setSelectedImage(idx)}
                className={`h-24 sm:h-28 lg:h-[135px] w-36 lg:w-full rounded-2xl overflow-hidden shrink-0 cursor-pointer border-2 transition-all ${
                  selectedImage === idx ? 'border-emerald-500 shadow-md scale-98' : 'border-transparent opacity-75 hover:opacity-100'
                }`}
              >
                <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>

        {/* ========================================================
            SPLIT LAYOUT: DETAILS & BOOKING CARD
            ======================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left 2 Cols: Details, Amenities, Rules, KYC */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Landmark Proximity */}
            {property.landmark_distance && (
              <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-4 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                  📍
                </div>
                <div>
                  <div className="text-xs font-bold text-emerald-950">Prime Strategic Proximity</div>
                  <div className="text-sm font-black text-emerald-800">{property.landmark_distance}</div>
                </div>
              </div>
            )}

            {/* Description */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
              <h3 className="font-heading font-black text-base text-slate-900 mb-2">
                About this Residence
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {property.description}
              </p>
            </div>

            {/* Room Sharing Types & Bed Breakdown */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
              <h3 className="font-heading font-black text-base text-slate-900 mb-3">
                Select Sharing Configuration
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {property.room_types && property.room_types.map((rt, i) => {
                  const isSelected = selectedRoom?.type === rt.type;
                  return (
                    <div
                      key={i}
                      onClick={() => setSelectedRoom(rt)}
                      className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                        isSelected
                          ? 'border-emerald-500 bg-emerald-50/40 shadow-xs'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-bold text-xs text-slate-900">{rt.type}</span>
                        {isSelected && (
                          <CheckCircle2 size={16} className="text-emerald-600" />
                        )}
                      </div>
                      <div className="text-lg font-black font-heading text-emerald-600 tabular-nums">
                        ₹{rt.price.toLocaleString()} <span className="text-xs text-slate-400 font-normal">/mo</span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-1">
                        ⚡ {rt.beds_available} of {rt.beds_total} beds available
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Amenities Grid */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
              <h3 className="font-heading font-black text-base text-slate-900 mb-4">
                Verified Amenities Included in Rent
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {property.amenities && property.amenities.map((amenity, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs font-semibold text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* House Rules */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
              <h3 className="font-heading font-black text-base text-slate-900 mb-3">
                House Rules &amp; Co-Living Policies
              </h3>
              <div className="flex flex-wrap gap-2">
                {property.house_rules && property.house_rules.map((rule, i) => (
                  <span key={i} className="text-xs font-bold bg-slate-100 text-slate-700 px-3 py-1.5 rounded-xl border border-slate-200">
                    📜 {rule}
                  </span>
                ))}
              </div>
            </div>

            {/* Landlord KYC & Trust Card */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-slate-900 text-emerald-400 flex items-center justify-center font-black font-heading text-lg">
                    {property.owner_name?.charAt(0) || 'H'}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-heading font-extrabold text-sm text-slate-900">{property.owner_name}</h4>
                      {property.is_verified_host && (
                        <ShieldCheck size={16} className="text-emerald-500 fill-emerald-50" />
                      )}
                    </div>
                    <p className="text-xs text-slate-500">Verified Landlord / Host • 100% KYC Approved</p>
                    <p className="text-xs text-slate-400 font-mono mt-0.5">{property.owner_phone}</p>
                  </div>
                </div>
                <span className="text-[10px] uppercase font-black bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full">
                  Direct Owner
                </span>
              </div>
            </div>

          </div>

          {/* Right Col: Sticky Booking / Reservation Box */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 bg-white rounded-3xl p-6 border border-slate-200 shadow-lg space-y-5">
              
              <div className="pb-4 border-b border-slate-100">
                <div className="text-xs text-slate-500 font-medium">Selected Rent:</div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black font-heading text-slate-900 tabular-nums">
                    ₹{(selectedRoom?.price || property.price_starting).toLocaleString()}
                  </span>
                  <span className="text-xs text-slate-500">/month</span>
                </div>
                <div className="text-xs font-bold text-emerald-600 mt-1">
                  ✓ 0% Brokerage • ₹0 Hidden Fees
                </div>
              </div>

              {/* Action 1: Book with ₹500 Token Advance */}
              <div>
                <button
                  type="button"
                  onClick={() => setBookModalOpen(true)}
                  className="w-full py-3.5 px-4 rounded-2xl bg-[#10B981] hover:bg-emerald-400 text-slate-950 font-black text-sm shadow-[0_4px_20px_rgba(16,185,129,0.35)] transition-all cursor-pointer flex items-center justify-center gap-2 font-heading"
                >
                  <CreditCard size={18} />
                  <span>Book with ₹500 Token Advance</span>
                </button>
                <p className="text-[11px] text-center text-slate-400 mt-1.5 font-medium">
                  Locks your bed instantly in MySQL. 100% refundable if cancelled within 24 hrs.
                </p>
              </div>

              {/* Action 2: Schedule Free Visit */}
              <div className="pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setVisitModalOpen(true)}
                  className="w-full py-3 px-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Calendar size={15} className="text-emerald-400" />
                  <span>Schedule Free Property Visit</span>
                </button>
                <p className="text-[11px] text-center text-slate-400 mt-1.5">
                  Physical walkthrough or live video tour with the owner.
                </p>
              </div>

              {/* Guarantee checklist */}
              <div className="bg-slate-50 rounded-2xl p-4 text-[11px] space-y-1.5 text-slate-600 border border-slate-100">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 size={13} className="text-emerald-500 shrink-0" />
                  <span>Zero brokerage guarantee certificate</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 size={13} className="text-emerald-500 shrink-0" />
                  <span>48-hr deposit return promise</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 size={13} className="text-emerald-500 shrink-0" />
                  <span>Direct landlord contact handover</span>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>

      {/* ========================================================
          MODAL 1: SCHEDULE VISIT
          ======================================================== */}
      {visitModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={handleScheduleVisit} className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Calendar size={20} className="text-emerald-600" />
                <h3 className="font-heading font-black text-base text-slate-900">
                  Schedule Free PG Visit
                </h3>
              </div>
              <button type="button" onClick={() => setVisitModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X size={20} />
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Your Full Name</label>
              <input
                type="text"
                required
                value={tenantName}
                onChange={(e) => setTenantName(e.target.value)}
                placeholder="Aarav Mehta"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  required
                  value={tenantPhone}
                  onChange={(e) => setTenantPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={tenantEmail}
                  onChange={(e) => setTenantEmail(e.target.value)}
                  placeholder="student@gmail.com"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Visit Date</label>
                <input
                  type="date"
                  required
                  value={visitDate}
                  onChange={(e) => setVisitDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Time Slot</label>
                <select
                  value={visitSlot}
                  onChange={(e) => setVisitSlot(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs"
                >
                  <option value="10:00 AM - 01:00 PM">10:00 AM - 01:00 PM</option>
                  <option value="02:00 PM - 05:00 PM">02:00 PM - 05:00 PM</option>
                  <option value="05:00 PM - 08:00 PM">05:00 PM - 08:00 PM</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Tour Mode</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setVisitMode('in_person')}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 ${
                    visitMode === 'in_person' ? 'bg-slate-900 text-white border-slate-900' : 'bg-slate-50 text-slate-700 border-slate-200'
                  }`}
                >
                  <span>🚶 In-Person Walkthrough</span>
                </button>
                <button
                  type="button"
                  onClick={() => setVisitMode('video_call')}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 ${
                    visitMode === 'video_call' ? 'bg-slate-900 text-white border-slate-900' : 'bg-slate-50 text-slate-700 border-slate-200'
                  }`}
                >
                  <span>📹 Live Video Tour</span>
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer"
            >
              {submitting ? 'Generating Pass...' : 'Confirm Free Visit Pass'}
            </button>
          </form>
        </div>
      )}

      {/* ========================================================
          MODAL 2: BOOK WITH ₹500 TOKEN ADVANCE
          ======================================================== */}
      {bookModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={handleBookWithToken} className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <CreditCard size={20} className="text-emerald-600" />
                <h3 className="font-heading font-black text-base text-slate-900">
                  Instant Bed Lock (₹500 Token)
                </h3>
              </div>
              <button type="button" onClick={() => setBookModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X size={20} />
              </button>
            </div>

            <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-950 flex items-center justify-between">
              <div>
                <span className="font-bold">{selectedRoom?.type || 'Twin Sharing'}</span>
                <div className="text-[10px] text-emerald-700">Monthly Rent: ₹{(selectedRoom?.price || property.price_starting).toLocaleString()}</div>
              </div>
              <span className="text-base font-black text-emerald-600 font-heading">₹500 HOLD</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Student / Tenant Name</label>
              <input
                type="text"
                required
                value={tenantName}
                onChange={(e) => setTenantName(e.target.value)}
                placeholder="Aarav Mehta"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Phone</label>
                <input
                  type="tel"
                  required
                  value={tenantPhone}
                  onChange={(e) => setTenantPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Move-in Date</label>
                <input
                  type="date"
                  required
                  value={moveInDate}
                  onChange={(e) => setMoveInDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Email</label>
              <input
                type="email"
                required
                value={tenantEmail}
                onChange={(e) => setTenantEmail(e.target.value)}
                placeholder="aarav@gmail.com"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs"
              />
            </div>

            {/* Payment simulation notice */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-500">
              💳 Simulated Instant Checkout: Token amount is adjusted against your 1st month rent. 100% refundable.
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 rounded-2xl bg-[#10B981] hover:bg-emerald-400 text-slate-950 font-black text-sm flex items-center justify-center gap-2 cursor-pointer font-heading shadow-md"
            >
              {submitting ? 'Confirming MySQL Bed Lock...' : 'Pay ₹500 & Lock Bed Now'}
            </button>
          </form>
        </div>
      )}

      {/* ========================================================
          CONFIRMED BOOKING PASS / VOUCHER MODAL
          ======================================================== */}
      {confirmedBooking && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 text-slate-800">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={24} className="text-[#10B981]" />
                <h3 className="font-heading font-black text-lg text-slate-900">
                  Zero-Brokerage Pass Issued!
                </h3>
              </div>
              <button onClick={() => setConfirmedBooking(null)} className="text-slate-400 hover:text-slate-700">
                <X size={20} />
              </button>
            </div>

            {/* Voucher Card */}
            <div className="p-5 rounded-2xl border border-dashed border-emerald-300 bg-emerald-50/40 space-y-3 mb-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-heading font-black text-lg text-slate-900">
                    RentEase <span className="text-emerald-600">PRO</span>
                  </div>
                  <div className="text-[10px] text-emerald-800 font-bold uppercase">Official Digital Pass</div>
                </div>
                <div className="bg-white px-2.5 py-1 rounded-lg border border-slate-200 text-xs font-mono font-black tabular-nums">
                  {confirmedBooking.booking_code}
                </div>
              </div>

              <div className="py-2 border-y border-emerald-200/60 text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">Student Name:</span>
                  <span className="font-bold text-slate-900">{confirmedBooking.tenant_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Property:</span>
                  <span className="font-bold text-slate-900">{property.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Room Config:</span>
                  <span className="font-semibold text-slate-800">{confirmedBooking.room_type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Scheduled Date:</span>
                  <span className="font-semibold text-slate-800">
                    {confirmedBooking.move_in_date ? new Date(confirmedBooking.move_in_date).toLocaleDateString() : (confirmedBooking.visit_date ? new Date(confirmedBooking.visit_date).toLocaleDateString() : 'Immediate')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Token Amount:</span>
                  <span className="font-black text-emerald-600">
                    {confirmedBooking.token_amount > 0 ? `₹${confirmedBooking.token_amount} (PAID)` : 'FREE PASS'}
                  </span>
                </div>
              </div>

              <div className="text-[10px] text-slate-500 text-center">
                Registered in RentEase MySQL database. Available beds updated atomically.
              </div>
            </div>

            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setConfirmedBooking(null)}
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
