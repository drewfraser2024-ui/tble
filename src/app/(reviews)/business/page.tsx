import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import StarRating from '@/components/ui/StarRating';

export const metadata = {
  title: 'Stores & Businesses - Tble',
};

export default async function BusinessListPage() {
  const supabase = await createClient();
  const { data: businesses } = await supabase
    .from('businesses')
    .select('*')
    .eq('category', 'business')
    .order('avg_overall_rating', { ascending: false });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-black">Stores & Businesses</h1>
        <p className="text-gray-500 mt-1">Browse and review your shopping experiences</p>
      </div>

      {(!businesses || businesses.length === 0) ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-black mb-1">No businesses yet</h2>
          <p className="text-gray-400 text-sm">Check back soon for new listings!</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {businesses.map((biz) => (
            <Link
              key={biz.id}
              href={`/business/${biz.id}`}
              className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow group"
            >
              {biz.cover_image_url && (
                <img
                  src={biz.cover_image_url}
                  alt={biz.name}
                  className="w-full h-32 object-cover rounded-lg mb-3"
                />
              )}
              <h3 className="font-bold text-black group-hover:text-turquoise-dark transition-colors">
                {biz.name}
              </h3>
              <p className="text-sm text-gray-400 mt-1">{biz.address}, {biz.city}</p>
              <div className="flex items-center gap-2 mt-2">
                <StarRating value={Math.round(biz.avg_overall_rating)} size="sm" readOnly />
                <span className="text-xs text-gray-400">
                  ({biz.review_count} {biz.review_count === 1 ? 'review' : 'reviews'})
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
