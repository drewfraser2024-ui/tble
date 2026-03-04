import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import StarRating from '@/components/ui/StarRating';
import ReviewList from '@/components/review/ReviewList';

export default async function FoodTruckDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: business } = await supabase
    .from('businesses')
    .select('*')
    .eq('id', id)
    .single();

  if (!business) notFound();

  const { data: reviews } = await supabase
    .from('reviews')
    .select(`
      *,
      ratings:review_ratings(*),
      images:review_images(*),
      comments:comments(*)
    `)
    .eq('business_id', id)
    .order('created_at', { ascending: false });

  return (
    <div>
      {/* Food Truck Header */}
      <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm mb-6">
        {business.cover_image_url && (
          <img
            src={business.cover_image_url}
            alt={business.name}
            className="w-full h-48 object-cover rounded-lg mb-4"
          />
        )}
        <h1 className="text-2xl font-bold text-black">{business.name}</h1>
        <p className="text-gray-500 text-sm mt-1">{business.address}, {business.city}{business.state ? `, ${business.state}` : ''}</p>
        {business.description && (
          <p className="text-gray-600 text-sm mt-2">{business.description}</p>
        )}
        <div className="flex items-center gap-3 mt-4">
          <StarRating value={Math.round(business.avg_overall_rating)} size="md" readOnly />
          <span className="text-sm text-gray-500">
            {Number(business.avg_overall_rating).toFixed(1)} ({business.review_count} reviews)
          </span>
        </div>
        <Link
          href={`/foodtruck/${id}/review`}
          className="mt-4 inline-flex items-center px-5 py-2.5 bg-turquoise hover:bg-turquoise-dark text-white font-medium text-sm rounded-xl transition-colors"
        >
          Write a Review
        </Link>
      </div>

      {/* Reviews */}
      <h2 className="text-xl font-bold text-black mb-4">Reviews</h2>
      <ReviewList reviews={reviews || []} />
    </div>
  );
}
