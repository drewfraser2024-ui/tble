import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import StarRating from '@/components/ui/StarRating';

export const metadata = {
  title: 'Search - Tble',
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string }>;
}) {
  const { q, category } = await searchParams;

  if (!q) {
    return (
      <div className="max-w-2xl mx-auto px-5 py-16 text-center">
        <div className="glass-card p-10">
          <div className="w-14 h-14 rounded-full bg-turquoise/15 flex items-center justify-center mx-auto mb-5">
            <svg className="w-7 h-7 text-turquoise" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="m21 21-4.3-4.3M11 19a8 8 0 1 1 0-16 8 8 0 0 1 0 16Z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Search</h1>
          <p className="text-text-lo">Enter a search term to find businesses</p>
        </div>
      </div>
    );
  }

  const supabase = await createClient();
  const { data: results } = await supabase.rpc('search_businesses', {
    search_term: q,
    category_filter: category || null,
  });

  return (
    <div className="max-w-2xl mx-auto px-5 py-6">
      <h1 className="text-2xl font-bold text-white mb-1">
        Search results for &ldquo;{q}&rdquo;
      </h1>
      <p className="text-text-lo text-sm mb-6">
        {results?.length || 0} result{results?.length !== 1 ? 's' : ''} found
      </p>

      {(!results || results.length === 0) ? (
        <div className="glass-card p-10 text-center">
          <p className="text-text-lo">No businesses match your search. Try different keywords.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {results.map((biz: { id: string; name: string; category: string; address: string; city: string; avg_overall_rating: number; review_count: number }) => (
            <Link
              key={biz.id}
              href={`/${biz.category}/${biz.id}`}
              className="glass-card glass-card-hover flex items-center gap-4 p-4"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    biz.category === 'restaurant'
                      ? 'bg-pink/15 text-pink'
                      : biz.category === 'foodtruck'
                      ? 'bg-violet/15 text-violet'
                      : 'bg-gold/15 text-gold'
                  }`}>
                    {biz.category === 'restaurant' ? 'Restaurant' : biz.category === 'foodtruck' ? 'Food Truck' : 'Business'}
                  </span>
                </div>
                <h3 className="font-bold text-white truncate">
                  {biz.name}
                </h3>
                <p className="text-sm text-text-lo truncate mt-0.5">
                  {biz.category === 'foodtruck' ? `${biz.city} Area` : `${biz.address}, ${biz.city}`}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <StarRating value={Math.round(Number(biz.avg_overall_rating))} size="sm" readOnly />
                  <span className="text-xs text-text-dim">({biz.review_count} reviews)</span>
                </div>
              </div>
              <svg className="w-5 h-5 text-text-dim shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
