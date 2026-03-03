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
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold text-black mb-2">Search</h1>
        <p className="text-gray-500">Enter a search term to find businesses</p>
      </div>
    );
  }

  const supabase = await createClient();
  const { data: results } = await supabase.rpc('search_businesses', {
    search_term: q,
    category_filter: category || null,
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-black mb-1">
        Search results for &ldquo;{q}&rdquo;
      </h1>
      <p className="text-gray-500 text-sm mb-6">
        {results?.length || 0} result{results?.length !== 1 ? 's' : ''} found
      </p>

      {(!results || results.length === 0) ? (
        <div className="text-center py-12">
          <p className="text-gray-400">No businesses match your search. Try different keywords.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {results.map((biz: { id: string; name: string; category: string; address: string; city: string; avg_overall_rating: number; review_count: number }) => (
            <Link
              key={biz.id}
              href={`/${biz.category}/${biz.id}`}
              className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow group"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  biz.category === 'restaurant'
                    ? 'bg-pink/10 text-pink'
                    : 'bg-gold/10 text-gold'
                }`}>
                  {biz.category === 'restaurant' ? 'Restaurant' : 'Business'}
                </span>
              </div>
              <h3 className="font-bold text-black group-hover:text-turquoise-dark transition-colors">
                {biz.name}
              </h3>
              <p className="text-sm text-gray-400 mt-1">{biz.address}, {biz.city}</p>
              <div className="flex items-center gap-2 mt-2">
                <StarRating value={Math.round(Number(biz.avg_overall_rating))} size="sm" readOnly />
                <span className="text-xs text-gray-400">({biz.review_count} reviews)</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
