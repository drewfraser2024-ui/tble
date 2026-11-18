'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

export default function OwnerSignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push('/dashboard');
    router.refresh();
  }

  return (
    <div className="max-w-md mx-auto px-5 py-12">
      <div className="text-center mb-8">
        <div className="app-badge w-16 h-16 rounded-2xl mx-auto mb-5">
          <span className="font-serif font-bold italic text-3xl text-[#06201C]">T</span>
        </div>
        <p className="text-gold text-xs font-semibold uppercase tracking-wide mb-1">Business Owner</p>
        <h1 className="text-2xl font-bold text-white">Owner Sign In</h1>
        <p className="text-text-lo text-sm mt-1.5">Manage your business on Tble It</p>
      </div>

      <div className="glass-card p-8 border-gold/30">
        <form onSubmit={handleSubmit} className="space-y-5">
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
              placeholder="Your password"
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
            {loading ? 'Signing in...' : 'Sign In as Owner'}
          </button>
        </form>

        <div className="mt-6 text-center space-y-2">
          <p className="text-sm text-text-lo">
            Don&apos;t have an owner account?{' '}
            <Link href="/auth/owner/signup" className="text-gold font-semibold hover:underline">
              Register your business
            </Link>
          </p>
          <p className="text-sm text-text-dim">
            Not an owner?{' '}
            <Link href="/auth/signin" className="text-turquoise font-semibold hover:underline">
              User sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
