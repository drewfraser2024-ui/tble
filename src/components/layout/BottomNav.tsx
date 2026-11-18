'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

type Tab = {
  href: string;
  label: string;
  icon: (active: boolean) => React.ReactNode;
};

const tabs: Tab[] = [
  {
    href: '/',
    label: 'Home',
    icon: (a) => (
      <svg className="w-6 h-6" fill={a ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 11.5 12 4l9 7.5" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M5 10v9a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-9" fill={a ? 'currentColor' : 'none'} />
      </svg>
    ),
  },
  {
    href: '/search',
    label: 'Search',
    icon: () => (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <circle cx="11" cy="11" r="7" strokeWidth={1.8} />
        <path strokeLinecap="round" strokeWidth={1.8} d="m20 20-3.2-3.2" />
      </svg>
    ),
  },
  {
    href: '/map',
    label: 'Map',
    icon: (a) => (
      <svg className="w-6 h-6" fill={a ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 21s-7-5.5-7-11a7 7 0 1 1 14 0c0 5.5-7 11-7 11Z" />
        <circle cx="12" cy="10" r="2.4" strokeWidth={1.8} fill={a ? '#05070A' : 'none'} />
      </svg>
    ),
  },
  {
    href: '/account',
    label: 'Profile',
    icon: (a) => (
      <svg className="w-6 h-6" fill={a ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
        <circle cx="12" cy="8" r="3.4" strokeWidth={1.8} />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M5 20c0-3.3 3.1-5.5 7-5.5s7 2.2 7 5.5" />
      </svg>
    ),
  },
];

export default function BottomNav() {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 pb-safe bg-ink-950/80 backdrop-blur-xl border-t border-[var(--hairline)]">
      <div className="relative max-w-2xl mx-auto h-[64px] px-2 flex items-center justify-around">
        {/* first two tabs */}
        {tabs.slice(0, 2).map((t) => (
          <TabLink key={t.href} tab={t} active={isActive(t.href)} />
        ))}

        {/* center review action */}
        <Link
          href="/search"
          className="relative -mt-8 flex flex-col items-center"
          aria-label="Write a review"
        >
          <span className="w-14 h-14 rounded-2xl app-badge flex items-center justify-center active:scale-95 transition-transform">
            <svg className="w-7 h-7 text-[#04110F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 5v14M5 12h14" />
            </svg>
          </span>
          <span className="text-[10px] font-semibold text-text-lo mt-1">Review</span>
        </Link>

        {/* last two tabs */}
        {tabs.slice(2).map((t) => (
          <TabLink key={t.href} tab={t} active={isActive(t.href)} />
        ))}
      </div>
    </nav>
  );
}

function TabLink({ tab, active }: { tab: Tab; active: boolean }) {
  return (
    <Link
      href={tab.href}
      className={`flex flex-col items-center gap-1 w-14 py-1 transition-colors ${
        active ? 'text-turquoise' : 'text-text-dim'
      }`}
    >
      {tab.icon(active)}
      <span className="text-[10px] font-semibold">{tab.label}</span>
    </Link>
  );
}
