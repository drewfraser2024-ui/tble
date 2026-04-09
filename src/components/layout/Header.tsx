'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';

const categories = [
  {
    label: 'Restaurants',
    href: '/restaurant',
    items: [
      { label: 'All Restaurants', href: '/restaurant' },
      { label: 'Write a Review', href: '/restaurant', description: 'Share your experience' },
    ],
  },
  {
    label: 'Stores & Business',
    href: '/business',
    items: [
      { label: 'All Stores', href: '/business' },
      { label: 'Write a Review', href: '/business', description: 'Rate a store' },
    ],
  },
  {
    label: 'Food Trucks',
    href: '/foodtruck',
    items: [
      { label: 'All Food Trucks', href: '/foodtruck' },
      { label: 'Write a Review', href: '/foodtruck', description: 'Rate a food truck' },
    ],
  },
  {
    label: 'Map',
    href: '/map',
    items: [
      { label: 'Explore Map', href: '/map', description: 'Find places near you' },
    ],
  },
];

export default function Header() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('');
  const [user, setUser] = useState<User | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const catBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
      if (catBarRef.current && !catBarRef.current.contains(e.target as Node)) {
        setActiveCategory(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set('q', query.trim());
    if (location.trim()) params.set('location', location.trim());
    if (params.toString()) {
      router.push(`/search?${params.toString()}`);
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
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      {/* Main Header Bar */}
      <div className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2 shrink-0">
              <Image src="/logo-icon.svg" alt="Tble" width={36} height={36} />
              <span className="text-xl font-bold text-black">Tble</span>
            </Link>

            {/* Search Bar - Yelp style with query + location */}
            <form onSubmit={handleSearch} className="hidden sm:flex flex-1 max-w-xl mx-6">
              <div className="flex w-full rounded-lg border border-gray-300 overflow-hidden focus-within:border-turquoise focus-within:ring-2 focus-within:ring-turquoise-light">
                <input
                  type="text"
                  placeholder="Search businesses..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="flex-1 px-4 py-2 text-sm focus:outline-none border-r border-gray-200"
                />
                <input
                  type="text"
                  placeholder="City, State"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-36 px-4 py-2 text-sm focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-4 bg-turquoise hover:bg-turquoise-dark transition-colors"
                >
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
            </form>

            <nav className="flex items-center gap-3">
              {user && (
                <Link
                  href="/#submit"
                  className="hidden sm:inline-flex text-sm font-medium text-gray-600 hover:text-turquoise-dark transition-colors"
                >
                  Write a Review
                </Link>
              )}

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
                      {isOwner && (
                        <Link
                          href="/dashboard"
                          onClick={() => setShowDropdown(false)}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-gold transition-colors"
                        >
                          Dashboard
                        </Link>
                      )}
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
                    Log In
                  </Link>
                  <Link
                    href="/auth/signup"
                    className="text-sm px-4 py-1.5 bg-turquoise hover:bg-turquoise-dark text-white font-semibold rounded-lg transition-colors"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </nav>
          </div>
        </div>
      </div>

      {/* Category Navigation Bar */}
      <div ref={catBarRef} className="hidden sm:block bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-1 h-10">
            {categories.map((cat) => (
              <div key={cat.label} className="relative">
                <button
                  onMouseEnter={() => setActiveCategory(cat.label)}
                  onClick={() => {
                    router.push(cat.href);
                    setActiveCategory(null);
                  }}
                  className={`flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                    activeCategory === cat.label
                      ? 'text-turquoise-dark bg-turquoise/5'
                      : 'text-gray-600 hover:text-black hover:bg-gray-50'
                  }`}
                >
                  {cat.label}
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {activeCategory === cat.label && (
                  <div
                    onMouseLeave={() => setActiveCategory(null)}
                    className="absolute left-0 top-full mt-1 w-52 bg-white rounded-xl border border-gray-100 shadow-lg py-2 z-50"
                  >
                    {cat.items.map((item) => (
                      <Link
                        key={item.label}
                        href={item.href}
                        onClick={() => setActiveCategory(null)}
                        className="block px-4 py-2 hover:bg-gray-50 transition-colors"
                      >
                        <span className="text-sm font-medium text-black">{item.label}</span>
                        {item.description && (
                          <span className="block text-xs text-gray-400">{item.description}</span>
                        )}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}

            <div className="relative">
              <button
                onMouseEnter={() => setActiveCategory('more')}
                className={`flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  activeCategory === 'more'
                    ? 'text-turquoise-dark bg-turquoise/5'
                    : 'text-gray-600 hover:text-black hover:bg-gray-50'
                }`}
              >
                More
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {activeCategory === 'more' && (
                <div
                  onMouseLeave={() => setActiveCategory(null)}
                  className="absolute left-0 top-full mt-1 w-52 bg-white rounded-xl border border-gray-100 shadow-lg py-2 z-50"
                >
                  <Link href="/search" onClick={() => setActiveCategory(null)} className="block px-4 py-2 hover:bg-gray-50 transition-colors">
                    <span className="text-sm font-medium text-black">Search All</span>
                    <span className="block text-xs text-gray-400">Find any business</span>
                  </Link>
                  <Link href="/map" onClick={() => setActiveCategory(null)} className="block px-4 py-2 hover:bg-gray-50 transition-colors">
                    <span className="text-sm font-medium text-black">Interactive Map</span>
                    <span className="block text-xs text-gray-400">Explore nearby</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
