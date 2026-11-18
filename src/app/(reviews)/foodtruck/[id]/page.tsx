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
    .eq('category', 'foodtruck')
    .single();

  if (!business) notFound();

  const { data: reviews } = await supabase
    .from('reviews')
    .select(`
      *,
      ratings:review_ratings(*),
      images:review_images(*),
      comments:comments(*),
      owner_response:owner_responses(*)
    `)
    .eq('business_id', id)
    .order('created_at', { ascending: false });

  const { data: { user } } = await supabase.auth.getUser();
  const isOwner = !!user && user.id === business.owner_user_id;
  const isPremium = business.is_premium;

  return (
    <div>
      {/* Food Truck Header */}
      <div className="glass-card p-6 mb-6">
        {business.cover_image_url && (
          <img
            src={business.cover_image_url}
            alt={business.name}
            className="w-full h-48 object-cover rounded-lg mb-4"
          />
        )}
        <h1 className="text-2xl font-bold text-white">{business.name}</h1>
        <p className="text-text-lo text-sm mt-1">{business.city}{business.state ? `, ${business.state}` : ''} Area</p>
        {business.description && (
          <p className="text-text-mid text-sm mt-2">{business.description}</p>
        )}
        <div className="flex items-center gap-3 mt-4">
          <StarRating value={Math.round(business.avg_overall_rating)} size="md" readOnly />
          <span className="text-sm text-text-lo">
            {Number(business.avg_overall_rating).toFixed(1)} ({business.review_count} reviews)
          </span>
        </div>
        <Link
          href={`/foodtruck/${id}/review`}
          className="btn-primary mt-4 px-5 py-2.5 text-sm"
        >
          Write a Review
        </Link>
      </div>

      {/* Reviews */}
      <h2 className="text-xl font-bold text-white mb-4">Reviews</h2>
      <ReviewList reviews={reviews || []} isOwner={isOwner} isPremium={isPremium} businessId={business.id} />
    </div>
  );
}
