'use client';

import { useState } from 'react';

/* ------------------------------------------------------------------ */
/*  Plan configuration – edit prices & features here                  */
/* ------------------------------------------------------------------ */

const PLANS = [
  {
    id: 'premium',
    name: 'Premium',
    price: 29,
    period: '/mo',
    badge: null,
    description: 'Boost your visibility and unlock smart insights.',
    color: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      borderHover: 'hover:border-blue-400',
      shadow: 'hover:shadow-blue-100',
      badge: '',
      badgeBg: '',
      icon: 'text-blue-500',
      iconBg: 'bg-blue-100',
      button: 'bg-blue-600 hover:bg-blue-700',
      buttonRing: 'focus:ring-blue-300',
      accent: 'text-blue-600',
      headerGradient: 'from-blue-600 to-blue-500',
    },
    features: [
      { icon: 'placement', label: 'Front page placement for your listing' },
      { icon: 'analytics', label: 'Access to analytics dashboard' },
      { icon: 'ai', label: 'AI-powered insights & recommendations' },
      { icon: 'verify', label: 'AI review authenticity verification' },
    ],
  },
  {
    id: 'gold',
    name: 'Gold',
    price: 59,
    period: '/mo',
    badge: 'Most Popular',
    description: 'Everything in Premium plus promotions & targeting.',
    color: {
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      borderHover: 'hover:border-amber-400',
      shadow: 'hover:shadow-amber-100',
      badge: 'text-amber-700',
      badgeBg: 'bg-amber-100',
      icon: 'text-amber-500',
      iconBg: 'bg-amber-100',
      button: 'bg-amber-500 hover:bg-amber-600',
      buttonRing: 'focus:ring-amber-300',
      accent: 'text-amber-600',
      headerGradient: 'from-amber-500 to-yellow-500',
    },
    features: [
      { icon: 'check', label: 'All Premium features included' },
      { icon: 'promo', label: 'Promote seasonal & special offers' },
      { icon: 'analytics', label: 'Enhanced analytics dashboard' },
      { icon: 'target', label: 'Target customers by location & keyword' },
      { icon: 'badge', label: 'Gold Membership profile badge' },
      { icon: 'dispute', label: 'Dispute & report suspicious reviews' },
    ],
  },
  {
    id: 'platinum',
    name: 'Platinum',
    price: 99,
    period: '/mo',
    badge: 'Best Value',
    description: 'The ultimate toolkit for serious business growth.',
    color: {
      bg: 'bg-violet/5',
      border: 'border-violet/20',
      borderHover: 'hover:border-violet/50',
      shadow: 'hover:shadow-violet-light/30',
      badge: 'text-violet-dark',
      badgeBg: 'bg-violet-light/30',
      icon: 'text-violet',
      iconBg: 'bg-violet-light/30',
      button: 'bg-gradient-to-r from-violet-dark to-violet hover:from-violet hover:to-violet-dark',
      buttonRing: 'focus:ring-violet-light',
      accent: 'text-violet-dark',
      headerGradient: 'from-violet-dark to-violet',
    },
    features: [
      { icon: 'check', label: 'All Gold features included' },
      { icon: 'cert', label: 'Upload & display business certifications' },
      { icon: 'ads', label: 'Dedicated ads & promotional section' },
      { icon: 'video', label: 'Upload custom business videos' },
      { icon: 'showcase', label: 'Enhanced review showcase section' },
      { icon: 'spotlight', label: '"Customer of the Month" spotlight' },
      { icon: 'badge', label: 'Platinum premium badge & styling' },
    ],
  },
] as const;

/* ------------------------------------------------------------------ */
/*  Icons                                                              */
/* ------------------------------------------------------------------ */

function FeatureIcon({ icon, className }: { icon: string; className: string }) {
  const base = `w-5 h-5 ${className}`;
  switch (icon) {
    case 'placement':
      return (
        <svg className={base} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
        </svg>
      );
    case 'analytics':
      return (
        <svg className={base} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      );
    case 'ai':
      return (
        <svg className={base} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      );
    case 'verify':
      return (
        <svg className={base} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      );
    case 'promo':
      return (
        <svg className={base} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
        </svg>
      );
    case 'target':
      return (
        <svg className={base} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      );
    case 'badge':
      return (
        <svg className={base} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      );
    case 'dispute':
      return (
        <svg className={base} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
        </svg>
      );
    case 'cert':
      return (
        <svg className={base} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
        </svg>
      );
    case 'ads':
      return (
        <svg className={base} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6" />
        </svg>
      );
    case 'video':
      return (
        <svg className={base} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
        </svg>
      );
    case 'showcase':
      return (
        <svg className={base} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
        </svg>
      );
    case 'spotlight':
      return (
        <svg className={base} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
        </svg>
      );
    default: // 'check'
      return (
        <svg className={base} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      );
  }
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function MembershipPlans() {
  const [annual, setAnnual] = useState(false);

  return (
    <section>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-xl font-bold text-black">Upgrade Your Membership</h2>
          <p className="text-gray-500 text-sm mt-1">
            Unlock powerful tools to grow your business on Tble.
          </p>
        </div>

        {/* Billing toggle */}
        <div className="flex items-center gap-3 bg-gray-100 rounded-full p-1">
          <button
            onClick={() => setAnnual(false)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
              !annual ? 'bg-white text-black shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setAnnual(true)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
              annual ? 'bg-white text-black shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Annual
            <span className="ml-1.5 text-xs text-emerald-600 font-semibold">Save 20%</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {PLANS.map((plan) => {
          const price = annual ? Math.round(plan.price * 0.8) : plan.price;
          const c = plan.color;

          return (
            <div
              key={plan.id}
              className={`
                relative rounded-2xl border-2 ${c.border} ${c.borderHover} ${c.bg}
                p-[2px] transition-all duration-300 ${c.shadow}
                hover:shadow-xl hover:-translate-y-1 group
              `}
            >
              {/* Badge */}
              {plan.badge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-10">
                  <span
                    className={`inline-flex items-center gap-1 px-3.5 py-1 rounded-full text-xs font-bold ${c.badgeBg} ${c.badge} shadow-sm`}
                  >
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                    {plan.badge}
                  </span>
                </div>
              )}

              <div className="bg-white rounded-xl p-6 h-full flex flex-col">
                {/* Header */}
                <div className="mb-6">
                  <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg ${c.iconBg} mb-4`}>
                    <svg className={`w-4 h-4 ${c.icon}`} fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                    <span className={`text-sm font-bold ${c.accent}`}>{plan.name}</span>
                  </div>
                  <div className="flex items-baseline gap-1 mb-2">
                    <span className="text-4xl font-extrabold text-black">${price}</span>
                    <span className="text-gray-400 text-sm">{plan.period}</span>
                  </div>
                  <p className="text-gray-500 text-sm">{plan.description}</p>
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className={`w-7 h-7 rounded-lg ${c.iconBg} flex items-center justify-center shrink-0 mt-0.5`}>
                        <FeatureIcon icon={f.icon} className={c.icon} />
                      </div>
                      <span className="text-sm text-gray-700 leading-snug">{f.label}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <button
                  className={`
                    w-full py-3 rounded-xl text-white font-semibold text-sm
                    ${c.button} ${c.buttonRing}
                    focus:outline-none focus:ring-4
                    transition-all duration-200
                    shadow-sm hover:shadow-md
                    active:scale-[0.98]
                  `}
                >
                  Upgrade to {plan.name}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
