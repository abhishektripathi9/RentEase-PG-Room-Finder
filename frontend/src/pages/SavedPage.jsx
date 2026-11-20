import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Building2, MapPin, Star, ArrowRight, Trash2 } from 'lucide-react';
import { api } from '../services/api';

export default function SavedPage() {
  const navigate = useNavigate();
  const [savedProperties, setSavedProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadSaved = async () => {
    try {
      setLoading(true);
      const data = await api.getWishlist();
      setSavedProperties(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSaved();
  }, []);

  const handleRemove = async (id, e) => {
    e.stopPropagation();
    await api.toggleWishlist(id);
    loadSaved();
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-body text-slate-800 pb-20 md:pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-500 border border-rose-200 flex items-center justify-center">
            <Heart size={20} className="fill-rose-500" />
          </div>
          <div>
            <h1 className="text-2xl font-black font-heading text-slate-900 tracking-tight">
              Saved PGs &amp; Residences
            </h1>
            <p className="text-xs text-slate-500">
              Your bookmarked spaces across Bangalore, Prayagraj, Delhi NCR, and Banda
            </p>
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center text-slate-400">
            <div className="w-8 h-8 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <p className="text-xs font-semibold">Loading saved properties...</p>
          </div>
        ) : savedProperties.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-md mx-auto">
            <Heart size={44} className="mx-auto text-slate-300 mb-3" />
            <h3 className="font-heading font-bold text-base text-slate-800">No saved PGs yet</h3>
            <p className="text-xs text-slate-500 mt-1 mb-5">
              Click the heart icon on any PG card to bookmark it for quick access later.
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs"
            >
              <span>Explore PGs</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedProperties.map((prop) => {
              const firstImage = prop.images && prop.images[0]
                ? prop.images[0]
                : 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80';

              return (
                <div
                  key={prop.id}
                  onClick={() => navigate(`/pg/${prop.id}`)}
                  className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col group cursor-pointer"
                >
                  <div className="relative h-48 bg-slate-900">
                    <img src={firstImage} alt={prop.title} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={(e) => handleRemove(prop.id, e)}
                      className="absolute top-3 right-3 p-2 rounded-full bg-white text-rose-500 shadow-md hover:scale-110 transition-transform"
                      title="Remove from saved"
                    >
                      <Trash2 size={15} />
                    </button>
                    <div className="absolute bottom-3 left-3 bg-slate-900/80 text-white px-2.5 py-1 rounded-full text-[10px] font-bold">
                      {prop.category} PG
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-heading font-extrabold text-sm text-slate-900 line-clamp-1 mb-1">
                        {prop.title}
                      </h3>
                      <div className="flex items-center gap-1 text-xs text-slate-500 mb-3">
                        <MapPin size={12} className="text-emerald-600" />
                        <span>{prop.locality}, {prop.city}</span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-base font-black font-heading text-slate-900 tabular-nums">
                        ₹{prop.price_starting.toLocaleString()} <span className="text-xs text-slate-400 font-normal">/mo</span>
                      </span>
                      <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                        <span>Book Room</span>
                        <ArrowRight size={13} />
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}
