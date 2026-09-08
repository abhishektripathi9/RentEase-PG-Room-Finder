import React, { useState } from 'react';
import { X, ArrowRight, ArrowLeft, Check, Building2, Plus, Trash2 } from 'lucide-react';
import { CITIES, AMENITIES_LIST } from '../services/mockData';

export default function AddPropertyModal({
  onClose,
  onPropertyAdded
}) {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Step 1: Basic Info
  const [name, setName] = useState('');
  const [pgType, setPgType] = useState('UNISEX');
  const [city, setCity] = useState('Bangalore');
  const [locality, setLocality] = useState('');
  const [address, setAddress] = useState('');
  const [nearbyLandmark, setNearbyLandmark] = useState('');
  const [distanceToLandmark, setDistanceToLandmark] = useState('');
  const [description, setDescription] = useState('');

  // Step 2: Rooms & Pricing
  const [startingPrice, setStartingPrice] = useState(9000);
  const [depositAmount, setDepositAmount] = useState(12000);
  const [roomTypes, setRoomTypes] = useState([
    { id: 1, roomCategory: 'SINGLE', title: 'Private Executive Single Room', pricePerMonth: 16000, depositAmount: 18000, totalBeds: 1, availableBeds: 1, hasAttachedWashroom: true, hasAc: true },
    { id: 2, roomCategory: 'DOUBLE', title: 'Twin Sharing Room', pricePerMonth: 9000, depositAmount: 12000, totalBeds: 2, availableBeds: 2, hasAttachedWashroom: true, hasAc: true }
  ]);

  // Step 3: Amenities & Meals
  const [selectedAmenities, setSelectedAmenities] = useState([
    'High-Speed Wi-Fi', '3 Meals Included', 'Air Conditioner', 'Power Backup', 'Attached Bathroom', 'Daily Housekeeping'
  ]);
  const [foodIncluded, setFoodIncluded] = useState(true);
  const [foodType, setFoodType] = useState('VEG_NONVEG');

  // Step 4: House Rules & Photos
  const [gateClosingTime, setGateClosingTime] = useState('No Curfew');
  const [visitorsAllowed, setVisitorsAllowed] = useState(true);
  const [nonVegAllowed, setNonVegAllowed] = useState(true);
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1200&q=80');

  const toggleAmenity = (item) => {
    setSelectedAmenities(prev =>
      prev.includes(item) ? prev.filter(a => a !== item) : [...prev, item]
    );
  };

  const handleAddRoomType = () => {
    setRoomTypes(prev => [
      ...prev,
      {
        id: Date.now(),
        roomCategory: 'TRIPLE',
        title: 'Triple Sharing Economy Room',
        pricePerMonth: 7500,
        depositAmount: 10000,
        totalBeds: 3,
        availableBeds: 3,
        hasAttachedWashroom: true,
        hasAc: false
      }
    ]);
  };

  const handleRemoveRoomType = (id) => {
    if (roomTypes.length <= 1) return;
    setRoomTypes(prev => prev.filter(r => r.id !== id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const propertyPayload = {
      name,
      description: description || `Modern verified ${pgType.toLowerCase()} accommodation in ${locality}, ${city}. Includes high-speed internet, daily cleaning, and premium amenities.`,
      pgType,
      city,
      locality,
      address,
      latitude: 12.9345, // default pin coords in city
      longitude: 77.6265,
      startingPrice: Number(startingPrice),
      depositAmount: Number(depositAmount),
      noticePeriodDays: 30,
      verified: true,
      rating: 4.9,
      reviewCount: 1,
      foodIncluded,
      foodType,
      gateClosingTime,
      visitorsAllowed,
      nonVegAllowed,
      nearbyLandmark,
      distanceToLandmark,
      images: [imageUrl],
      amenities: selectedAmenities,
      roomTypes,
      ownerId: 1,
      ownerName: 'Vikram Malhotra',
      ownerPhone: '+91 98450 12345',
      status: 'ACTIVE'
    };

    await onPropertyAdded(propertyPayload);
    setIsSubmitting(false);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-container p-6 max-w-2xl border border-white/20"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-[#00D2FF]" />
            <h2 className="text-lg font-black text-white font-['Outfit']">
              List New PG / Rental Space
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step Wizard Header */}
        <div className="flex items-center justify-between mb-6 px-1">
          {[
            { num: 1, label: 'Basic Info' },
            { num: 2, label: 'Rooms & Rents' },
            { num: 3, label: 'Amenities' },
            { num: 4, label: 'Rules & Photos' }
          ].map((s) => (
            <div key={s.num} className="flex items-center gap-1.5">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  step === s.num
                    ? 'bg-[#00D2FF] text-slate-950 shadow-[0_0_10px_#00D2FF]'
                    : step > s.num
                    ? 'bg-emerald-500 text-slate-950'
                    : 'bg-slate-800 text-slate-500'
                }`}
              >
                {step > s.num ? '✓' : s.num}
              </div>
              <span className={`text-xs font-medium hidden sm:inline ${step === s.num ? 'text-white' : 'text-slate-500'}`}>
                {s.label}
              </span>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* STEP 1: Basic Info */}
          {step === 1 && (
            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold uppercase text-slate-400 block mb-1">
                  Property / PG Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Amber Nest Luxury Co-living"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#00D2FF]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold uppercase text-slate-400 block mb-1">PG Type</label>
                  <select
                    value={pgType}
                    onChange={(e) => setPgType(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#00D2FF]"
                  >
                    <option value="UNISEX" className="bg-slate-900">Unisex / Co-living</option>
                    <option value="GIRLS" className="bg-slate-900">Girls Only</option>
                    <option value="BOYS" className="bg-slate-900">Boys Only</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase text-slate-400 block mb-1">City</label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#00D2FF]"
                  >
                    {CITIES.filter(c => c !== 'All Cities').map(c => (
                      <option key={c} value={c} className="bg-slate-900">{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold uppercase text-slate-400 block mb-1">Locality</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Koramangala 5th Block"
                    value={locality}
                    onChange={(e) => setLocality(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#00D2FF]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase text-slate-400 block mb-1">Nearest Landmark</label>
                  <input
                    type="text"
                    placeholder="e.g. Near Sony Signal"
                    value={nearbyLandmark}
                    onChange={(e) => setNearbyLandmark(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#00D2FF]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-slate-400 block mb-1">Distance to Landmark</label>
                <input
                  type="text"
                  placeholder="e.g. 300m to Metro Station"
                  value={distanceToLandmark}
                  onChange={(e) => setDistanceToLandmark(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#00D2FF]"
                />
              </div>

              <div className="pt-3 flex justify-end">
                <button
                  type="button"
                  disabled={!name || !locality}
                  onClick={() => setStep(2)}
                  className="btn-cyber py-2 px-5 text-xs font-bold flex items-center gap-1.5"
                >
                  <span>Next: Rooms & Rents</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Rooms & Pricing */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold uppercase text-slate-400 block mb-1">Starting Monthly Rent (₹)</label>
                  <input
                    type="number"
                    value={startingPrice}
                    onChange={(e) => setStartingPrice(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#00D2FF]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase text-slate-400 block mb-1">Standard Security Deposit (₹)</label>
                  <input
                    type="number"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#00D2FF]"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase text-slate-400">Configured Room Categories</span>
                  <button
                    type="button"
                    onClick={handleAddRoomType}
                    className="text-xs text-[#00D2FF] font-semibold flex items-center gap-1 hover:underline"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ Add Room Type</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {roomTypes.map((r, i) => (
                    <div key={r.id} className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 flex items-center justify-between">
                      <div>
                        <div className="text-xs font-bold text-white">{r.title}</div>
                        <div className="text-[11px] text-slate-400">
                          ₹{r.pricePerMonth}/mo • {r.availableBeds} beds available
                        </div>
                      </div>
                      {roomTypes.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveRoomType(r.id)}
                          className="text-slate-500 hover:text-rose-400 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="btn-ghost text-xs flex items-center gap-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="btn-cyber py-2 px-5 text-xs font-bold flex items-center gap-1.5"
                >
                  <span>Next: Amenities</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Amenities */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase text-slate-400 block mb-2">
                  Select Included Amenities
                </label>
                <div className="flex flex-wrap gap-2">
                  {AMENITIES_LIST.map((item) => {
                    const isSelected = selectedAmenities.includes(item);
                    return (
                      <button
                        key={item}
                        type="button"
                        onClick={() => toggleAmenity(item)}
                        className={`text-xs py-1.5 px-3 rounded-full border transition-all flex items-center gap-1.5 ${
                          isSelected
                            ? 'bg-[#00D2FF]/20 border-[#00D2FF] text-[#00D2FF] font-bold'
                            : 'bg-slate-900 border-slate-800 text-slate-400'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                        <span>{item}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl flex items-center justify-between">
                  <span className="text-xs font-semibold text-white">Daily Meals Included</span>
                  <input
                    type="checkbox"
                    checked={foodIncluded}
                    onChange={(e) => setFoodIncluded(e.target.checked)}
                    className="accent-[#00D2FF] w-4 h-4"
                  />
                </div>

                <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl flex items-center justify-between">
                  <span className="text-xs font-semibold text-white">Meal Preference</span>
                  <select
                    value={foodType}
                    onChange={(e) => setFoodType(e.target.value)}
                    className="bg-transparent text-xs text-cyan-300 font-bold focus:outline-none"
                  >
                    <option value="VEG_NONVEG" className="bg-slate-900 text-white">Veg & Non-Veg</option>
                    <option value="VEG" className="bg-slate-900 text-white">Pure Veg</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="btn-ghost text-xs flex items-center gap-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(4)}
                  className="btn-cyber py-2 px-5 text-xs font-bold flex items-center gap-1.5"
                >
                  <span>Next: Rules & Photos</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Rules & Photos */}
          {step === 4 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold uppercase text-slate-400 block mb-1">Gate Closing Time</label>
                  <select
                    value={gateClosingTime}
                    onChange={(e) => setGateClosingTime(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#00D2FF]"
                  >
                    <option value="No Curfew" className="bg-slate-900">No Curfew (24x7 Entry)</option>
                    <option value="11:00 PM" className="bg-slate-900">11:00 PM</option>
                    <option value="10:30 PM" className="bg-slate-900">10:30 PM</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase text-slate-400 block mb-1">Visitors Policy</label>
                  <select
                    value={visitorsAllowed ? 'YES' : 'NO'}
                    onChange={(e) => setVisitorsAllowed(e.target.value === 'YES')}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#00D2FF]"
                  >
                    <option value="YES" className="bg-slate-900">Allowed in Common Lounge</option>
                    <option value="NO" className="bg-slate-900">Not Allowed</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-slate-400 block mb-1">
                  Property Cover Image URL
                </label>
                <input
                  type="url"
                  required
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#00D2FF]"
                />
              </div>

              <div className="pt-3 flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="btn-ghost text-xs flex items-center gap-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-cyber py-2.5 px-6 rounded-xl text-xs font-bold flex items-center gap-2"
                >
                  <span>{isSubmitting ? 'Publishing...' : 'Publish PG Listing'}</span>
                  <Check className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

        </form>

      </div>
    </div>
  );
}
