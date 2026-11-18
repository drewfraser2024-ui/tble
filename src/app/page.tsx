'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';

type FormState = {
  name: string;
  category: 'restaurant' | 'business' | 'foodtruck';
  description: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  phone: string;
  website: string;
};

const initialForm: FormState = {
  name: '',
  category: 'restaurant',
  description: '',
  address: '',
  city: '',
  state: 'MD',
  zip_code: '',
  phone: '',
  website: '',
};

const categories = [
  {
    href: '/restaurant',
    title: 'Restaurant / Chef / Baker',
    subtitle: 'Food quality, service & ambiance',
    tint: 'var(--pink)',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M4 3v7a2 2 0 0 0 2 2h0a2 2 0 0 0 2-2V3M6 3v18M14 3c-1.5 1-2 3-2 5s.5 3 2 3 2-1 2-3-.5-4-2-5Zm2 8v10" />
    ),
  },
  {
    href: '/business',
    title: 'Store / Business',
    subtitle: 'Service, experience & quality',
    tint: 'var(--gold)',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M4 9h16l-1-5H5L4 9Zm0 0v10a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V9M9 20v-5h6v5" />
    ),
  },
  {
    href: '/foodtruck',
    title: 'Food Truck / Mobile',
    subtitle: 'Food, speed & setup',
    tint: 'var(--violet)',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M3 6h11v9H3V6Zm11 3h4l3 3v3h-7V9ZM7 18.5A1.5 1.5 0 1 1 7 15.5a1.5 1.5 0 0 1 0 3Zm11 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Z" />
    ),
  },
];

const features = [
  {
    title: 'Receipt-verified',
    body: 'Every review backed by a real receipt, checked by AI.',
    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="m5 13 4 4L19 7" />,
  },
  {
    title: 'Detailed ratings',
    body: 'Rate every aspect — food, service, atmosphere.',
    icon: <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />,
  },
  {
    title: 'Voice reviews',
    body: 'Speak your review — faster than typing.',
    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 15a3 3 0 0 0 3-3V6a3 3 0 1 0-6 0v6a3 3 0 0 0 3 3Zm7-3a7 7 0 0 1-14 0m7 7v3" />,
  },
];

