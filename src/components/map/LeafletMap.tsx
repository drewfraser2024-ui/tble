'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import Link from 'next/link';
import 'leaflet/dist/leaflet.css';

// Fix default marker icon
// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

interface MapBusiness {
  id: string;
  name: string;
  category: string;
  latitude: number;
  longitude: number;
  avg_overall_rating: number;
  address: string;
}

interface LeafletMapProps {
  businesses: MapBusiness[];
}

function RecenterMap({ center }: { center: [number, number] }) {
  const map = useMap();

  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);

  return null;
}

export default function LeafletMap({ businesses }: LeafletMapProps) {
  const [center, setCenter] = useState<[number, number]>([40.7128, -74.006]); // Default NYC

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setCenter([pos.coords.latitude, pos.coords.longitude]),
        () => {} // Silently fail, keep default
      );
    }
  }, []);

  return (
    <div className="rounded-2xl overflow-hidden border border-[var(--hairline)]">
      <MapContainer
        center={center}
        zoom={12}
        className="w-full h-full rounded-xl"
        style={{ minHeight: '500px' }}
      >
        <RecenterMap center={center} />
        <TileLayer
          attribution='Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ'
          url="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}"
        />
        {businesses.map((biz) => (
          <Marker key={biz.id} position={[biz.latitude, biz.longitude]}>
            <Popup>
              <div className="text-sm min-w-[160px]">
                <p className="font-bold text-ink-950">{biz.name}</p>
                <p className="text-text-lo text-xs mt-0.5">{biz.address}</p>
                <p className="text-xs mt-1 text-text-lo">
                  Rating: <span className="font-semibold text-gold">{Number(biz.avg_overall_rating).toFixed(1)}</span> / 5
                </p>
                <Link
                  href={`/${biz.category}/${biz.id}`}
                  className="text-xs text-turquoise-dark font-semibold mt-1.5 inline-block"
                >
                  View details →
                </Link>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
