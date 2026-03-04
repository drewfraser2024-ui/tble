import { createClient } from '@/lib/supabase/server';
import BackButton from '@/components/ui/BackButton';
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
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="mb-4">
        <BackButton href="/" />
      </div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-black">Explore the Map</h1>
          <p className="text-gray-500 text-sm">Find reviewed businesses near you</p>
        </div>
        <div className="flex gap-2">
          <a
            href="/map"
            className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors ${
              !category ? 'bg-turquoise text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            All
          </a>
          <a
            href="/map?category=restaurant"
            className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors ${
              category === 'restaurant' ? 'bg-pink text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Restaurants
          </a>
          <a
            href="/map?category=business"
            className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors ${
              category === 'business' ? 'bg-gold text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Businesses
          </a>
          <a
            href="/map?category=foodtruck"
            className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors ${
              category === 'foodtruck' ? 'bg-violet text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Food Trucks
          </a>
        </div>
      </div>
      <MapWrapper businesses={businesses || []} />
    </div>
  );
}
