'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
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

export default function SubmitBusinessPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<FormState>(initialForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      setLoading(false);
    });
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
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

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-turquoise border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="max-w-md mx-auto text-center bg-white rounded-2xl border border-gray-100 p-10 shadow-sm">
          <div className="w-14 h-14 rounded-full bg-turquoise/10 flex items-center justify-center mx-auto mb-5">
            <svg className="w-7 h-7 text-turquoise" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-black mb-2">Sign in to submit</h2>
          <p className="text-gray-500 text-sm mb-6">
            You need to be signed in to submit a business for review.
          </p>
          <Link
            href="/auth/signin"
            className="inline-block px-6 py-2.5 bg-turquoise hover:bg-turquoise-dark text-white font-semibold rounded-xl transition-colors"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="max-w-md mx-auto text-center bg-white rounded-2xl border border-gray-100 p-10 shadow-sm">
          <div className="w-14 h-14 rounded-full bg-turquoise/10 flex items-center justify-center mx-auto mb-5">
            <svg className="w-7 h-7 text-turquoise" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-black mb-2">Submission received!</h2>
          <p className="text-gray-500 text-sm mb-6">
            Thanks for submitting <span className="font-semibold text-black">{form.name}</span>. Our team will review it and add it to Tble if approved.
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => { setForm(initialForm); setSubmitted(false); }}
              className="px-5 py-2.5 bg-turquoise hover:bg-turquoise-dark text-white font-semibold rounded-xl transition-colors"
            >
              Submit Another
            </button>
            <Link
              href="/"
              className="px-5 py-2.5 border border-gray-200 text-gray-600 font-medium rounded-xl hover:bg-gray-50 transition-colors"
            >
              Go Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-black mb-2">Submit a Business</h1>
        <p className="text-gray-500">
          Know a great spot? Submit it for review and we&apos;ll add it to Tble.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm space-y-5">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-black mb-1.5">
            Business Name <span className="text-pink">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="e.g. Joe's Crab Shack"
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-turquoise focus:ring-2 focus:ring-turquoise-light text-sm"
          />
          {errors.name && <p className="text-pink text-sm mt-1">{errors.name}</p>}
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-black mb-1.5">
            Category <span className="text-pink">*</span>
          </label>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-turquoise focus:ring-2 focus:ring-turquoise-light text-sm bg-white"
          >
            <option value="restaurant">Restaurant / Chef / Baker</option>
            <option value="business">Store / Business</option>
            <option value="foodtruck">Food Truck / Mobile</option>
          </select>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-black mb-1.5">
            Description
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={3}
            placeholder="Tell us about this place..."
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-turquoise focus:ring-2 focus:ring-turquoise-light text-sm resize-none"
          />
        </div>

        {/* Address */}
        <div>
          <label className="block text-sm font-medium text-black mb-1.5">
            Address <span className="text-pink">*</span>
          </label>
          <input
            type="text"
            name="address"
            value={form.address}
            onChange={handleChange}
            placeholder="123 Main St"
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-turquoise focus:ring-2 focus:ring-turquoise-light text-sm"
          />
          {errors.address && <p className="text-pink text-sm mt-1">{errors.address}</p>}
        </div>

        {/* City, State, Zip */}
        <div className="grid grid-cols-3 gap-3">
          <div className="col-span-1">
            <label className="block text-sm font-medium text-black mb-1.5">
              City <span className="text-pink">*</span>
            </label>
            <input
              type="text"
              name="city"
              value={form.city}
              onChange={handleChange}
              placeholder="Baltimore"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-turquoise focus:ring-2 focus:ring-turquoise-light text-sm"
            />
            {errors.city && <p className="text-pink text-sm mt-1">{errors.city}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-black mb-1.5">State</label>
            <input
              type="text"
              name="state"
              value={form.state}
              onChange={handleChange}
              placeholder="MD"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-turquoise focus:ring-2 focus:ring-turquoise-light text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-black mb-1.5">Zip Code</label>
            <input
              type="text"
              name="zip_code"
              value={form.zip_code}
              onChange={handleChange}
              placeholder="21201"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-turquoise focus:ring-2 focus:ring-turquoise-light text-sm"
            />
          </div>
        </div>

        {/* Phone & Website */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-black mb-1.5">Phone</label>
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="(410) 555-1234"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-turquoise focus:ring-2 focus:ring-turquoise-light text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-black mb-1.5">Website</label>
            <input
              type="url"
              name="website"
              value={form.website}
              onChange={handleChange}
              placeholder="https://example.com"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-turquoise focus:ring-2 focus:ring-turquoise-light text-sm"
            />
          </div>
        </div>

        {errors.form && (
          <p className="text-pink text-sm text-center">{errors.form}</p>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 bg-turquoise hover:bg-turquoise-dark text-white font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Submitting...' : 'Submit for Review'}
        </button>

        <p className="text-xs text-gray-400 text-center">
          Submissions are reviewed by our team before being listed on Tble.
        </p>
      </form>
    </div>
  );
}
