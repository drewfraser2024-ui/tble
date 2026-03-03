'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { formatDate } from '@/lib/utils';
import type { Comment } from '@/types/review';

interface CommentSectionProps {
  reviewId: string;
  initialComments: Comment[];
}

export default function CommentSection({ reviewId, initialComments }: CommentSectionProps) {
  const [comments, setComments] = useState(initialComments);
  const [text, setText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showComments, setShowComments] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;

    setIsSubmitting(true);
    const supabase = createClient();

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('comments')
        .insert({
          review_id: reviewId,
          user_id: user.id,
          user_display_name: user.user_metadata?.full_name || user.email || 'Anonymous',
          comment_text: text.trim(),
        })
        .select()
        .single();

      if (error) throw error;
      setComments((prev) => [...prev, data]);
      setText('');
    } catch (err) {
      console.error('Comment failed:', err);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mt-3 pt-3 border-t border-gray-100">
      <button
        onClick={() => setShowComments(!showComments)}
        className="text-xs text-gray-400 hover:text-turquoise-dark transition-colors"
      >
        {comments.length > 0
          ? `${comments.length} comment${comments.length !== 1 ? 's' : ''}`
          : 'Add a comment'}
        {showComments ? ' ▲' : ' ▼'}
      </button>

      {showComments && (
        <div className="mt-3 space-y-3">
          {comments.map((c) => (
            <div key={c.id} className="flex gap-2">
              <div className="w-6 h-6 rounded-full bg-pink/10 flex items-center justify-center flex-shrink-0">
                <span className="text-pink text-xs font-bold">
                  {c.user_display_name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-black">{c.user_display_name}</span>
                  <span className="text-xs text-gray-300">{formatDate(c.created_at)}</span>
                </div>
                <p className="text-xs text-gray-600 mt-0.5">{c.comment_text}</p>
              </div>
            </div>
          ))}

          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Write a comment..."
              className="flex-1 text-xs border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-turquoise"
            />
            <button
              type="submit"
              disabled={isSubmitting || !text.trim()}
              className="text-xs px-3 py-2 bg-turquoise text-white rounded-lg hover:bg-turquoise-dark disabled:opacity-50 transition-colors"
            >
              Post
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
