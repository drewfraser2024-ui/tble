'use client';

import { useState } from 'react';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type VerificationResult = 'verified' | 'suspicious' | 'inconclusive';

type VerifiedReview = {
  reviewId: string;
  reviewerName: string;
  reviewText: string;
  rating: number;
  result: VerificationResult;
  confidence: number;     // 0-100
  reasons: string[];
  verifiedAt: string;
};

type Review = {
  id: string;
  overall_rating: number;
  review_text: string;
  user_name: string;
  created_at: string;
  business_id: string;
  business_name?: string;
};

/* ------------------------------------------------------------------ */
/*  Result styling                                                     */
/* ------------------------------------------------------------------ */

const RESULT_CONFIG: Record<VerificationResult, {
  label: string; icon: string; bg: string; text: string; border: string; dot: string;
}> = {
  verified: {
    label: 'Verified Review',
    icon: 'shield-check',
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
    dot: 'bg-emerald-400',
  },
  suspicious: {
    label: 'Suspicious Review',
    icon: 'exclamation',
    bg: 'bg-red-50',
    text: 'text-red-700',
    border: 'border-red-200',
    dot: 'bg-red-400',
  },
  inconclusive: {
    label: 'Inconclusive',
    icon: 'question',
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-200',
    dot: 'bg-amber-400',
  },
};

/* ------------------------------------------------------------------ */
/*  Simulated AI analysis                                              */
/* ------------------------------------------------------------------ */

