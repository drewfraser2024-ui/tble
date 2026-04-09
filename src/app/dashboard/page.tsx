'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';
import MembershipPlans from '@/components/dashboard/MembershipPlans';
import ReviewDisputes from '@/components/dashboard/ReviewDisputes';
import AIReviewVerification from '@/components/dashboard/AIReviewVerification';

type Business = {
  id: string;
  name: string;
  category: string;
  address: string;
  city: string;
  state: string;
  overall_rating: number;
  review_count: number;
  is_premium: boolean;
};

type Review = {
  id: string;
  overall_rating: number;
  review_text: string;
  created_at: string;
  user_name: string;
  business_id: string;
  business_name?: string;
};

const TABS = [
  { id: 'overview', label: 'Overview', icon: 'grid' },
  { id: 'ai-verify', label: 'AI Verification', icon: 'shield' },
  { id: 'disputes', label: 'Disputes', icon: 'flag' },
  { id: 'plans', label: 'Upgrade', icon: 'star' },
] as const;

type TabId = (typeof TABS)[number]['id'];

function TabIcon({ icon, className }: { icon: string; className: string }) {
  const base = `w-4 h-4 ${className}`;
  switch (icon) {
    case 'grid':
      return (
        <svg className={base} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      );
    case 'shield':
      return (
        <svg className={base} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      );
    case 'flag':
      return (
        <svg className={base} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
        </svg>
      );
    default: // star
      return (
        <svg className={base} fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      );
  }
}

export default function OwnerDashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [recentReviews, setRecentReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabId>('overview');

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user || user.user_metadata?.role !== 'owner') {
        router.push('/');
        return;
      }

      setUser(user);

      // Fetch owner's businesses
      const { data: biz } = await supabase
        .from('businesses')
        .select('id, name, category, address, city, state, overall_rating, review_count, is_premium')
        .eq('owner_user_id', user.id);

      const ownerBusinesses = biz || [];
      setBusinesses(ownerBusinesses);

      // Fetch recent reviews for all owner's businesses
      if (ownerBusinesses.length > 0) {
        const bizIds = ownerBusinesses.map((b) => b.id);
        const { data: reviews } = await supabase
          .from('reviews')
          .select('id, overall_rating, review_text, created_at, user_name, business_id')
          .in('business_id', bizIds)
          .order('created_at', { ascending: false })
          .limit(10);

        if (reviews) {
          const enriched = reviews.map((r) => ({
            ...r,
            business_name: ownerBusinesses.find((b) => b.id === r.business_id)?.name || '',
          }));
          setRecentReviews(enriched);
        }
      }

      setLoading(false);
    }

    load();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-turquoise border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const displayName = user?.user_metadata?.full_name || user?.email || '';
  const businessName = user?.user_metadata?.business_name || '';
  const totalReviews = businesses.reduce((sum, b) => sum + (b.review_count || 0), 0);
  const avgRating = businesses.length > 0
    ? businesses.reduce((sum, b) => sum + (b.overall_rating || 0), 0) / businesses.length
    : 0;

  function getCategoryPath(category: string) {
    if (category === 'restaurant') return 'restaurant';
    if (category === 'foodtruck') return 'foodtruck';
    return 'business';
  }

  function renderStars(rating: number) {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-4 h-4 ${star <= Math.round(rating) ? 'text-gold' : 'text-gray-200'}`}
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Welcome Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-full bg-gold flex items-center justify-center text-white font-bold text-lg">
            {displayName.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-black">
              Welcome back, {displayName}
            </h1>
            {businessName && (
              <p className="text-gray-500 text-sm">{businessName}</p>
            )}
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="mb-8 border-b border-gray-200">
        <nav className="flex gap-1 -mb-px overflow-x-auto">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap
                border-b-2 transition-all duration-200
                ${activeTab === tab.id
                  ? 'border-turquoise text-turquoise-dark'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              <TabIcon icon={tab.icon} className={activeTab === tab.id ? 'text-turquoise' : ''} />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <p className="text-sm text-gray-500 mb-1">Your Businesses</p>
              <p className="text-3xl font-bold text-black">{businesses.length}</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <p className="text-sm text-gray-500 mb-1">Total Reviews</p>
              <p className="text-3xl font-bold text-black">{totalReviews}</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <p className="text-sm text-gray-500 mb-1">Average Rating</p>
              <div className="flex items-center gap-2">
                <p className="text-3xl font-bold text-black">
                  {avgRating > 0 ? avgRating.toFixed(1) : '\u2014'}
                </p>
                {avgRating > 0 && renderStars(avgRating)}
              </div>
            </div>
          </div>

          {/* Your Businesses */}
          <section className="mb-10">
            <h2 className="text-lg font-bold text-black mb-4">Your Businesses</h2>
            {businesses.length === 0 ? (
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8 text-center">
                <p className="text-gray-500 mb-2">No businesses linked to your account yet.</p>
                <p className="text-gray-400 text-sm">
                  Contact us to get your business listed and linked to your owner account.
                </p>
              </div>
            ) : (
              <div className="grid gap-4">
                {businesses.map((biz) => (
                  <Link
                    key={biz.id}
                    href={`/${getCategoryPath(biz.category)}/${biz.id}`}
                    className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-shadow flex items-center justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-black">{biz.name}</h3>
                        {biz.is_premium && (
                          <span className="text-xs px-2 py-0.5 bg-gold/10 text-gold rounded-full font-medium">
                            Premium
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">
                        {biz.address}, {biz.city}, {biz.state}
                      </p>
                      <div className="flex items-center gap-3 mt-2">
                        {renderStars(biz.overall_rating || 0)}
                        <span className="text-sm text-gray-400">
                          {biz.review_count || 0} review{biz.review_count !== 1 ? 's' : ''}
                        </span>
                      </div>
                    </div>
                    <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                ))}
              </div>
            )}
          </section>

          {/* Recent Reviews */}
          <section>
            <h2 className="text-lg font-bold text-black mb-4">Recent Reviews</h2>
            {recentReviews.length === 0 ? (
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8 text-center">
                <p className="text-gray-500">No reviews yet. Share your business page to start getting reviews!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentReviews.map((review) => (
                  <div
                    key={review.id}
                    className="bg-white rounded-xl border border-gray-100 shadow-sm p-6"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-turquoise/10 flex items-center justify-center text-turquoise font-bold text-sm">
                          {review.user_name?.charAt(0)?.toUpperCase() || '?'}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-black">{review.user_name}</p>
                          {businesses.length > 1 && review.business_name && (
                            <p className="text-xs text-gray-400">{review.business_name}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {renderStars(review.overall_rating)}
                        <span className="text-xs text-gray-400">
                          {new Date(review.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-3">{review.review_text}</p>
                    <Link
                      href={`/${getCategoryPath(businesses.find((b) => b.id === review.business_id)?.category || 'business')}/${review.business_id}`}
                      className="inline-block mt-3 text-xs text-turquoise-dark font-medium hover:underline"
                    >
                      View & Respond
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      )}

      {activeTab === 'ai-verify' && (
        <AIReviewVerification reviews={recentReviews} />
      )}

      {activeTab === 'disputes' && (
        <ReviewDisputes reviews={recentReviews} />
      )}

      {activeTab === 'plans' && (
        <MembershipPlans />
      )}
    </div>
  );
}
