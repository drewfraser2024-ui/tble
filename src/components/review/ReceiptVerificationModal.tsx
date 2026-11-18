'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useImageUpload } from '@/hooks/useImageUpload';
import { MAX_IMAGE_SIZE_MB } from '@/lib/constants';
import type { ReceiptScanResult } from '@/types/review';

interface ReceiptVerificationModalProps {
  reviewId: string;
  businessName: string;
  /** Called when the reviewer is finished — verified or skipped. */
  onClose: () => void;
}

type Stage = 'idle' | 'scanning' | 'done' | 'error';

const SCAN_STEPS = [
  'Reading receipt…',
  'Matching merchant', // overridden at render with the business name
  'Extracting date & total',
  'Cross-checking your visit',
];

/* ------------------------------------------------------------------ */
/*  Receipt scan — Claude vision via /api/verify-receipt               */
/* ------------------------------------------------------------------ */

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Strip the "data:image/...;base64," prefix — the API wants raw base64.
      resolve(result.slice(result.indexOf(',') + 1));
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

async function scanReceipt(file: File, businessName: string): Promise<ReceiptScanResult> {
  const imageBase64 = await fileToBase64(file);
  const mediaType = file.name.split('.').pop()?.toLowerCase() || 'jpg';

  const res = await fetch('/api/verify-receipt', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ imageBase64, mediaType, businessName }),
  });

  if (!res.ok) {
    const { error } = await res.json().catch(() => ({ error: '' }));
    throw new Error(error || 'Verification failed');
  }

  return (await res.json()) as ReceiptScanResult;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function ReceiptVerificationModal({
  reviewId,
  businessName,
  onClose,
}: ReceiptVerificationModalProps) {
  const supabase = createClient();
  const { uploadReceipt } = useImageUpload();
  const inputRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [stage, setStage] = useState<Stage>('idle');
  const [activeStep, setActiveStep] = useState(0);
  const [result, setResult] = useState<ReceiptScanResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Clean up object URL.
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  // Close on Escape.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape' && stage !== 'scanning') onClose();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose, stage]);

  const selectFile = useCallback(
    (f: File | undefined) => {
      if (!f) return;
      if (!f.type.startsWith('image/')) {
        setError('Please upload an image of your receipt.');
        return;
      }
      if (f.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) {
        setError(`Receipt must be under ${MAX_IMAGE_SIZE_MB}MB.`);
        return;
      }
      if (preview) URL.revokeObjectURL(preview);
      setError(null);
      setFile(f);
      setPreview(URL.createObjectURL(f));
    },
    [preview]
  );

  async function handleVerify() {
    if (!file) return;
    setStage('scanning');
    setError(null);
    setActiveStep(0);

    try {
      // Kick off the real OCR/verification and the storage upload together;
      // animate the step indicator while they run.
      const scanPromise = scanReceipt(file, businessName);
      for (let i = 0; i < SCAN_STEPS.length; i++) {
        setActiveStep(i);
        await new Promise((r) => setTimeout(r, 450));
      }

      const scan = await scanPromise;
      const { storagePath, publicUrl } = await uploadReceipt(file, reviewId);

      const { error: updateError } = await supabase
        .from('reviews')
        .update({
          verification_status: scan.status,
          receipt_storage_path: storagePath,
          receipt_url: publicUrl,
          receipt_total: scan.detectedTotal,
          receipt_dated_on: scan.detectedDate,
          verification_confidence: scan.confidence,
          verified_at: scan.status === 'verified' ? new Date().toISOString() : null,
        })
        .eq('id', reviewId);

      if (updateError) throw updateError;

      setResult(scan);
      setStage('done');
    } catch (err) {
      console.error('Receipt verification failed:', err);
      setError(
        err instanceof Error && err.message
          ? err.message
          : 'We could not verify your receipt. Please try again.'
      );
      setStage('error');
    }
  }

  const isVerified = result?.status === 'verified';
  const isPending = result?.status === 'pending';

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-0 sm:p-4"
      onClick={() => stage !== 'scanning' && onClose()}
    >
      <div
        className="bg-white w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl shadow-xl max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative px-6 pt-6 pb-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-turquoise/10 flex items-center justify-center">
              <svg className="w-5 h-5 text-turquoise" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 14l2 2 4-4m1 7H8a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-bold text-black leading-tight">Verify your visit</h2>
              <p className="text-xs text-gray-500">Posted to {businessName}</p>
            </div>
          </div>
          {stage !== 'scanning' && (
            <button
              onClick={onClose}
              aria-label="Close"
              className="absolute top-5 right-5 w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        <div className="p-6">
          {/* DONE STATE */}
          {stage === 'done' && result ? (
            <div className="text-center">
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                  isVerified ? 'bg-emerald-50' : isPending ? 'bg-amber-50' : 'bg-gray-100'
                }`}
              >
                <svg
                  className={`w-8 h-8 ${isVerified ? 'text-emerald-500' : isPending ? 'text-amber-500' : 'text-gray-400'}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  {isVerified ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  )}
                </svg>
              </div>
              <h3 className="text-lg font-bold text-black mb-1">
                {isVerified ? 'Visit verified! 🎉' : isPending ? 'Almost there' : 'Thanks!'}
              </h3>
              <p className="text-sm text-gray-500 mb-5">
                {isVerified
                  ? 'Your review now carries a Verified Visit badge — it posts instantly and ranks higher.'
                  : isPending
                  ? 'Your receipt is in for a quick manual check. Your review is live in the meantime.'
                  : 'We couldn’t confidently match this receipt, but your review is still posted.'}
              </p>

              {/* Checks summary */}
              <div className="text-left bg-gray-50 rounded-xl p-4 mb-5 space-y-2">
                {result.checks.map((c) => (
                  <div key={c.label} className="flex items-center gap-2 text-sm">
                    <svg
                      className={`w-4 h-4 shrink-0 ${c.passed ? 'text-emerald-500' : 'text-gray-300'}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      {c.passed ? (
                        <path fillRule="evenodd" d="M16.7 5.3a1 1 0 010 1.4l-7.5 7.5a1 1 0 01-1.4 0L3.3 9.7a1 1 0 011.4-1.4l3.1 3.1 6.8-6.8a1 1 0 011.4 0z" clipRule="evenodd" />
                      ) : (
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM6.7 6.7a1 1 0 011.4 0L10 8.6l1.9-1.9a1 1 0 111.4 1.4L11.4 10l1.9 1.9a1 1 0 01-1.4 1.4L10 11.4l-1.9 1.9a1 1 0 01-1.4-1.4L8.6 10 6.7 8.1a1 1 0 010-1.4z" clipRule="evenodd" />
                      )}
                    </svg>
                    <span className={c.passed ? 'text-gray-700' : 'text-gray-400'}>{c.label}</span>
                  </div>
                ))}
                {(result.detectedTotal != null || result.detectedDate) && (
                  <div className="pt-2 mt-1 border-t border-gray-200 flex items-center justify-between text-xs text-gray-500">
                    {result.detectedDate && <span>Dated {result.detectedDate}</span>}
                    {result.detectedTotal != null && (
                      <span className="font-semibold text-gray-700">${result.detectedTotal.toFixed(2)}</span>
                    )}
                  </div>
                )}
              </div>

              <button
                onClick={onClose}
                className="w-full py-3 px-6 bg-turquoise hover:bg-turquoise-dark text-white font-semibold rounded-xl transition-colors shadow-sm"
              >
                View my review
              </button>
            </div>
          ) : (
            <>
              {/* Pitch */}
              <p className="text-sm text-gray-600 mb-4">
                Snap or upload your receipt to earn a{' '}
                <span className="inline-flex items-center gap-1 font-semibold text-emerald-700">
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 1l2.4 1.9 3-.3 1 2.9 2.6 1.5-1 2.9 1 2.9-2.6 1.5-1 2.9-3-.3L10 19l-2.4-1.9-3 .3-1-2.9L1 13.2l1-2.9-1-2.9 2.6-1.5 1-2.9 3 .3L10 1z" clipRule="evenodd" />
                  </svg>
                  Verified Visit
                </span>{' '}
                badge. Verified reviews post faster and rank higher.
              </p>

              {/* Dropzone / preview */}
              {stage === 'scanning' ? (
                <div className="rounded-xl border border-gray-100 bg-gray-50 p-6">
                  <div className="flex items-center gap-3 mb-4">
                    {preview && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={preview} alt="Receipt" className="w-12 h-16 object-cover rounded-md border border-gray-200" />
                    )}
                    <div className="w-5 h-5 border-2 border-turquoise border-t-transparent rounded-full animate-spin" />
                    <span className="text-sm font-medium text-gray-700">Verifying…</span>
                  </div>
                  <div className="space-y-2">
                    {SCAN_STEPS.map((step, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm">
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            i < activeStep ? 'bg-emerald-400' : i === activeStep ? 'bg-turquoise animate-pulse' : 'bg-gray-200'
                          }`}
                        />
                        <span className={i <= activeStep ? 'text-gray-700' : 'text-gray-300'}>
                          {i === 1 ? `Matching merchant to ${businessName}` : step}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : preview ? (
                <div className="relative rounded-xl overflow-hidden border border-gray-200">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={preview} alt="Receipt preview" className="w-full max-h-64 object-contain bg-gray-50" />
                  <button
                    onClick={() => {
                      if (preview) URL.revokeObjectURL(preview);
                      setFile(null);
                      setPreview(null);
                    }}
                    className="absolute top-2 right-2 w-7 h-7 bg-black/60 rounded-full flex items-center justify-center"
                    aria-label="Remove receipt"
                  >
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ) : (
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragActive(true);
                  }}
                  onDragLeave={() => setDragActive(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setDragActive(false);
                    selectFile(e.dataTransfer.files?.[0]);
                  }}
                  onClick={() => inputRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
                    dragActive ? 'border-turquoise bg-turquoise/5' : 'border-gray-200 hover:border-turquoise-light'
                  }`}
                >
                  <svg className="w-9 h-9 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.66-.9l.82-1.2A2 2 0 0110.07 4h3.86a2 2 0 011.66.9l.82 1.2a2 2 0 001.66.9H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <p className="text-sm text-gray-600">
                    Take a photo or <span className="text-turquoise font-medium">upload your receipt</span>
                  </p>
                  <p className="text-xs text-gray-400 mt-1">JPG or PNG, up to {MAX_IMAGE_SIZE_MB}MB</p>
                  <input
                    ref={inputRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={(e) => selectFile(e.target.files?.[0])}
                    className="hidden"
                  />
                </div>
              )}

              {error && <p className="text-pink text-sm text-center mt-3">{error}</p>}

              {/* Actions */}
              {stage !== 'scanning' && (
                <div className="mt-5 space-y-2">
                  <button
                    onClick={handleVerify}
                    disabled={!file}
                    className="w-full py-3 px-6 bg-turquoise hover:bg-turquoise-dark text-white font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                  >
                    {stage === 'error' ? 'Try again' : 'Scan & verify'}
                  </button>
                  <button
                    onClick={onClose}
                    className="w-full py-2.5 text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    Skip for now
                  </button>
                </div>
              )}

              <p className="text-[11px] text-gray-400 text-center mt-3 leading-relaxed">
                Your receipt is used only to confirm your visit and is never shown publicly.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
