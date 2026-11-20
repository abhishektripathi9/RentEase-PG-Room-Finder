import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Building2,
  PlusCircle,
  CheckCircle2,
  MapPin,
  DollarSign,
  ShieldCheck,
  Upload,
  ArrowRight,
  Sparkles,
  Info
} from 'lucide-react';
import { api, getCurrentUser } from '../services/api';

export default function ListPgPage() {
  const navigate = useNavigate();
  const user = getCurrentUser();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Unisex');
  const [city, setCity] = useState('Bangalore');
  const [locality, setLocality] = useState('');
  const [address, setAddress] = useState('');
  const [landmarkDistance, setLandmarkDistance] = useState('');
  const [startingPrice, setStartingPrice] = useState('');
  const [totalBeds, setTotalBeds] = useState('12');
  const [description, setDescription] = useState('');
  const [amenities, setAmenities] = useState([
    'High-Speed Wi-Fi',
    '3 Meals Daily Buffet',
    'Split AC',
    '100% Power Backup',
    'Biometric Access',
    'Daily Housekeeping'
  ]);
  const [houseRules, setHouseRules] = useState([
    'No Curfew',
    'Visitors Allowed till 10 PM',
    'Zero Brokerage'
  ]);

  const [loading, setLoading] = useState(false);
  const [submittedPropertyId, setSubmittedPropertyId] = useState(null);
  const [error, setError] = useState('');

  const availableAmenities = [
    'High-Speed Wi-Fi',
    '3 Meals Daily Buffet',
    'Split AC',
    '100% Power Backup',
    'Biometric Access',
    'Daily Housekeeping',
    'Washing Machine',
    'Gym Access',
    'Silent Study Hall',
    'RO Filtered Water'
  ];

  const toggleAmenity = (item) => {
    if (amenities.includes(item)) {
      setAmenities(amenities.filter(a => a !== item));
    } else {
      setAmenities([...amenities, item]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // If user not logged in or not owner, guide them to log in or use demo owner
    if (!user) {
      // Auto register or login as demo owner for smooth testing
      try {
        await api.login('rohit.sharma@rentease.in', 'User@123');
      } catch (e) {
        // Continue
      }
    }

    setLoading(true);

    try {
      const payload = {
        title,
        category,
        city,
        locality,
        address,
        landmark_distance: landmarkDistance,
        price_starting: parseFloat(startingPrice),
        total_beds: parseInt(totalBeds, 10),
        description,
        amenities,
        house_rules: houseRules,
        images: [
          'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1000&q=80',
          'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1000&q=80',
          'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1000&q=80'
        ],
        room_types: [
          { type: 'Private Single Room', price: parseFloat(startingPrice) * 1.5, beds_total: 4, beds_available: 4 },
          { type: 'Twin Sharing Room', price: parseFloat(startingPrice), beds_total: parseInt(totalBeds, 10) - 4, beds_available: parseInt(totalBeds, 10) - 4 }
        ]
      };

      const res = await api.submitOwnerProperty(payload);
      setSubmittedPropertyId(res.propertyId || 99);
    } catch (err) {
      setError(err.message || 'Failed to submit PG property.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-body text-slate-800 pb-20 md:pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 border border-emerald-500/30 flex items-center justify-center font-black">
            <PlusCircle size={26} className="text-[#10B981]" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black font-heading text-slate-900 tracking-tight">
              List Your PG with Zero Brokerage
            </h1>
            <p className="text-xs text-slate-500">
              Reach thousands of students &amp; professionals across Bangalore, Prayagraj, Delhi NCR, and Banda
            </p>
          </div>
        </div>

        {/* Success Card after Submission */}
        {submittedPropertyId ? (
          <div className="bg-white rounded-3xl p-8 border border-emerald-300 shadow-xl text-center max-w-xl mx-auto space-y-4 animate-fade-in">
            <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 size={36} />
            </div>

            <h2 className="text-2xl font-black font-heading text-slate-900">
              Submission Sent to RentEase PRO Admin!
            </h2>

            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-950 text-left space-y-2">
              <div className="flex items-center gap-2 font-bold">
                <Sparkles size={16} className="text-emerald-600" />
                <span>Next Step in End-to-End Workflow:</span>
              </div>
              <p>
                1. Your property is now in the <strong>Admin Control Panel's "Pending Approval"</strong> queue.
              </p>
              <p>
                2. Once the Super Admin reviews the photos and clicks <strong>"Approve &amp; Publish Live"</strong>, your listing becomes immediately visible on the home page!
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-4">
              <button
                onClick={() => {
                  setSubmittedPropertyId(null);
                  setTitle('');
                  setLocality('');
                  setAddress('');
                  setStartingPrice('');
                }}
                className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold"
              >
                + Submit Another PG
              </button>
              <Link
                to="/"
                className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs"
              >
                Back to Home Explore
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            
            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-semibold">
                {error}
              </div>
            )}

            {/* Step 1: Basic Info */}
            <div className="space-y-4">
              <h3 className="font-heading font-black text-sm text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-100 flex items-center gap-2">
                <span>1. Property Overview</span>
              </h3>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Property / PG Name *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Blossom Luxury Co-Living &amp; Student Residence"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Category *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-semibold focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Unisex">Unisex / Co-Living</option>
                    <option value="Boys">Boys PG</option>
                    <option value="Girls">Girls Exclusive</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Target City *</label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-semibold focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Bangalore">Bangalore</option>
                    <option value="Prayagraj">Prayagraj</option>
                    <option value="Delhi NCR">Delhi NCR</option>
                    <option value="Banda">Banda</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Locality / Sector *</label>
                  <input
                    type="text"
                    required
                    value={locality}
                    onChange={(e) => setLocality(e.target.value)}
                    placeholder="e.g. Near UIT Campus, Jhalwa"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Full Physical Address *</label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Street name, plot number, landmark pin..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Proximity Landmark Tag (Crucial for students!)
                </label>
                <input
                  type="text"
                  value={landmarkDistance}
                  onChange={(e) => setLandmarkDistance(e.target.value)}
                  placeholder="e.g. 250m from UIT Main Gate or 400m from Sony World Signal"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Step 2: Pricing & Bed Inventory */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <h3 className="font-heading font-black text-sm text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-100">
                2. Pricing &amp; Bed Capacity
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Starting Monthly Rent (₹ INR) *
                  </label>
                  <input
                    type="number"
                    required
                    min={2000}
                    value={startingPrice}
                    onChange={(e) => setStartingPrice(e.target.value)}
                    placeholder="e.g. 7500"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-bold tabular-nums focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Total Bed Inventory Available
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={totalBeds}
                    onChange={(e) => setTotalBeds(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-bold tabular-nums focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Property Highlights &amp; Description
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe food hygiene, cleanliness, silent study areas, warden security, etc."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Step 3: Amenities Select */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <h3 className="font-heading font-black text-sm text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-100">
                3. Amenities Included
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {availableAmenities.map((item) => {
                  const isChecked = amenities.includes(item);
                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => toggleAmenity(item)}
                      className={`p-3 rounded-xl border text-xs font-bold text-left flex items-center justify-between transition-all cursor-pointer ${
                        isChecked ? 'border-emerald-500 bg-emerald-50 text-emerald-900' : 'border-slate-200 bg-slate-50 text-slate-600'
                      }`}
                    >
                      <span>{item}</span>
                      {isChecked && <CheckCircle2 size={14} className="text-emerald-600" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
              <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
                <Info size={14} className="text-emerald-600" />
                <span>Zero Brokerage: No commission charged on your property.</span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="py-3 px-6 rounded-2xl bg-[#10B981] hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center gap-2 shadow-md transition-all cursor-pointer font-heading"
              >
                {loading ? 'Submitting to Queue...' : 'Submit PG for Audit'}
                <ArrowRight size={14} />
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
}
