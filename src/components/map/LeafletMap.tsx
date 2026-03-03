'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
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
    <MapContainer
      center={center}
      zoom={12}
      className="w-full h-full rounded-xl"
      style={{ minHeight: '500px' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {businesses.map((biz) => (
        <Marker key={biz.id} position={[biz.latitude, biz.longitude]}>
          <Popup>
            <div className="text-sm">
              <p className="font-bold">{biz.name}</p>
              <p className="text-gray-500 text-xs">{biz.address}</p>
              <p className="text-xs mt-1">
                Rating: {Number(biz.avg_overall_rating).toFixed(1)} / 5
              </p>
              <Link
                href={`/${biz.category}/${biz.id}`}
                className="text-xs text-turquoise-dark font-medium mt-1 inline-block"
              >
                View details →
              </Link>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
