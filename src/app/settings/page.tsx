'use client';

import Link from 'next/link';
import { useEffect, useState, useCallback } from 'react';

type Settings = {
  textScale: number;
  boldText: boolean;
  reduceMotion: boolean;
};

const DEFAULTS: Settings = { textScale: 1, boldText: false, reduceMotion: false };

const TEXT_SIZES = [
  { label: 'S', scale: 0.9, name: 'Small' },
  { label: 'M', scale: 1, name: 'Default' },
  { label: 'L', scale: 1.15, name: 'Large' },
  { label: 'XL', scale: 1.3, name: 'Extra Large' },
];

function load(): Settings {
  if (typeof window === 'undefined') return DEFAULTS;
  try {
    return { ...DEFAULTS, ...JSON.parse(localStorage.getItem('tbleit:settings') || '{}') };
  } catch {
    return DEFAULTS;
  }
}

function apply(s: Settings) {
  const d = document.documentElement;
  d.style.fontSize = `${s.textScale * 100}%`;
  if (s.reduceMotion) d.setAttribute('data-reduce-motion', 'true');
  else d.removeAttribute('data-reduce-motion');
  if (s.boldText) d.setAttribute('data-bold-text', 'true');
  else d.removeAttribute('data-bold-text');
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>(DEFAULTS);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setSettings(load());
    setReady(true);
  }, []);

  const update = useCallback((patch: Partial<Settings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...patch };
      try {
        localStorage.setItem('tbleit:settings', JSON.stringify(next));
      } catch {}
      apply(next);
      return next;
    });
  }, []);

  if (!ready) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 rounded-full border-2 border-turquoise border-t-transparent animate-spin" />
      </div>
    );
  }

  const currentSize = TEXT_SIZES.find((t) => t.scale === settings.textScale) ?? TEXT_SIZES[1];

  return (
    <div className="px-5 py-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold text-white mb-6">Settings</h1>

      {/* ---------- Display ---------- */}
      <SectionLabel>Display</SectionLabel>

      {/* Text size */}
      <div className="glass-card p-5 mb-3">
        <div className="flex items-center justify-between mb-4">
          <span className="font-semibold text-white">Text size</span>
          <span className="text-sm text-turquoise font-semibold">{currentSize.name}</span>
        </div>
        <div className="flex items-center gap-2 bg-white/5 border border-[var(--hairline)] rounded-xl p-1">
          {TEXT_SIZES.map((t) => {
            const active = t.scale === settings.textScale;
            return (
              <button
                key={t.label}
                onClick={() => update({ textScale: t.scale })}
                className={`flex-1 rounded-lg py-2 font-bold transition-colors ${
                  active ? 'bg-turquoise text-[#04110F]' : 'text-text-lo hover:text-white'
                }`}
                style={{ fontSize: `${0.75 + t.scale * 0.35}rem` }}
                aria-pressed={active}
              >
                {t.label}
              </button>
            );
          })}
        </div>
        <p className="mt-4 text-text-mid leading-relaxed">
          The quick brown fox jumps over the lazy dog. This preview shows your selected text size.
        </p>
      </div>

      {/* Bold text */}
      <Toggle
        label="Bold text"
        description="Make text heavier and easier to read"
        checked={settings.boldText}
        onChange={(v) => update({ boldText: v })}
      />

      {/* Reduce motion */}
      <Toggle
        label="Reduce motion"
        description="Minimize animations and transitions"
        checked={settings.reduceMotion}
        onChange={(v) => update({ reduceMotion: v })}
      />

      {/* Theme (locked to dark for now) */}
      <div className="glass-card p-5 mb-3 flex items-center justify-between">
        <div>
          <p className="font-semibold text-white">Appearance</p>
          <p className="text-sm text-text-lo">Dark</p>
        </div>
        <span className="text-xs text-text-dim bg-white/5 border border-[var(--hairline)] rounded-full px-3 py-1">
          Default
        </span>
      </div>

      {/* ---------- About ---------- */}
      <SectionLabel className="mt-7">About</SectionLabel>
      <div className="glass-card divide-y divide-[var(--hairline)] overflow-hidden mb-6">
        <Row href="/privacy" label="Privacy Policy" />
        <Row href="/account" label="Account" />
      </div>

      <button
        onClick={() => update(DEFAULTS)}
        className="btn-ghost w-full py-3.5 text-text-lo"
      >
        Reset to defaults
      </button>

      <p className="text-center text-xs text-text-dim mt-6">Tble It · tbleit.app</p>
    </div>
  );
}

function SectionLabel({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <h2 className={`text-sm font-semibold text-text-lo uppercase tracking-wider px-1 mb-3 ${className}`}>
      {children}
    </h2>
  );
}

function Toggle({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className="glass-card p-5 mb-3 w-full flex items-center justify-between text-left"
      aria-pressed={checked}
    >
      <div className="pr-4">
        <p className="font-semibold text-white">{label}</p>
        <p className="text-sm text-text-lo">{description}</p>
      </div>
      <span
        className={`shrink-0 w-12 h-7 rounded-full p-1 transition-colors ${
          checked ? 'bg-turquoise' : 'bg-white/15'
        }`}
      >
        <span
          className={`block w-5 h-5 rounded-full bg-white transition-transform ${
            checked ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </span>
    </button>
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
