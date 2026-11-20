import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { X, MapPin, Building2, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

// Custom neon price badge marker
const createPriceIcon = (price) => {
  const formatted = price >= 1000 ? `₹${(price / 1000).toFixed(1)}k` : `₹${price}`;
  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `<div style="
      background: #071917;
      color: #10B981;
      border: 2px solid #10B981;
      border-radius: 9999px;
      padding: 4px 10px;
      font-weight: 900;
      font-size: 11px;
      box-shadow: 0 4px 14px rgba(16, 185, 129, 0.4);
      white-space: nowrap;
      cursor: pointer;
    ">${formatted}</div>`,
    iconSize: [60, 30],
    iconAnchor: [30, 15]
  });
};

export default function MapModal({ properties, onClose }) {
  const center = properties.length > 0 && properties[0].latitude
    ? [parseFloat(properties[0].latitude), parseFloat(properties[0].longitude)]
    : [12.9345, 77.6265];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 font-body">
      <div className="bg-white rounded-3xl max-w-4xl w-full h-[85vh] flex flex-col overflow-hidden shadow-2xl border border-slate-200">
        
        {/* Modal Top Bar */}
        <div className="px-6 py-4 bg-[#071917] text-white flex items-center justify-between border-b border-emerald-950">
          <div className="flex items-center gap-2.5">
            <MapPin size={20} className="text-[#10B981]" />
            <div>
              <h3 className="font-heading font-black text-base text-white">
                Interactive PG Map View
              </h3>
              <p className="text-[11px] text-slate-400">
                {properties.length} Zero-Brokerage residences plotted across target localities
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Map Canvas */}
        <div className="flex-1 relative">
          <MapContainer center={center} zoom={13} style={{ height: '100%', width: '100%' }}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {properties.map((p) => {
              if (!p.latitude || !p.longitude) return null;
              return (
                <Marker
                  key={p.id}
                  position={[parseFloat(p.latitude), parseFloat(p.longitude)]}
                  icon={createPriceIcon(p.price_starting)}
                >
                  <Popup>
                    <div className="p-1 font-body text-slate-800">
                      <img
                        src={p.images && p.images[0] ? p.images[0] : 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=500&q=80'}
                        alt={p.title}
                        className="w-full h-24 object-cover rounded-lg mb-2"
                      />
                      <div className="font-bold text-xs text-slate-900 line-clamp-1">{p.title}</div>
                      <div className="text-[10px] text-slate-500 mb-1">{p.locality}, {p.city}</div>
                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100">
                        <span className="text-emerald-700 font-extrabold text-xs">₹{p.price_starting}/mo</span>
                        <Link
                          to={`/pg/${p.id}`}
                          className="text-[11px] font-bold text-slate-900 hover:text-emerald-600 flex items-center gap-1"
                        >
                          <span>Details</span>
                          <ExternalLink size={10} />
                        </Link>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>
        </div>

      </div>
    </div>
  );
}
