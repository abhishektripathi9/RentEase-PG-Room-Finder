import React from 'react';
import { X, Check, Minus, Trash2, ArrowRight } from 'lucide-react';

export default function CompareModal({
  comparedProperties,
  onClose,
  onRemoveFromCompare,
  onBookNow
}) {
  if (!comparedProperties || comparedProperties.length === 0) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-container p-6 max-w-4xl border border-[#00D2FF]/40"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
          <div className="flex items-center gap-2">
            <span className="tech-pill text-xs">Side-by-Side Evaluation</span>
            <h2 className="text-base font-bold text-white font-['Outfit']">
              Comparing {comparedProperties.length} Properties
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Comparison Grid Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10">
                <th className="p-3 text-xs font-bold text-slate-400 uppercase tracking-wider w-40">
                  Feature / Spec
                </th>
                {comparedProperties.map((p) => (
                  <th key={p.id} className="p-3 min-w-[200px] align-top">
                    <div className="relative group">
                      <img
                        src={p.images?.[0]}
                        alt={p.name}
                        className="w-full h-28 object-cover rounded-xl mb-2"
                      />
                      <button
                        onClick={() => onRemoveFromCompare(p.id)}
                        className="absolute top-2 right-2 bg-black/70 hover:bg-rose-600 text-white p-1 rounded-full transition-colors"
                        title="Remove from comparison"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="text-sm font-bold text-white font-['Outfit'] line-clamp-1">{p.name}</div>
                    <div className="text-xs text-[#00D2FF] font-semibold">{p.locality}, {p.city}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-xs">
              
              {/* Monthly Rent */}
              <tr>
                <td className="p-3 font-bold text-slate-400">Monthly Rent</td>
                {comparedProperties.map(p => (
                  <td key={p.id} className="p-3 text-sm font-black text-white font-['Outfit'] text-[#00D2FF]">
                    ₹{Number(p.startingPrice).toLocaleString('en-IN')}/mo
                  </td>
                ))}
              </tr>

              {/* Security Deposit */}
              <tr>
                <td className="p-3 font-bold text-slate-400">Security Deposit</td>
                {comparedProperties.map(p => (
                  <td key={p.id} className="p-3 text-slate-300 font-semibold">
                    ₹{Number(p.depositAmount || 12000).toLocaleString('en-IN')}
                  </td>
                ))}
              </tr>

              {/* PG Type / Gender */}
              <tr>
                <td className="p-3 font-bold text-slate-400">PG Type</td>
                {comparedProperties.map(p => (
                  <td key={p.id} className="p-3 text-slate-300">
                    {p.pgType}
                  </td>
                ))}
              </tr>

              {/* Food / Meals */}
              <tr>
                <td className="p-3 font-bold text-slate-400">Meals Included</td>
                {comparedProperties.map(p => (
                  <td key={p.id} className="p-3 text-slate-300 font-semibold">
                    {p.foodIncluded ? (
                      <span className="text-emerald-400 flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> 3 Meals Buffet
                      </span>
                    ) : (
                      <span className="text-slate-500">Not included</span>
                    )}
                  </td>
                ))}
              </tr>

              {/* Curfew / Gate Timing */}
              <tr>
                <td className="p-3 font-bold text-slate-400">Gate Curfew</td>
                {comparedProperties.map(p => (
                  <td key={p.id} className="p-3 text-slate-300">
                    {p.gateClosingTime || 'No Curfew'}
                  </td>
                ))}
              </tr>

              {/* Distance to Landmark */}
              <tr>
                <td className="p-3 font-bold text-slate-400">Nearby Landmark</td>
                {comparedProperties.map(p => (
                  <td key={p.id} className="p-3 text-slate-300">
                    {p.distanceToLandmark || `${p.nearbyLandmark || 'Central Area'}`}
                  </td>
                ))}
              </tr>

              {/* Rating */}
              <tr>
                <td className="p-3 font-bold text-slate-400">Tenant Rating</td>
                {comparedProperties.map(p => (
                  <td key={p.id} className="p-3 text-amber-400 font-bold">
                    ★ {p.rating || 4.8} ({p.reviewCount || 24} reviews)
                  </td>
                ))}
              </tr>

              {/* Action Button */}
              <tr>
                <td className="p-3 font-bold text-slate-400">Direct Action</td>
                {comparedProperties.map(p => (
                  <td key={p.id} className="p-3">
                    <button
                      onClick={() => {
                        onClose();
                        onBookNow(p);
                      }}
                      className="btn-cyber text-xs py-1.5 px-4 rounded-xl font-bold w-full"
                    >
                      Book Bed
                    </button>
                  </td>
                ))}
              </tr>

            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}
