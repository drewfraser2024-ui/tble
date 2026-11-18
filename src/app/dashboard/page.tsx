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
  verification_status?: 'unverified' | 'pending' | 'verified';
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
  const [verifiedCount, setVerifiedCount] = useState(0);
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
          .select('id, overall_rating, review_text, created_at, user_name, business_id, verification_status')
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

        // Verified-visit count across all of the owner's reviews (not just the recent 10)
        const { count } = await supabase
          .from('reviews')
          .select('id', { count: 'exact', head: true })
          .in('business_id', bizIds)
          .eq('verification_status', 'verified');

        setVerifiedCount(count || 0);
      }

      setLoading(false);
    }

    load();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-turquoise border-t-transparent rounded-full animate-spin" />
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
            className={`w-4 h-4 ${star <= Math.round(rating) ? 'text-gold' : 'text-ink-600'}`}
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
    <div className="max-w-2xl mx-auto px-5 py-6">
      {/* Welcome Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-11 h-11 rounded-full bg-gold flex items-center justify-center text-[#04110F] font-bold text-lg">
            {displayName.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <h1 className="text-xl font-bold text-white truncate">
              Welcome back, {displayName}
            </h1>
            {businessName && (
              <p className="text-text-lo text-sm truncate">{businessName}</p>
            )}
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="mb-6 border-b border-[var(--hairline)]">
        <nav className="flex gap-1 -mb-px overflow-x-auto no-scrollbar">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap
                border-b-2 transition-all duration-200
                ${activeTab === tab.id
                  ? 'border-turquoise text-turquoise'
                  : 'border-transparent text-text-lo hover:text-text-mid hover:border-[var(--hairline-strong)]'
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
          <div className="grid grid-cols-2 gap-3 mb-8">
            <div className="glass-card p-4">
              <p className="text-sm text-text-lo mb-1">Your Businesses</p>
              <p className="text-2xl font-bold text-white">{businesses.length}</p>
            </div>
            <div className="glass-card p-4">
              <p className="text-sm text-text-lo mb-1">Total Reviews</p>
              <p className="text-2xl font-bold text-white">{totalReviews}</p>
            </div>
            <div className="glass-card p-4">
              <p className="text-sm text-text-lo mb-1">Average Rating</p>
              <div className="flex items-center gap-2">
                <p className="text-2xl font-bold text-white">
                  {avgRating > 0 ? avgRating.toFixed(1) : '\u2014'}
                </p>
                {avgRating > 0 && renderStars(avgRating)}
              </div>
            </div>
            <div className="glass-card p-4">
              <p className="text-sm text-text-lo mb-1 flex items-center gap-1">
                <svg className="w-3.5 h-3.5 text-turquoise" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 1l2.4 1.9 3-.3 1 2.9 2.6 1.5-1 2.9 1 2.9-2.6 1.5-1 2.9-3-.3L10 19l-2.4-1.9-3 .3-1-2.9L1 13.2l1-2.9-1-2.9 2.6-1.5 1-2.9 3 .3L10 1zm-1.2 11.6l4.6-4.6-1.1-1.1-3.5 3.5-1.5-1.5-1.1 1.1 2.6 2.6z" clipRule="evenodd" />
                </svg>
                Verified Visits
              </p>
              <div className="flex items-baseline gap-2">
                <p className="text-2xl font-bold text-turquoise">{verifiedCount}</p>
                {totalReviews > 0 && (
                  <span className="text-sm text-text-dim">
                    {Math.round((verifiedCount / totalReviews) * 100)}%
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Your Businesses */}
          <section className="mb-8">
            <h2 className="text-lg font-bold text-white mb-4">Your Businesses</h2>
            {businesses.length === 0 ? (
              <div className="glass-card p-8 text-center">
                <p className="text-text-mid mb-2">No businesses linked to your account yet.</p>
                <p className="text-text-lo text-sm">
                  Contact us to get your business listed and linked to your owner account.
                </p>
              </div>
            ) : (
              <div className="grid gap-3">
                {businesses.map((biz) => (
                  <Link
                    key={biz.id}
                    href={`/${getCategoryPath(biz.category)}/${biz.id}`}
                    className="glass-card glass-card-hover p-5 flex items-center justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-white">{biz.name}</h3>
                        {biz.is_premium && (
                          <span className="text-xs px-2 py-0.5 bg-gold/15 text-gold rounded-full font-semibold">
                            Premium
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-text-lo">
                        {biz.address}, {biz.city}, {biz.state}
                      </p>
                      <div className="flex items-center gap-3 mt-2">
                        {renderStars(biz.overall_rating || 0)}
                        <span className="text-sm text-text-dim">
                          {biz.review_count || 0} review{biz.review_count !== 1 ? 's' : ''}
                        </span>
                      </div>
                    </div>
                    <svg className="w-5 h-5 text-text-dim shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                ))}
              </div>
            )}
          </section>

          {/* Recent Reviews */}
          <section>
            <h2 className="text-lg font-bold text-white mb-4">Recent Reviews</h2>
            {recentReviews.length === 0 ? (
              <div className="glass-card p-8 text-center">
                <p className="text-text-lo">No reviews yet. Share your business page to start getting reviews!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentReviews.map((review) => (
                  <div
                    key={review.id}
                    className="glass-card p-5"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-turquoise/15 flex items-center justify-center text-turquoise font-bold text-sm">
                          {review.user_name?.charAt(0)?.toUpperCase() || '?'}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <p className="text-sm font-semibold text-white">{review.user_name}</p>
                            {review.verification_status === 'verified' && (
                              <span
                                className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-turquoise/15 text-turquoise text-[10px] font-bold"
                                title="Reviewer confirmed their visit with a receipt"
                              >
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 1l2.4 1.9 3-.3 1 2.9 2.6 1.5-1 2.9 1 2.9-2.6 1.5-1 2.9-3-.3L10 19l-2.4-1.9-3 .3-1-2.9L1 13.2l1-2.9-1-2.9 2.6-1.5 1-2.9 3 .3L10 1zm-1.2 11.6l4.6-4.6-1.1-1.1-3.5 3.5-1.5-1.5-1.1 1.1 2.6 2.6z" clipRule="evenodd" />
                                </svg>
                                Verified
                              </span>
                            )}
                            {review.verification_status === 'pending' && (
                              <span className="inline-flex items-center px-1.5 py-0.5 rounded-full bg-gold/15 text-gold text-[10px] font-bold">
                                Pending
                              </span>
                            )}
                          </div>
                          {businesses.length > 1 && review.business_name && (
                            <p className="text-xs text-text-dim">{review.business_name}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {renderStars(review.overall_rating)}
                        <span className="text-xs text-text-dim">
                          {new Date(review.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-text-mid line-clamp-3">{review.review_text}</p>
                    <Link
                      href={`/${getCategoryPath(businesses.find((b) => b.id === review.business_id)?.category || 'business')}/${review.business_id}`}
                      className="inline-block mt-3 text-xs text-turquoise font-semibold hover:underline"
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