function simulateAIAnalysis(review: Review): VerifiedReview {
  const text = review.review_text.toLowerCase();
  const reasons: string[] = [];
  let score = 75; // baseline

  // Length check
  if (review.review_text.length < 30) {
    score -= 20;
    reasons.push('Review text is unusually short');
  } else if (review.review_text.length > 100) {
    score += 5;
    reasons.push('Review contains detailed description');
  }

  // Generic phrase detection
  const genericPhrases = ['best ever', 'worst ever', 'terrible place', 'amazing place', 'do not go', '5 stars'];
  const hasGeneric = genericPhrases.some((p) => text.includes(p));
  if (hasGeneric) {
    score -= 15;
    reasons.push('Contains commonly flagged generic phrases');
  }

  // Specificity indicators
  const specificWords = ['ordered', 'server', 'waited', 'menu', 'dish', 'table', 'atmosphere', 'price', 'portion'];
  const specificCount = specificWords.filter((w) => text.includes(w)).length;
  if (specificCount >= 2) {
    score += 10;
    reasons.push('Contains specific experiential details');
  }

  // Determine result
  let result: VerificationResult;
  if (score >= 70) {
    result = 'verified';
    if (reasons.length === 0) reasons.push('Review passes all authenticity checks');
  } else if (score >= 45) {
    result = 'inconclusive';
    if (reasons.length === 0) reasons.push('Insufficient data for definitive assessment');
  } else {
    result = 'suspicious';
    if (reasons.length === 0) reasons.push('Multiple fraud indicators detected');
  }

  return {
    reviewId: review.id,
    reviewerName: review.user_name,
    reviewText: review.review_text,
    rating: review.overall_rating,
    result,
    confidence: Math.min(98, Math.max(25, score)),
    reasons,
    verifiedAt: new Date().toISOString(),
  };
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function AIReviewVerification({ reviews }: { reviews: Review[] }) {
  const [verifiedReviews, setVerifiedReviews] = useState<VerifiedReview[]>([]);
  const [analyzing, setAnalyzing] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);

  async function runBatchAnalysis() {
    setAnalyzing(true);
    setScanComplete(false);

    // Simulate progressive analysis
    const results: VerifiedReview[] = [];
    for (const review of reviews) {
      await new Promise((resolve) => setTimeout(resolve, 400));
      results.push(simulateAIAnalysis(review));
      setVerifiedReviews([...results]);
    }

    setAnalyzing(false);
    setScanComplete(true);
  }

  function renderStars(rating: number) {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-3.5 h-3.5 ${star <= Math.round(rating) ? 'text-gold' : 'text-gray-200'}`}
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        ))}
      </div>
    );
  }

  const verifiedCount = verifiedReviews.filter((r) => r.result === 'verified').length;
  const suspiciousCount = verifiedReviews.filter((r) => r.result === 'suspicious').length;
  const inconclusiveCount = verifiedReviews.filter((r) => r.result === 'inconclusive').length;

  return (
    <section>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-black flex items-center gap-2">
            <svg className="w-5 h-5 text-turquoise" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            AI Review Verification
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            AI-powered analysis to detect fake or suspicious reviews.
          </p>
        </div>

        <button
          onClick={runBatchAnalysis}
          disabled={analyzing || reviews.length === 0}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-turquoise hover:bg-turquoise-dark text-white font-semibold rounded-xl text-sm transition-colors disabled:opacity-50 shadow-sm hover:shadow-md active:scale-[0.98]"
        >
          {analyzing ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              {scanComplete ? 'Re-scan Reviews' : 'Scan All Reviews'}
            </>
          )}
        </button>
      </div>

      {/* Summary stats */}
      {verifiedReviews.length > 0 && (
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              <span className="text-xs font-medium text-emerald-700">Verified</span>
            </div>
            <p className="text-2xl font-bold text-emerald-800">{verifiedCount}</p>
          </div>
          <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              <span className="text-xs font-medium text-amber-700">Inconclusive</span>
            </div>
            <p className="text-2xl font-bold text-amber-800">{inconclusiveCount}</p>
          </div>
          <div className="bg-red-50 rounded-xl p-4 border border-red-100">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
              <span className="text-xs font-medium text-red-700">Suspicious</span>
            </div>
            <p className="text-2xl font-bold text-red-800">{suspiciousCount}</p>
          </div>
        </div>
      )}

      {/* Results list */}
      {verifiedReviews.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8 text-center">
          <div className="w-14 h-14 rounded-full bg-turquoise/10 flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7 text-turquoise" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <p className="text-gray-600 font-medium mb-1">AI-Powered Review Scanner</p>
          <p className="text-gray-400 text-sm">
            {reviews.length > 0
              ? `Click "Scan All Reviews" to analyze ${reviews.length} review${reviews.length !== 1 ? 's' : ''} for authenticity.`
              : 'No reviews to analyze yet.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {verifiedReviews.map((vr) => {
            const cfg = RESULT_CONFIG[vr.result];
            return (
              <div
                key={vr.reviewId}
                className={`bg-white rounded-xl border shadow-sm p-5 hover:shadow-md transition-all ${cfg.border}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="text-sm font-semibold text-black">{vr.reviewerName}</span>
                      {renderStars(vr.rating)}
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold ${cfg.bg} ${cfg.text}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                        {cfg.label}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 line-clamp-2 mb-2">&ldquo;{vr.reviewText}&rdquo;</p>

                    {/* AI reasons */}
                    <div className="flex flex-wrap gap-1.5">
                      {vr.reasons.map((reason, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-gray-50 border border-gray-100 text-xs text-gray-500"
                        >
                          <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {reason}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Confidence meter */}
                  <div className="text-center shrink-0">
                    <div className="relative w-14 h-14">
                      <svg className="w-14 h-14 -rotate-90" viewBox="0 0 56 56">
                        <circle cx="28" cy="28" r="24" fill="none" stroke="#f3f4f6" strokeWidth="4" />
                        <circle
                          cx="28"
                          cy="28"
                          r="24"
                          fill="none"
                          stroke={vr.result === 'verified' ? '#10b981' : vr.result === 'suspicious' ? '#ef4444' : '#f59e0b'}
                          strokeWidth="4"
                          strokeLinecap="round"
                          strokeDasharray={`${(vr.confidence / 100) * 150.8} 150.8`}
                        />
                      </svg>
                      <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-gray-700">
                        {vr.confidence}%
                      </span>
                    </div>
                    <p className="text-[10px] text-gray-400 mt-1">Confidence</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
