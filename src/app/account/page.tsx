'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';

export default function AccountPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      setLoading(false);
    });
  }, []);

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  }

  const name = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Guest';
  const initial = name.charAt(0).toUpperCase();
  const isOwner = user?.user_metadata?.role === 'owner';

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 rounded-full border-2 border-turquoise border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="px-5 py-10 max-w-md mx-auto text-center">
        <div className="app-badge w-16 h-16 rounded-2xl mx-auto mb-5">
          <span className="font-serif font-bold italic text-3xl text-[#06201C]">T</span>
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">Join Tble It</h1>
        <p className="text-text-lo mb-8">
          Sign in to write receipt-verified reviews and track your visits.
        </p>
        <Link href="/auth/signin" className="btn-primary w-full py-3.5 mb-3">Log In</Link>
        <Link href="/auth/signup" className="btn-ghost w-full py-3.5">Create Account</Link>
      </div>
    );
  }

  return (
    <div className="px-5 py-6 max-w-md mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-[#04110F] ${isOwner ? 'bg-gold' : 'bg-turquoise'}`}>
          {initial}
        </div>
        <div className="min-w-0">
          <h1 className="text-xl font-bold text-white truncate">{name}</h1>
          <p className="text-text-lo text-sm truncate">{user.email}</p>
          {isOwner && (
            <span className="inline-block mt-1 text-xs px-2 py-0.5 bg-gold/15 text-gold rounded-full font-semibold">
              Business Owner
            </span>
          )}
        </div>
      </div>

      <div className="glass-card divide-y divide-[var(--hairline)] overflow-hidden">
        {isOwner && <Row href="/dashboard" label="Owner Dashboard" />}
        <Row href="/search" label="Find a place to review" />
        <Row href="/map" label="Explore the map" />
        <Row href="/privacy" label="Privacy Policy" />
      </div>

      <button onClick={signOut} className="btn-ghost w-full py-3.5 mt-6 text-pink">
        Sign Out
      </button>
    </div>
  );
}

function Row({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className="flex items-center justify-between px-5 py-4 active:bg-white/5 transition-colors">
      <span className="text-white font-medium">{label}</span>
      <svg className="w-5 h-5 text-text-dim" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </Link>
  );
}
