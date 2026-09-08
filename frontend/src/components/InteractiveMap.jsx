import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { ShieldCheck, ArrowRight } from 'lucide-react';

// Controller to auto-center map when active city or properties change
function MapCenterController({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center && center[0] && center[1]) {
      map.setView(center, zoom || 13, { animate: true });
    }
  }, [center, zoom, map]);
  return null;
}

// Function to generate modern HTML price tag marker
const createPriceIcon = (price, isHovered) => {
  const formatted = price ? `₹${Math.round(price / 1000)}k` : '₹PG';
  return L.divIcon({
    className: 'custom-leaflet-pin',
    html: `
      <div style="
        background: ${isHovered ? 'linear-gradient(135deg, #00D2FF 0%, #7928CA 100%)' : '#0F172A'};
        color: ${isHovered ? '#030712' : '#38BDF8'};
        border: 1.5px solid ${isHovered ? '#00D2FF' : 'rgba(56, 189, 248, 0.4)'};
        font-family: 'Outfit', sans-serif;
        font-weight: 800;
        font-size: 11px;
        padding: 4px 8px;
        border-radius: 9999px;
        box-shadow: ${isHovered ? '0 0 20px rgba(0,210,255,0.9)' : '0 4px 15px rgba(0,0,0,0.6)'};
        white-space: nowrap;
        cursor: pointer;
        transform: translate(-50%, -50%) ${isHovered ? 'scale(1.15)' : 'scale(1)'};
        transition: all 0.2s ease;
      ">
        ${formatted}
      </div>
    `,
    iconSize: [40, 25],
    iconAnchor: [20, 12]
  });
};

const CITY_COORDINATES = {
  Bangalore: [12.9345, 77.6265],
  Pune: [18.5913, 73.7389],
  'Delhi NCR': [28.4901, 77.0895],
  Hyderabad: [17.4435, 78.3772],
  Mumbai: [19.0760, 72.8777],
  'All Cities': [12.9716, 77.5946]
};

export default function InteractiveMap({
  properties,
  hoveredPropertyId,
  onHoverProperty,
  onSelectProperty,
  activeCity
}) {
  const defaultCenter = CITY_COORDINATES[activeCity] || [12.9345, 77.6265];

  return (
    <div className="w-full h-full min-h-[450px] relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
      <MapContainer
        center={defaultCenter}
        zoom={13}
        scrollWheelZoom={false}
        className="w-full h-full z-10"
      >
        <MapCenterController center={defaultCenter} zoom={13} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {properties.map((property) => {
          if (!property.latitude || !property.longitude) return null;
          const isHovered = hoveredPropertyId === property.id;

          return (
            <Marker
              key={property.id}
              position={[property.latitude, property.longitude]}
              icon={createPriceIcon(property.startingPrice, isHovered)}
              eventHandlers={{
                mouseover: () => onHoverProperty && onHoverProperty(property.id),
                mouseout: () => onHoverProperty && onHoverProperty(null),
                click: () => onSelectProperty(property)
              }}
            >
              <Popup>
                <div className="p-1 max-w-[220px]">
                  <img
                    src={property.images?.[0] || "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=300&q=80"}
                    alt={property.name}
                    className="w-full h-24 object-cover rounded-lg mb-2"
                  />
                  <div className="font-bold text-xs text-white line-clamp-1">
                    {property.name}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    {property.locality}
                  </div>
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-700">
                    <span className="font-extrabold text-[#00D2FF] text-xs">
                      ₹{Number(property.startingPrice).toLocaleString('en-IN')}/mo
                    </span>
                    <button
                      onClick={() => onSelectProperty(property)}
                      className="text-[10px] font-bold text-slate-300 hover:text-white flex items-center gap-0.5"
                    >
                      <span>View</span>
                      <ArrowRight className="w-2.5 h-2.5" />
                    </button>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Floating Info Pill on Map */}
      <div className="absolute top-3 right-3 z-20 bg-slate-950/80 backdrop-blur-md border border-white/15 px-3 py-1.5 rounded-full text-xs font-semibold text-slate-300 flex items-center gap-1.5 pointer-events-none shadow-lg">
        <span className="w-2 h-2 rounded-full bg-[#00D2FF] animate-pulse" />
        <span>{properties.length} spaces mapped</span>
      </div>
    </div>
  );
}
