import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import ReviewForm from '@/components/review/ReviewForm';

export default async function BusinessReviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: business } = await supabase
    .from('businesses')
    .select('id, name')
    .eq('id', id)
    .single();

  if (!business) notFound();

  return (
    <div className="max-w-2xl mx-auto">
      <ReviewForm
        businessId={business.id}
        businessName={business.name}
        category="business"
      />
    </div>
  );
}
