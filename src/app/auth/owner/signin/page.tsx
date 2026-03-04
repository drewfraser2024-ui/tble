'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
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

    router.push('/');
    router.refresh();
  }

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Image src="/logo.svg" alt="Tble" width={100} height={100} className="mx-auto mb-2" />
          <h1 className="text-2xl font-bold text-black">Owner Sign In</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your business on Tble</p>
        </div>

        <div className="bg-white rounded-2xl border border-gold/30 p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold-light"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Your password"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold-light"
              />
            </div>

            {error && (
              <p className="text-pink text-sm text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-gold hover:bg-yellow-600 text-white font-semibold rounded-xl transition-colors disabled:opacity-50 shadow-sm"
            >
              {loading ? 'Signing in...' : 'Sign In as Owner'}
            </button>
          </form>

          <div className="mt-6 text-center space-y-2">
            <p className="text-sm text-gray-500">
              Don&apos;t have an owner account?{' '}
              <Link href="/auth/owner/signup" className="text-gold font-medium hover:underline">
                Register your business
              </Link>
            </p>
            <p className="text-sm text-gray-400">
              Not an owner?{' '}
              <Link href="/auth/signin" className="text-turquoise-dark font-medium hover:underline">
                User sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
