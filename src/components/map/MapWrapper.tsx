'use client';

import dynamic from 'next/dynamic';

const LeafletMap = dynamic(() => import('@/components/map/LeafletMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[500px] bg-gray-100 rounded-xl animate-pulse flex items-center justify-center">
      <p className="text-gray-400 text-sm">Loading map...</p>
    </div>
  ),
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

export default function MapWrapper({ businesses }: { businesses: MapBusiness[] }) {
  return <LeafletMap businesses={businesses} />;
}