export default function HomePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [form, setForm] = useState<FormState>(initialForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user?.user_metadata?.role === 'owner') {
        router.push('/dashboard');
        return;
      }
      setUser(user);
    });
  }, [router]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => { const next = { ...prev }; delete next[name]; return next; });
    }
  }

  function validate(): boolean {
    const newErrors: Record<string, string> = {};
    if (!form.name.trim()) newErrors.name = 'Business name is required';
    if (!form.address.trim()) newErrors.address = 'Address is required';
    if (!form.city.trim()) newErrors.city = 'City is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate() || !user) return;
    setIsSubmitting(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.from('business_submissions').insert({
        name: form.name.trim(),
        category: form.category,
        description: form.description.trim() || null,
        address: form.address.trim(),
        city: form.city.trim(),
        state: form.state.trim() || null,
        zip_code: form.zip_code.trim() || null,
        phone: form.phone.trim() || null,
        website: form.website.trim() || null,
        submitted_by: user.id,
        submitter_name: user.user_metadata?.full_name || user.email || 'Unknown',
        submitter_email: user.email || null,
      });
      if (error) throw error;
      setSubmitted(true);
    } catch (err) {
      console.error('Submit error:', err);
      setErrors({ form: 'Something went wrong. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* ---------- Hero ---------- */}
      <section className="px-6 pt-10 pb-8 text-center animate-fade-up">
        <div className="app-badge w-[76px] h-[76px] rounded-[22px] mx-auto mb-6">
          <span className="font-serif font-bold italic text-[40px] text-[#06201C] leading-none">T</span>
        </div>
        <h1 className="text-[44px] leading-none font-extrabold tracking-tight text-white">
          Tble It
        </h1>
        <p className="mt-4 text-[22px] font-bold tracking-tight">
          <span className="text-text-mid">Real reviews. </span>
          <span className="text-turquoise">Verified visits.</span>
        </p>
        <div className="mt-6 flex justify-center">
          <span className="verify-pill">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm-1.2 14.2-3.5-3.5 1.4-1.4 2.1 2.1 4.9-4.9 1.4 1.4-6.3 6.3Z" />
            </svg>
            Every review, receipt-verified
          </span>
        </div>
      </section>

      {/* ---------- Categories ---------- */}
      <section className="px-5 mt-4">
        <h2 className="text-sm font-semibold text-text-lo uppercase tracking-wider px-1 mb-3">
          What are you reviewing?
        </h2>
        <div className="space-y-3">
          {categories.map((c) => (
            <Link key={c.href} href={c.href} className="glass-card glass-card-hover flex items-center gap-4 p-4">
              <span
                className="shrink-0 w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ background: `color-mix(in srgb, ${c.tint} 16%, transparent)` }}
              >
                <svg className="w-6 h-6" fill="none" stroke={c.tint} viewBox="0 0 24 24">{c.icon}</svg>
              </span>
              <span className="flex-1 min-w-0">
                <span className="block font-bold text-white">{c.title}</span>
                <span className="block text-sm text-text-lo">{c.subtitle}</span>
              </span>
              <svg className="w-5 h-5 text-text-dim shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          ))}
        </div>
      </section>

      {/* ---------- Why Tble It ---------- */}
      <section className="px-5 mt-9">
        <h2 className="text-sm font-semibold text-text-lo uppercase tracking-wider px-1 mb-3">
          Why Tble It
        </h2>
        <div className="space-y-3">
          {features.map((f) => (
            <div key={f.title} className="glass-card flex items-center gap-4 p-4">
              <span className="shrink-0 w-10 h-10 rounded-full bg-turquoise/15 flex items-center justify-center">
                <svg className="w-5 h-5 text-turquoise" fill={f.title === 'Detailed ratings' ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">{f.icon}</svg>
              </span>
              <div>
                <p className="font-bold text-white">{f.title}</p>
                <p className="text-sm text-text-lo">{f.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- Submit a business ---------- */}
      <section id="submit" className="px-5 mt-9 mb-10 scroll-mt-20">
        {!showForm ? (
          <div className="glass-card p-6 text-center">
            <p className="text-text-mid mb-4">Know a great spot that&apos;s not on Tble It yet?</p>
            <button onClick={() => setShowForm(true)} className="btn-primary px-6 py-3 mx-auto">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Submit a Business
            </button>
          </div>
        ) : !user ? (
          <div className="glass-card p-8 text-center">
            <h2 className="text-xl font-bold text-white mb-2">Sign in to submit</h2>
            <p className="text-text-lo text-sm mb-6">You need an account to submit a business.</p>
            <Link href="/auth/signin" className="btn-primary px-6 py-3 inline-flex">Sign In</Link>
          </div>
        ) : submitted ? (
          <div className="glass-card p-8 text-center">
            <div className="w-14 h-14 rounded-full bg-turquoise/15 flex items-center justify-center mx-auto mb-5">
              <svg className="w-7 h-7 text-turquoise" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Submission received!</h2>
            <p className="text-text-lo text-sm mb-6">
              Thanks for submitting <span className="font-semibold text-white">{form.name}</span>. We&apos;ll review it and add it to Tble It if approved.
            </p>
            <button onClick={() => { setForm(initialForm); setSubmitted(false); }} className="btn-primary px-5 py-3 mx-auto">
              Submit Another
            </button>
          </div>
        ) : (
          <div>
            <div className="mb-4 text-center">
              <h2 className="text-xl font-bold text-white mb-1">Submit a Business</h2>
              <p className="text-text-lo text-sm">We&apos;ll review it and add it to Tble It.</p>
            </div>
            <form onSubmit={handleSubmit} className="glass-card p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-mid mb-1.5">Business Name <span className="text-pink">*</span></label>
                <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="e.g. Joe's Crab Shack" className="field" />
                {errors.name && <p className="text-pink text-sm mt-1">{errors.name}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-text-mid mb-1.5">Category <span className="text-pink">*</span></label>
                <select name="category" value={form.category} onChange={handleChange} className="field">
                  <option value="restaurant">Restaurant / Chef / Baker</option>
                  <option value="business">Store / Business</option>
                  <option value="foodtruck">Food Truck / Mobile</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-mid mb-1.5">Description</label>
                <textarea name="description" value={form.description} onChange={handleChange} rows={3} placeholder="Tell us about this place..." className="field resize-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-mid mb-1.5">Address <span className="text-pink">*</span></label>
                <input type="text" name="address" value={form.address} onChange={handleChange} placeholder="123 Main St" className="field" />
                {errors.address && <p className="text-pink text-sm mt-1">{errors.address}</p>}
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-sm font-medium text-text-mid mb-1.5">City <span className="text-pink">*</span></label>
                  <input type="text" name="city" value={form.city} onChange={handleChange} placeholder="Baltimore" className="field" />
                  {errors.city && <p className="text-pink text-sm mt-1">{errors.city}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-mid mb-1.5">State</label>
                  <input type="text" name="state" value={form.state} onChange={handleChange} placeholder="MD" className="field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-mid mb-1.5">Zip</label>
                  <input type="text" name="zip_code" value={form.zip_code} onChange={handleChange} placeholder="21201" className="field" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-text-mid mb-1.5">Phone</label>
                  <input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="(410) 555-1234" className="field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-mid mb-1.5">Website</label>
                  <input type="url" name="website" value={form.website} onChange={handleChange} placeholder="https://example.com" className="field" />
                </div>
              </div>
              {errors.form && <p className="text-pink text-sm text-center">{errors.form}</p>}
              <div className="flex gap-3 pt-1">
                <button type="submit" disabled={isSubmitting} className="btn-primary flex-1 py-3">
                  {isSubmitting ? 'Submitting...' : 'Submit for Review'}
                </button>
                <button type="button" onClick={() => { setShowForm(false); setForm(initialForm); setErrors({}); }} className="btn-ghost px-5 py-3">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
        <p className="text-center text-xs text-text-dim mt-6">tbleit.app</p>
      </section>
    </div>
  );
}
