'use client';

import { useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

export default function SignUpPage() {
  const [email, setEmail] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: displayName,
          role: 'user',
        },
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  }

  if (success) {
    return (
      <div className="max-w-md mx-auto px-5 py-12 text-center">
        <div className="w-16 h-16 rounded-2xl bg-turquoise/10 border border-[var(--hairline)] flex items-center justify-center mx-auto mb-5">
          <svg className="w-8 h-8 text-turquoise" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">Check your email</h1>
        <p className="text-text-lo text-sm mb-6">
          We sent a confirmation link to <strong className="text-white">{email}</strong>. Click the link to activate your account.
        </p>
        <Link
          href="/auth/signin"
          className="text-turquoise font-semibold text-sm hover:underline"
        >
          Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-5 py-12">
      <div className="text-center mb-8">
        <div className="app-badge w-16 h-16 rounded-2xl mx-auto mb-5">
          <span className="font-serif font-bold italic text-3xl text-[#06201C]">T</span>
        </div>
        <h1 className="text-2xl font-bold text-white">Create your account</h1>
        <p className="text-text-lo text-sm mt-1.5">Join Tble It to share your reviews</p>
      </div>

      <div className="glass-card p-8">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="displayName" className="block text-sm font-medium text-text-mid mb-1.5">
              Display Name
            </label>
            <input
              id="displayName"
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required
              placeholder="Your name"
              className="field"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-text-mid mb-1.5">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              className="field"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-text-mid mb-1.5">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              placeholder="At least 6 characters"
              className="field"
            />
          </div>

          {error && (
            <p className="text-pink text-sm text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3.5"
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-text-lo">
            Already have an account?{' '}
            <Link href="/auth/signin" className="text-turquoise font-semibold hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
