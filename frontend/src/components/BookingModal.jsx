import React, { useState } from 'react';
import { X, CheckCircle2, ShieldCheck, CreditCard, QrCode, ArrowRight, ArrowLeft, Download, Calendar, User, FileText } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function BookingModal({
  property,
  initialRoom,
  onClose,
  onBookingConfirmed
}) {
  if (!property) return null;

  const [step, setStep] = useState(1); // 1: Room & Date, 2: KYC Details, 3: Review & Payment, 4: Confirmed
  const [selectedRoomId, setSelectedRoomId] = useState(
    initialRoom ? initialRoom.id : property.roomTypes?.[0]?.id || 1
  );
  const [moveInDate, setMoveInDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toISOString().split('T')[0];
  });
  const [durationMonths, setDurationMonths] = useState(6);

  // Tenant Details
  const [tenantName, setTenantName] = useState('Rahul Verma');
  const [tenantEmail, setTenantEmail] = useState('rahul.v@gmail.com');
  const [tenantPhone, setTenantPhone] = useState('+91 98450 67890');
  const [idType, setIdType] = useState('AADHAR');
  const [idNumber, setIdNumber] = useState('5482-9012-3841');
  const [workplace, setWorkplace] = useState('Infosys Ltd');

  // Payment Simulation
  const [paymentMethod, setPaymentMethod] = useState('UPI'); // UPI, CARD, NETBANKING
  const [isProcessing, setIsProcessing] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  const selectedRoom = property.roomTypes?.find(r => r.id === selectedRoomId) || property.roomTypes?.[0] || {
    roomCategory: 'DOUBLE',
    title: 'Twin Sharing Room',
    pricePerMonth: property.startingPrice || 10000,
    depositAmount: property.depositAmount || 12000
  };

  const monthlyRent = Number(selectedRoom.pricePerMonth);
  const depositAmount = Number(selectedRoom.depositAmount || property.depositAmount || monthlyRent);
  const tokenAmount = 2000; // Token booking reservation fee or full deposit
  const maintenanceFee = 500;
  const totalDueNow = tokenAmount; // Pay token to reserve

  const handleConfirmPayment = async () => {
    setIsProcessing(true);
    // Simulate brief payment gateway latency
    setTimeout(async () => {
      const bookingData = {
        propertyId: property.id,
        propertyName: property.name,
        roomTypeId: selectedRoom.id,
        roomCategory: selectedRoom.roomCategory,
        tenantName,
        tenantEmail,
        tenantPhone,
        idProofType: idType,
        idProofNumber: idNumber,
        moveInDate,
        durationMonths: Number(durationMonths),
        monthlyRent,
        depositPaid: depositAmount,
        totalAmountPaid: tokenAmount,
        paymentMethod,
        paymentId: `PAY_${Date.now()}_${Math.floor(Math.random() * 8999 + 1000)}`
      };

      const result = await onBookingConfirmed(bookingData);
      setConfirmedBooking(result);
      setIsProcessing(false);
      setStep(4);

      // Trigger celebration confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {}
    }, 1200);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-container p-6 max-w-2xl border border-[#00D2FF]/40"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
          <div className="flex items-center gap-2">
            <span className="tech-pill text-xs">Instant Reservation</span>
            <span className="text-xs text-slate-400 font-medium">
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

        {/* Step Indicator (Only for steps 1-3) */}
        {step < 4 && (
          <div className="flex items-center justify-between mb-6 px-2">
            {[
              { num: 1, label: 'Room & Dates' },
              { num: 2, label: 'Tenant KYC' },
              { num: 3, label: 'Pay Token' }
            ].map((s) => (
              <div key={s.num} className="flex items-center gap-2">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    step === s.num
                      ? 'bg-[#00D2FF] text-slate-950 shadow-[0_0_12px_rgba(0,210,255,0.6)]'
                      : step > s.num
                      ? 'bg-emerald-500 text-slate-950'
                      : 'bg-slate-800 text-slate-400 border border-slate-700'
                  }`}
                >
                  {step > s.num ? '✓' : s.num}
                </div>
                <span className={`text-xs font-semibold hidden sm:inline ${step === s.num ? 'text-white' : 'text-slate-500'}`}>
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* STEP 1: Room & Dates */}
        {step === 1 && (
          <div className="space-y-5">
            <div>
              <label className="text-xs font-bold uppercase text-slate-400 tracking-wider block mb-2">
                Select Sharing Bed Category
              </label>
              <div className="space-y-2">
                {property.roomTypes?.map((room) => (
                  <label
                    key={room.id}
                    onClick={() => setSelectedRoomId(room.id)}
                    className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                      selectedRoomId === room.id
                        ? 'bg-cyan-500/15 border-[#00D2FF] text-white shadow-[0_0_15px_rgba(0,210,255,0.2)]'
                        : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="roomSelection"
                        checked={selectedRoomId === room.id}
                        onChange={() => setSelectedRoomId(room.id)}
                        className="accent-[#00D2FF]"
                      />
                      <div>
                        <div className="text-sm font-bold text-white">{room.title}</div>
                        <div className="text-xs text-slate-400">
                          {room.availableBeds} beds available • {room.hasAttachedWashroom ? 'Attached Bathroom' : 'Common Bathroom'}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-base font-black text-[#00D2FF] font-['Outfit']">
                        ₹{Number(room.pricePerMonth).toLocaleString('en-IN')}
                      </div>
                      <div className="text-[10px] text-slate-500">per month</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold uppercase text-slate-400 tracking-wider block mb-1.5">
                  Expected Move-In Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={moveInDate}
                    onChange={(e) => setMoveInDate(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#00D2FF]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-slate-400 tracking-wider block mb-1.5">
                  Initial Stay Duration
                </label>
                <select
                  value={durationMonths}
                  onChange={(e) => setDurationMonths(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#00D2FF] cursor-pointer"
                >
                  <option value={1} className="bg-slate-900">1 Month (Trial)</option>
                  <option value={3} className="bg-slate-900">3 Months</option>
                  <option value={6} className="bg-slate-900">6 Months (Standard)</option>
                  <option value={11} className="bg-slate-900">11 Months (Annual Agreement)</option>
                </select>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                onClick={() => setStep(2)}
                className="btn-cyber py-2.5 px-6 rounded-xl text-xs font-bold flex items-center gap-2"
              >
                <span>Continue to Tenant KYC</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Tenant KYC Details */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold uppercase text-slate-400 tracking-wider block mb-1">
                  Full Name (As per Govt ID)
                </label>
                <input
                  type="text"
                  required
                  value={tenantName}
                  onChange={(e) => setTenantName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#00D2FF]"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-slate-400 tracking-wider block mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={tenantEmail}
                  onChange={(e) => setTenantEmail(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#00D2FF]"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-slate-400 tracking-wider block mb-1">
                  Contact Phone Number
                </label>
                <input
                  type="text"
                  required
                  value={tenantPhone}
                  onChange={(e) => setTenantPhone(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#00D2FF]"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-slate-400 tracking-wider block mb-1">
                  College / Company
                </label>
                <input
                  type="text"
                  value={workplace}
                  onChange={(e) => setWorkplace(e.target.value)}
                  placeholder="e.g. Infosys, Christ Univ"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#00D2FF]"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-slate-400 tracking-wider block mb-1">
                  ID Proof Type
                </label>
                <select
                  value={idType}
                  onChange={(e) => setIdType(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#00D2FF]"
                >
                  <option value="AADHAR" className="bg-slate-900">Aadhar Card</option>
                  <option value="PAN" className="bg-slate-900">PAN Card</option>
                  <option value="PASSPORT" className="bg-slate-900">Passport</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-slate-400 tracking-wider block mb-1">
                  ID Document Number
                </label>
                <input
                  type="text"
                  required
                  value={idNumber}
                  onChange={(e) => setIdNumber(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#00D2FF]"
                />
              </div>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 p-3 rounded-xl flex items-center gap-2.5 text-xs text-slate-400">
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>Your personal info is encrypted and shared solely with the property manager for digital rental agreement generation.</span>
            </div>

            <div className="pt-4 flex justify-between">
              <button
                onClick={() => setStep(1)}
                className="btn-ghost text-xs flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="btn-cyber py-2.5 px-6 rounded-xl text-xs font-bold flex items-center gap-2"
              >
                <span>Review & Pay Token</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Review Bill Breakdown & Simulated Payment */}
        {step === 3 && (
          <div className="space-y-5">
            {/* Transparent Bill Breakdown */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-2.5 text-xs">
              <div className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-1">
                Transparent Rent Breakdown
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Monthly Rent ({selectedRoom.title}):</span>
                <span className="font-semibold text-white">₹{monthlyRent.toLocaleString('en-IN')}/mo</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Security Deposit (Refundable upon checkout):</span>
                <span className="font-semibold text-white">₹{depositAmount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Brokerage Commission:</span>
                <span className="font-bold text-emerald-400">₹0 (100% Free)</span>
              </div>
              <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-sm font-bold text-white">
                <div>
                  <div>Payable Token Amount Today:</div>
                  <div className="text-[10px] text-slate-400 font-normal">Remaining balance payable on move-in day ({moveInDate})</div>
                </div>
                <div className="text-xl font-black text-[#00D2FF] font-['Outfit']">
                  ₹{tokenAmount.toLocaleString('en-IN')}
                </div>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div>
              <label className="text-xs font-bold uppercase text-slate-400 tracking-wider block mb-2">
                Simulated Payment Mode
              </label>
              <div className="grid grid-cols-3 gap-2 mb-3">
                {[
                  { id: 'UPI', label: 'UPI / QR Code', icon: QrCode },
                  { id: 'CARD', label: 'Credit / Debit Card', icon: CreditCard },
                  { id: 'NETBANKING', label: 'Net Banking', icon: FileText }
                ].map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setPaymentMethod(m.id)}
                    className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all ${
                      paymentMethod === m.id
                        ? 'bg-cyan-500/20 border-[#00D2FF] text-[#00D2FF]'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <m.icon className="w-4 h-4" />
                    <span>{m.label}</span>
                  </button>
                ))}
              </div>

              {paymentMethod === 'UPI' && (
                <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 text-center space-y-2">
                  <div className="w-24 h-24 mx-auto bg-white rounded-lg p-1.5 flex items-center justify-center">
                    <QrCode className="w-20 h-20 text-slate-900" />
                  </div>
                  <div className="text-xs font-mono text-[#00D2FF]">rentease.booking@upi</div>
                  <div className="text-[11px] text-slate-400">Scan via GPay, PhonePe, Paytm or Click Confirm</div>
                </div>
              )}
            </div>

            <div className="pt-2 flex justify-between items-center">
              <button
                onClick={() => setStep(2)}
                disabled={isProcessing}
                className="btn-ghost text-xs flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Back
              </button>

              <button
                onClick={handleConfirmPayment}
                disabled={isProcessing}
                className="btn-cyber py-3 px-8 rounded-xl text-sm font-black flex items-center gap-2 shadow-[0_0_25px_rgba(0,210,255,0.6)]"
              >
                {isProcessing ? (
                  <>
                    <span className="w-4 h-4 rounded-full border-2 border-slate-950 border-t-transparent animate-spin" />
                    <span>Securing Reservation...</span>
                  </>
                ) : (
                  <>
                    <span>Pay ₹{tokenAmount.toLocaleString('en-IN')} & Confirm</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: Digital Confirmation Voucher */}
        {step === 4 && confirmedBooking && (
          <div className="space-y-5 text-center py-2">
            <div className="w-14 h-14 mx-auto rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-2xl font-black text-white font-['Outfit']">
                Bed Reserved Successfully!
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Your reservation receipt and move-in confirmation voucher have been generated.
              </p>
            </div>

            {/* Printable Digital Receipt Card */}
            <div className="bg-slate-900/90 border border-cyan-500/40 rounded-2xl p-4 text-left space-y-3 font-mono text-xs shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-[#00D2FF] text-slate-950 text-[10px] font-bold px-3 py-0.5 rounded-bl-lg font-sans">
                CONFIRMED
              </div>

              <div className="border-b border-slate-800 pb-2">
                <div className="text-[10px] text-slate-400 font-sans uppercase">Booking Reference Code</div>
                <div className="text-lg font-black text-[#00D2FF]">{confirmedBooking.bookingCode}</div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] font-sans">
                <div>
                  <span className="text-slate-400">Property:</span>
                  <div className="font-bold text-white">{property.name}</div>
                </div>
                <div>
                  <span className="text-slate-400">Room Category:</span>
                  <div className="font-bold text-white">{confirmedBooking.roomCategory} Sharing</div>
                </div>
                <div>
                  <span className="text-slate-400">Move-in Date:</span>
                  <div className="font-bold text-white">{confirmedBooking.moveInDate}</div>
                </div>
                <div>
                  <span className="text-slate-400">Tenant:</span>
                  <div className="font-bold text-white">{confirmedBooking.tenantName}</div>
                </div>
              </div>

              <div className="border-t border-slate-800 pt-2 flex justify-between items-center text-xs font-sans">
                <span className="text-slate-400">Token Paid Today:</span>
                <span className="font-extrabold text-emerald-400">₹{confirmedBooking.totalAmountPaid?.toLocaleString('en-IN')} (Confirmed)</span>
              </div>
            </div>

            <div className="pt-2 flex justify-center gap-3">
              <button
                onClick={() => window.print()}
                className="btn-outline text-xs py-2 px-4 rounded-xl flex items-center gap-2"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Print Voucher</span>
              </button>
              <button
                onClick={onClose}
                className="btn-cyber text-xs py-2 px-6 rounded-xl font-bold"
              >
                Done
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
