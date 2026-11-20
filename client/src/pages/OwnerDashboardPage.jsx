import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Building2, PlusCircle, Clock, CheckCircle2, XCircle, ArrowRight, BedDouble } from 'lucide-react';
import { api, getCurrentUser } from '../services/api';

export default function OwnerDashboardPage() {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadProperties = async () => {
    try {
      setLoading(true);
      const data = await api.getOwnerProperties();
      setProperties(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProperties();
  }, []);

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-body text-slate-800 pb-20 md:pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-200 flex items-center justify-center font-bold">
              <Building2 size={20} />
            </div>
            <div>
              <h1 className="text-2xl font-black font-heading text-slate-900 tracking-tight">
                PG Owner Control Center
              </h1>
              <p className="text-xs text-slate-500">
                Manage your PG listings, bed inventory, and review approvals
              </p>
            </div>
          </div>

          <Link
            to="/list-pg"
            className="px-4 py-2.5 rounded-xl bg-[#10B981] hover:bg-emerald-400 text-slate-950 font-black text-xs inline-flex items-center gap-2 shadow-sm"
          >
            <PlusCircle size={15} />
            <span>+ List Another PG</span>
          </Link>
        </div>

        {loading ? (
          <div className="p-12 text-center text-slate-400">
            <div className="w-8 h-8 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <p className="text-xs font-semibold">Loading your properties...</p>
          </div>
        ) : properties.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-md mx-auto">
            <Building2 size={44} className="mx-auto text-slate-300 mb-3" />
            <h3 className="font-heading font-bold text-base text-slate-800">No properties listed yet</h3>
            <p className="text-xs text-slate-500 mt-1 mb-5">
              List your PG to get verified and start receiving zero-brokerage student reservations.
            </p>
            <Link
              to="/list-pg"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs"
            >
              <span>Submit PG Listing</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((prop) => (
              <div key={prop.id} className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full">
                    {prop.category} PG
                  </span>
                  {prop.verification_status === 'approved' ? (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                      <CheckCircle2 size={12} /> Live on Web
                    </span>
                  ) : prop.verification_status === 'rejected' ? (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 flex items-center gap-1">
                      <XCircle size={12} /> Rejected
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 flex items-center gap-1">
                      <Clock size={12} /> In Admin Review
                    </span>
                  )}
                </div>

                <h3 className="font-heading font-black text-sm text-slate-900 line-clamp-1">{prop.title}</h3>
                <p className="text-xs text-slate-500">{prop.locality}, {prop.city}</p>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="font-bold text-emerald-600 tabular-nums">₹{prop.price_starting}/mo</span>
                  <span className="text-slate-500">{prop.available_beds}/{prop.total_beds} Vacant Beds</span>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
