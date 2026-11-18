'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';

export default function AppBar() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const displayName = user?.user_metadata?.full_name || user?.email || '';
  const initial = displayName.charAt(0).toUpperCase() || 'G';
  const isOwner = user?.user_metadata?.role === 'owner';
  const isHome = pathname === '/';

  return (
    <header className="fixed top-0 inset-x-0 z-50 h-appbar pt-safe bg-ink-950/70 backdrop-blur-xl border-b border-[var(--hairline)]">
      <div className="h-[56px] px-4 flex items-center justify-between max-w-2xl mx-auto">
        {/* Left: back on inner pages, logo on home */}
        {isHome ? (
          <Link href="/" className="flex items-center gap-2">
            <span className="app-badge w-8 h-8 rounded-[10px]">
              <span className="font-serif font-bold text-[18px] text-[#06201C] italic">T</span>
            </span>
            <span className="text-[19px] font-bold tracking-tight text-white">
              Tble<span className="text-turquoise"> It</span>
            </span>
          </Link>
        ) : (
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1.5 text-text-mid active:scale-95 transition-transform -ml-1 pr-2 py-1"
            aria-label="Go back"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}

        {/* Right: avatar or sign in */}
        {user ? (
          <Link
            href={isOwner ? '/dashboard' : '/account'}
            className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-[#04110F] ${
              isOwner ? 'bg-gold' : 'bg-turquoise'
            }`}
          >
            {initial}
          </Link>
        ) : (
          <Link
            href="/auth/signin"
            className="text-sm font-semibold text-text-mid hover:text-white transition-colors px-3 py-1.5"
          >
            Log In
          </Link>
        )}
      </div>
    </header>
  );
}
