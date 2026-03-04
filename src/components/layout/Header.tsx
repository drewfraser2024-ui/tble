'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';

export default function Header() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [user, setUser] = useState<User | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const supabase = createClient();

    // Get initial session
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  }

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    setShowDropdown(false);
    router.push('/');
    router.refresh();
  }

  const displayName = user?.user_metadata?.full_name || user?.email || '';
  const initial = displayName.charAt(0).toUpperCase();
  const isOwner = user?.user_metadata?.role === 'owner';

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo-icon.svg" alt="Tble" width={36} height={36} />
            <span className="text-xl font-bold text-black">
              Tble
            </span>
          </Link>

          <form onSubmit={handleSearch} className="hidden sm:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search businesses..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-200 focus:outline-none focus:border-turquoise focus:ring-2 focus:ring-turquoise-light text-sm"
              />
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </form>

          <nav className="flex items-center gap-4">
            <Link
              href="/map"
              className="text-sm font-medium text-gray-600 hover:text-turquoise-dark transition-colors"
            >
              Map
            </Link>

            {user ? (
              <div ref={dropdownRef} className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white transition-colors ${
                    isOwner ? 'bg-gold hover:bg-yellow-600' : 'bg-turquoise hover:bg-turquoise-dark'
                  }`}
                >
                  {initial}
                </button>

                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl border border-gray-100 shadow-lg py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-semibold text-black truncate">{displayName}</p>
                      <p className="text-xs text-gray-400 truncate">{user.email}</p>
                      {isOwner && (
                        <span className="inline-block mt-1 text-xs px-2 py-0.5 bg-gold/10 text-gold rounded-full font-medium">
                          Business Owner
                        </span>
                      )}
                    </div>
                    <button
                      onClick={handleSignOut}
                      className="w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-pink transition-colors"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/auth/signin"
                  className="text-sm font-medium text-gray-600 hover:text-turquoise-dark transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/owner/signin"
                  className="text-xs px-3 py-1.5 bg-gold/10 text-gold font-medium rounded-full hover:bg-gold/20 transition-colors"
                >
                  Owner
                </Link>
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
