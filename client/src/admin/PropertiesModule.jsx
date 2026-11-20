import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Building2,
  CheckCircle2,
  XCircle,
  Clock,
  MapPin,
  ShieldCheck,
  Edit3,
  Trash2,
  ExternalLink,
  Search,
  Filter,
  AlertCircle,
  Eye,
  Check,
  X,
  BedDouble,
  DollarSign
} from 'lucide-react';
import { api } from '../services/api';

export default function PropertiesModule() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(searchParams.get('status') || 'pending'); // 'pending', 'approved', 'rejected', 'all'
  const [selectedCity, setSelectedCity] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modals
  const [reviewProperty, setReviewProperty] = useState(null);
  const [rejectModalProperty, setRejectModalProperty] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [editProperty, setEditProperty] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [deletePropertyId, setDeletePropertyId] = useState(null);
  const [toast, setToast] = useState('');

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 4000);
  };

  const loadProperties = async () => {
    try {
      setLoading(true);
      const data = await api.getAdminProperties(activeTab, selectedCity);
      setProperties(data || []);
    } catch (err) {
      console.error('Failed to load admin properties:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProperties();
  }, [activeTab, selectedCity]);

  // Approve & Publish Live
  const handleApprove = async (id, title) => {
    try {
      await api.verifyAdminProperty(id, 'approved');
      showToast(`✅ "${title}" verified & published LIVE on public website!`);
      if (reviewProperty?.id === id) setReviewProperty(null);
      loadProperties();
    } catch (err) {
      alert(err.message || 'Approval failed');
    }
  };

  // Reject Submission
  const handleReject = async () => {
    if (!rejectModalProperty) return;
    try {
      await api.verifyAdminProperty(rejectModalProperty.id, 'rejected', rejectionReason || 'Information incomplete.');
      showToast(`Property "${rejectModalProperty.title}" moved to Rejected queue.`);
      setRejectModalProperty(null);
      setRejectionReason('');
      if (reviewProperty?.id === rejectModalProperty.id) setReviewProperty(null);
      loadProperties();
    } catch (err) {
      alert(err.message || 'Rejection failed');
    }
  };

  // Edit Save
  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editProperty) return;
    try {
      await api.editAdminProperty(editProperty.id, editFormData);
      showToast('Property details updated successfully.');
      setEditProperty(null);
      loadProperties();
    } catch (err) {
      alert(err.message || 'Update failed');
    }
  };

  // Delete
  const handleDelete = async () => {
    if (!deletePropertyId) return;
    try {
      await api.deleteAdminProperty(deletePropertyId);
      showToast('Property permanently removed from catalog.');
      setDeletePropertyId(null);
      loadProperties();
    } catch (err) {
      alert(err.message || 'Delete failed');
    }
  };

  const filteredProperties = properties.filter(p => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      p.title?.toLowerCase().includes(q) ||
      p.locality?.toLowerCase().includes(q) ||
      p.owner_name?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      
      {/* Toast Alert */}
      {toast && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 px-4 py-3 rounded-xl flex items-center gap-2 text-sm font-semibold shadow-sm animate-fade-in">
          <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      {/* Header & Controls Bar */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-xs">
        
        {/* Tabs Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4 mb-4">
          <div className="flex items-center gap-2">
            {[
              { id: 'pending', label: 'Pending Approval', icon: Clock, count: properties.filter(p => p.verification_status === 'pending').length },
              { id: 'approved', label: 'Verified & Live', icon: CheckCircle2 },
              { id: 'rejected', label: 'Rejected', icon: XCircle },
              { id: 'all', label: 'All Catalog', icon: Building2 }
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setSearchParams({ status: tab.id });
                  }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Icon size={14} className={isActive ? 'text-emerald-400' : 'text-slate-400'} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* City Filter & Search */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:border-emerald-500"
            >
              <option value="all">All Cities</option>
              <option value="Bangalore">Bangalore</option>
              <option value="Prayagraj">Prayagraj</option>
              <option value="Delhi NCR">Delhi NCR</option>
              <option value="Banda">Banda</option>
            </select>

            <div className="relative flex-1 sm:w-64">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search PG, locality, owner..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

        </div>

        {/* Listings Count Bar */}
        <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
          <span>Showing <strong className="text-slate-900 tabular-nums">{filteredProperties.length}</strong> PG listings</span>
          <span className="text-[11px] bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-full border border-slate-200">
            Real-time MySQL Sync
          </span>
        </div>

      </div>

      {/* Properties Grid */}
      {loading ? (
        <div className="p-12 text-center text-slate-400 bg-white rounded-2xl border border-slate-200">
          <div className="inline-block w-8 h-8 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin mb-3" />
          <p className="text-sm font-semibold">Loading catalog from database...</p>
        </div>
      ) : filteredProperties.length === 0 ? (
        <div className="p-12 text-center text-slate-400 bg-white rounded-2xl border border-slate-200">
          <Building2 size={36} className="mx-auto text-slate-300 mb-2" />
          <h3 className="text-sm font-bold text-slate-700">No properties found</h3>
          <p className="text-xs text-slate-500 mt-1">Try switching tabs or resetting the search filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map((prop) => {
            const firstImage = prop.images && prop.images[0]
              ? prop.images[0]
              : 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80';

            return (
              <div key={prop.id} className="bg-white border border-[#E2E8F0] rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col">
                
                {/* Photo & Badges */}
                <div className="relative h-48 bg-slate-900 overflow-hidden group">
                  <img
                    src={firstImage}
                    alt={prop.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/30 pointer-events-none" />

                  {/* Status Badges */}
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-900/90 text-white backdrop-blur-xs border border-white/20">
                      {prop.category} PG
                    </span>
                    {prop.verification_status === 'approved' && (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500 text-slate-950 flex items-center gap-1 shadow-xs">
                        <CheckCircle2 size={12} /> Live on Web
                      </span>
                    )}
                    {prop.verification_status === 'pending' && (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500 text-slate-950 flex items-center gap-1 shadow-xs animate-pulse">
                        <Clock size={12} /> Pending Audit
                      </span>
                    )}
                    {prop.verification_status === 'rejected' && (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-500 text-white flex items-center gap-1 shadow-xs">
                        <XCircle size={12} /> Rejected
                      </span>
                    )}
                  </div>

                  {/* Price Tag */}
                  <div className="absolute bottom-3 left-3 text-white">
                    <div className="text-xs text-slate-300 font-medium">Starting from</div>
                    <div className="text-lg font-black font-heading tabular-nums text-white">
                      ₹{prop.price_starting} <span className="text-xs font-normal text-slate-300">/month</span>
                    </div>
                  </div>

                  {/* Vacant Beds */}
                  <div className="absolute bottom-3 right-3 bg-slate-900/80 backdrop-blur-xs text-white px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 border border-white/10">
                    <BedDouble size={13} className="text-emerald-400" />
                    <span>{prop.available_beds}/{prop.total_beds} Vacant</span>
                  </div>
                </div>

                {/* Content Details */}
                <div className="p-5 flex-1 flex flex-col">
                  
                  <h3 className="font-heading font-extrabold text-sm text-slate-900 line-clamp-1 mb-1">
                    {prop.title}
                  </h3>

                  <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-2">
                    <MapPin size={13} className="text-emerald-600 shrink-0" />
                    <span className="truncate">{prop.locality}, {prop.city}</span>
                  </div>

                  {prop.landmark_distance && (
                    <div className="text-[11px] text-emerald-800 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-lg font-medium mb-3">
                      📍 {prop.landmark_distance}
                    </div>
                  )}

                  {/* Owner KYC Banner */}
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 mb-4 text-xs">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-slate-500 font-medium">Host / Owner:</span>
                      {prop.is_verified_host ? (
                        <span className="text-emerald-600 font-bold flex items-center gap-1 text-[11px]">
                          <ShieldCheck size={12} /> Verified KYC Host
                        </span>
                      ) : (
                        <span className="text-amber-600 font-medium text-[11px]">KYC Incomplete</span>
                      )}
                    </div>
                    <div className="font-bold text-slate-800 truncate">{prop.owner_name}</div>
                    <div className="text-[11px] text-slate-500 font-mono">{prop.owner_phone || prop.owner_email}</div>
                  </div>

                  {/* Amenities Pills */}
                  {prop.amenities && prop.amenities.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {prop.amenities.slice(0, 3).map((a, i) => (
                        <span key={i} className="text-[10px] font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">
                          {a}
                        </span>
                      ))}
                      {prop.amenities.length > 3 && (
                        <span className="text-[10px] font-bold text-slate-400 self-center">
                          +{prop.amenities.length - 3} more
                        </span>
                      )}
                    </div>
                  )}

                  {/* Actions Bar */}
                  <div className="mt-auto pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() => setReviewProperty(prop)}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Eye size={13} />
                      <span>Inspect</span>
                    </button>

                    <div className="flex items-center gap-1.5">
                      {prop.verification_status !== 'approved' && (
                        <button
                          onClick={() => handleApprove(prop.id, prop.title)}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1 shadow-xs cursor-pointer"
                        >
                          <Check size={13} />
                          <span>Approve Live</span>
                        </button>
                      )}

                      {prop.verification_status !== 'rejected' && (
                        <button
                          onClick={() => setRejectModalProperty(prop)}
                          className="px-2.5 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold cursor-pointer"
                          title="Reject Submission"
                        >
                          <X size={13} />
                        </button>
                      )}

                      <button
                        onClick={() => {
                          setEditProperty(prop);
                          setEditFormData({
                            title: prop.title,
                            city: prop.city,
                            locality: prop.locality,
                            address: prop.address,
                            landmark_distance: prop.landmark_distance || '',
                            price_starting: prop.price_starting,
                            available_beds: prop.available_beds,
                            total_beds: prop.total_beds
                          });
                        }}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 cursor-pointer"
                        title="Edit Details"
                      >
                        <Edit3 size={14} />
                      </button>

                      <button
                        onClick={() => setDeletePropertyId(prop.id)}
                        className="p-1.5 rounded-lg text-rose-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer"
                        title="Delete Property"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Review Modal */}
      {reviewProperty && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
              <div className="flex items-center gap-2">
                <Building2 size={20} className="text-emerald-600" />
                <h3 className="font-heading font-extrabold text-base text-slate-900">
                  Audit PG Submission: {reviewProperty.title}
                </h3>
              </div>
              <button onClick={() => setReviewProperty(null)} className="text-slate-400 hover:text-slate-700">
                <X size={20} />
              </button>
            </div>

            {/* Images Gallery */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              {reviewProperty.images && reviewProperty.images.map((img, i) => (
                <img key={i} src={img} alt="room" className="h-40 w-full object-cover rounded-xl border border-slate-200" />
              ))}
            </div>

            <div className="space-y-3 text-xs text-slate-700 mb-6">
              <p><strong>Address:</strong> {reviewProperty.address}</p>
              <p><strong>Landmark Distance:</strong> {reviewProperty.landmark_distance || 'N/A'}</p>
              <p><strong>Starting Rent:</strong> ₹{reviewProperty.price_starting} / month</p>
              <p><strong>Bed Inventory:</strong> {reviewProperty.available_beds} vacant out of {reviewProperty.total_beds} total beds</p>
              <p><strong>Description:</strong> {reviewProperty.description}</p>
              
              <div>
                <strong>Room Sharing Breakdown:</strong>
                <div className="grid grid-cols-2 gap-2 mt-1.5">
                  {reviewProperty.room_types && reviewProperty.room_types.map((rt, i) => (
                    <div key={i} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                      <div className="font-bold text-slate-900">{rt.type}</div>
                      <div className="text-emerald-600 font-bold tabular-nums">₹{rt.price}/mo</div>
                      <div className="text-slate-500 text-[10px]">{rt.beds_available}/{rt.beds_total} Beds Vacant</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
              <button
                onClick={() => setReviewProperty(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
              >
                Close
              </button>
              {reviewProperty.verification_status !== 'approved' && (
                <button
                  onClick={() => handleApprove(reviewProperty.id, reviewProperty.title)}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5"
                >
                  <Check size={14} />
                  <span>Approve &amp; Publish Live</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Rejection Modal */}
      {rejectModalProperty && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="font-heading font-extrabold text-base text-slate-900 mb-2">
              Reject PG Submission
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Specify the reason for rejection so the owner can correct their listing.
            </p>
            <textarea
              rows={3}
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="e.g. Room photos unclear, pricing exceeds locality cap, or incorrect landmark distance."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:border-rose-500 mb-4"
            />
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setRejectModalProperty(null)}
                className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editProperty && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={handleSaveEdit} className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="font-heading font-extrabold text-base text-slate-900">
              Edit Property Details
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Title</label>
              <input
                type="text"
                required
                value={editFormData.title}
                onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">City</label>
                <input
                  type="text"
                  required
                  value={editFormData.city}
                  onChange={(e) => setEditFormData({ ...editFormData, city: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Locality</label>
                <input
                  type="text"
                  required
                  value={editFormData.locality}
                  onChange={(e) => setEditFormData({ ...editFormData, locality: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Landmark Proximity</label>
              <input
                type="text"
                value={editFormData.landmark_distance}
                onChange={(e) => setEditFormData({ ...editFormData, landmark_distance: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Starting Rent (₹)</label>
                <input
                  type="number"
                  required
                  value={editFormData.price_starting}
                  onChange={(e) => setEditFormData({ ...editFormData, price_starting: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Vacant Beds</label>
                <input
                  type="number"
                  required
                  value={editFormData.available_beds}
                  onChange={(e) => setEditFormData({ ...editFormData, available_beds: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Total Beds</label>
                <input
                  type="number"
                  required
                  value={editFormData.total_beds}
                  onChange={(e) => setEditFormData({ ...editFormData, total_beds: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setEditProperty(null)}
                className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletePropertyId && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 text-center">
            <Trash2 size={32} className="mx-auto text-rose-500 mb-3" />
            <h3 className="font-heading font-extrabold text-base text-slate-900 mb-1">
              Delete Property?
            </h3>
            <p className="text-xs text-slate-500 mb-5">
              This will permanently delete this PG listing and any associated bed reservations from MySQL.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setDeletePropertyId(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
