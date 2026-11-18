import { createClient } from '@/lib/supabase/server';
import MapWrapper from '@/components/map/MapWrapper';

export const metadata = {
  title: 'Map - Tble',
};

export default async function MapPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from('businesses')
    .select('id, name, category, latitude, longitude, avg_overall_rating, address');

  if (category === 'restaurant' || category === 'business' || category === 'foodtruck') {
    query = query.eq('category', category);
  }

  const { data: businesses } = await query;

  return (
    <div className="max-w-2xl mx-auto px-5 py-6">
      <div className="mb-5">
        <h1 className="text-2xl font-bold text-white">Explore the Map</h1>
        <p className="text-text-lo text-sm">Find reviewed businesses near you</p>
      </div>
      <div className="flex gap-2 overflow-x-auto no-scrollbar mb-5 -mx-1 px-1">
        <a
          href="/map"
          className={`shrink-0 text-xs px-3.5 py-2 rounded-full font-semibold transition-colors ${
            !category ? 'bg-turquoise text-[#04110F]' : 'bg-white/[0.06] text-text-mid border border-[var(--hairline)] hover:bg-white/10'
          }`}
        >
          All
        </a>
        <a
          href="/map?category=restaurant"
          className={`shrink-0 text-xs px-3.5 py-2 rounded-full font-semibold transition-colors ${
            category === 'restaurant' ? 'bg-pink text-[#2A0A18]' : 'bg-white/[0.06] text-text-mid border border-[var(--hairline)] hover:bg-white/10'
          }`}
        >
          Restaurants
        </a>
        <a
          href="/map?category=business"
          className={`shrink-0 text-xs px-3.5 py-2 rounded-full font-semibold transition-colors ${
            category === 'business' ? 'bg-gold text-[#2A1A00]' : 'bg-white/[0.06] text-text-mid border border-[var(--hairline)] hover:bg-white/10'
          }`}
        >
          Businesses
        </a>
        <a
          href="/map?category=foodtruck"
          className={`shrink-0 text-xs px-3.5 py-2 rounded-full font-semibold transition-colors ${
            category === 'foodtruck' ? 'bg-violet text-white' : 'bg-white/[0.06] text-text-mid border border-[var(--hairline)] hover:bg-white/10'
          }`}
        >
          Food Trucks
        </a>
      </div>
      <MapWrapper businesses={businesses || []} />
    </div>
  );
}
