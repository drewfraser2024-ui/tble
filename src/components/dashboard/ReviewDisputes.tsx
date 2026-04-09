'use client';

import { useState } from 'react';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type DisputeStatus = 'pending' | 'under_review' | 'approved' | 'rejected';

type Dispute = {
  id: string;
  reviewId: string;
  reviewerName: string;
  reviewText: string;
  rating: number;
  reason: string;
  status: DisputeStatus;
  createdAt: string;
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
/*  Status config                                                      */
/* ------------------------------------------------------------------ */

const STATUS_CONFIG: Record<DisputeStatus, { label: string; bg: string; text: string; dot: string }> = {
  pending: { label: 'Pending', bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-400' },
  under_review: { label: 'Under Review', bg: 'bg-blue-50', text: 'text-blue-700', dot: 'bg-blue-400' },
  approved: { label: 'Approved', bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-400' },
  rejected: { label: 'Rejected', bg: 'bg-red-50', text: 'text-red-700', dot: 'bg-red-400' },
};

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function ReviewDisputes({ reviews }: { reviews: Review[] }) {
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedReview, setSelectedReview] = useState<string>('');
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);

  function handleSubmitDispute(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedReview || !reason.trim()) return;

    setSubmitting(true);
    const review = reviews.find((r) => r.id === selectedReview);
    if (!review) return;

    const newDispute: Dispute = {
      id: `disp_${Date.now()}`,
      reviewId: review.id,
      reviewerName: review.user_name,
      reviewText: review.review_text,
      rating: review.overall_rating,
      reason: reason.trim(),
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    setDisputes((prev) => [newDispute, ...prev]);
    setShowForm(false);
    setSelectedReview('');
    setReason('');
    setSubmitting(false);
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

  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-black flex items-center gap-2">
            <svg className="w-5 h-5 text-pink" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
            </svg>
            Review Disputes
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Flag reviews you believe are fake or misleading.
          </p>
        </div>
        {!showForm && reviews.length > 0 && (
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-pink/10 hover:bg-pink/20 text-pink font-semibold rounded-xl text-sm transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Flag a Review
          </button>
        )}
      </div>

      {/* Dispute form */}
      {showForm && (
        <form
          onSubmit={handleSubmitDispute}
          className="bg-white rounded-xl border border-pink/20 p-6 mb-6 shadow-sm"
        >
          <h3 className="font-semibold text-black mb-4">Submit a Dispute</h3>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Select the review to dispute
            </label>
            <select
              value={selectedReview}
              onChange={(e) => setSelectedReview(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-pink focus:ring-2 focus:ring-pink-light bg-white"
              required
            >
              <option value="">Choose a review...</option>
              {reviews.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.user_name} — &quot;{r.review_text.slice(0, 60)}...&quot;
                </option>
              ))}
            </select>
          </div>

          {selectedReview && (() => {
            const rev = reviews.find((r) => r.id === selectedReview);
            if (!rev) return null;
            return (
              <div className="bg-gray-50 rounded-lg p-4 mb-4 border border-gray-100">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-semibold text-black">{rev.user_name}</span>
                  {renderStars(rev.overall_rating)}
                </div>
                <p className="text-sm text-gray-600 line-clamp-3">{rev.review_text}</p>
              </div>
            );
          })()}

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Reason for dispute
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              placeholder="Explain why you believe this review is fake, misleading, or violates our guidelines..."
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-pink focus:ring-2 focus:ring-pink-light resize-none"
              required
            />
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={submitting || !selectedReview || !reason.trim()}
              className="px-5 py-2.5 bg-pink hover:bg-pink/80 text-white font-semibold rounded-xl text-sm transition-colors disabled:opacity-50"
            >
              {submitting ? 'Submitting...' : 'Submit Dispute'}
            </button>
            <button
              type="button"
              onClick={() => { setShowForm(false); setSelectedReview(''); setReason(''); }}
              className="px-5 py-2.5 border border-gray-200 text-gray-600 font-medium rounded-xl text-sm hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Disputes list */}
      {disputes.length === 0 && !showForm ? (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8 text-center">
          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <p className="text-gray-500 text-sm">No disputes filed yet.</p>
          <p className="text-gray-400 text-xs mt-1">If you spot a suspicious review, flag it here.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {disputes.map((d) => {
            const status = STATUS_CONFIG[d.status];
            return (
              <div
                key={d.id}
                className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-semibold text-black">{d.reviewerName}</span>
                      {renderStars(d.rating)}
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${status.bg} ${status.text}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                        {status.label}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 line-clamp-2 mb-2">&ldquo;{d.reviewText}&rdquo;</p>
                    <p className="text-xs text-gray-400">
                      <span className="font-medium text-gray-500">Reason:</span> {d.reason}
                    </p>
                  </div>
                  <span className="text-xs text-gray-400 whitespace-nowrap">
                    {new Date(d.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
