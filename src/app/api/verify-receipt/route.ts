import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { zodOutputFormat } from '@anthropic-ai/sdk/helpers/zod';
import { z } from 'zod';

export const runtime = 'nodejs';

// Claude reads the receipt image and returns these fields.
const ReceiptSchema = z.object({
  is_receipt: z.boolean().describe('True if the image actually shows a purchase receipt or bill.'),
  merchant_name: z.string().nullable().describe('The business/merchant name printed on the receipt, or null if not legible.'),
  purchase_date: z.string().nullable().describe('The purchase date in ISO format YYYY-MM-DD, or null if not found.'),
  total_amount: z.number().nullable().describe('The receipt total as a number (no currency symbol), or null if not found.'),
  looks_authentic: z.boolean().describe('False if the image appears edited, screenshotted from another app, or otherwise tampered with.'),
});

// Simple in-memory sliding-window rate limit, keyed by client IP.
// (Per-instance — fine for abuse/cost control; swap for Redis/Upstash if you
// run multiple instances and need a shared limit.)
const RATE_LIMIT = 8; // requests
const RATE_WINDOW_MS = 60_000; // per minute
const hits = new Map<string, number[]>();

function rateLimit(ip: string): { ok: boolean; retryAfter: number } {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < RATE_WINDOW_MS);
  if (recent.length >= RATE_LIMIT) {
    const retryAfter = Math.ceil((RATE_WINDOW_MS - (now - recent[0])) / 1000);
    return { ok: false, retryAfter };
  }
  recent.push(now);
  hits.set(ip, recent);
  // Opportunistically drop stale buckets so the Map doesn't grow unbounded.
  if (hits.size > 5000) {
    for (const [key, times] of hits) {
      if (times.every((t) => now - t >= RATE_WINDOW_MS)) hits.delete(key);
    }
  }
  return { ok: true, retryAfter: 0 };
}

const MEDIA_TYPES: Record<string, 'image/jpeg' | 'image/png' | 'image/webp' | 'image/gif'> = {
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
  gif: 'image/gif',
};

/** Loose token-overlap match between the detected merchant and the business name. */
function merchantMatches(detected: string | null, businessName: string): boolean {
  if (!detected) return false;
  const normalize = (s: string) =>
    s.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter((w) => w.length > 2);
  const detectedTokens = new Set(normalize(detected));
  const nameTokens = normalize(businessName);
  if (nameTokens.length === 0) return false;
  const hits = nameTokens.filter((t) => detectedTokens.has(t)).length;
  return hits / nameTokens.length >= 0.5;
}

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    'unknown';
  const limit = rateLimit(ip);
  if (!limit.ok) {
    return NextResponse.json(
      { error: 'Too many verification attempts. Please wait a moment and try again.' },
      { status: 429, headers: { 'Retry-After': String(limit.retryAfter) } }
    );
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: 'Receipt verification is not configured.' },
      { status: 503 }
    );
  }

  let body: { imageBase64?: string; mediaType?: string; businessName?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const { imageBase64, mediaType, businessName } = body;
  if (!imageBase64 || !businessName) {
    return NextResponse.json(
      { error: 'imageBase64 and businessName are required.' },
      { status: 400 }
    );
  }

  const media = MEDIA_TYPES[(mediaType || '').toLowerCase()] ?? 'image/jpeg';
  const client = new Anthropic({ apiKey });

  try {
    const response = await client.messages.parse({
      model: 'claude-opus-4-8',
      max_tokens: 1024,
      system:
        'You are a receipt verification assistant for a local-business review platform. ' +
        'Given a photo of a receipt, extract the merchant name, purchase date, and total, ' +
        'and judge whether the image is a genuine, un-tampered receipt. Be conservative: ' +
        'if the image is not clearly a receipt, set is_receipt to false.',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: { type: 'base64', media_type: media, data: imageBase64 },
            },
            {
              type: 'text',
              text: `This receipt is being used to verify a visit to "${businessName}". Extract the requested fields.`,
            },
          ],
        },
      ],
      output_config: { format: zodOutputFormat(ReceiptSchema) },
    });

    const data = response.parsed_output;
    if (!data) {
      return NextResponse.json({ error: 'Could not read the receipt.' }, { status: 422 });
    }

    const matchedBusinessName = merchantMatches(data.merchant_name, businessName);

    const checks = [
      { label: `Merchant matches "${businessName}"`, passed: matchedBusinessName },
      { label: 'Receipt date found', passed: data.purchase_date != null },
      { label: 'Itemized total found', passed: data.total_amount != null },
      { label: 'No signs of tampering', passed: data.is_receipt && data.looks_authentic },
    ];

    const passedCount = checks.filter((c) => c.passed).length;
    const confidence = Math.min(98, Math.max(20, 25 + passedCount * 18));

    let status: 'verified' | 'pending' | 'unverified';
    if (!data.is_receipt) status = 'unverified';
    else if (matchedBusinessName && data.is_receipt && data.looks_authentic && passedCount >= 3) status = 'verified';
    else if (passedCount >= 2) status = 'pending';
    else status = 'unverified';

    return NextResponse.json({
      status,
      confidence,
      detectedTotal: data.total_amount,
      detectedDate: data.purchase_date,
      matchedBusinessName,
      checks,
    });
  } catch (err) {
    if (err instanceof Anthropic.APIError) {
      console.error(`Receipt verification API error ${err.status}:`, err.message);
    } else {
      console.error('Receipt verification failed:', err);
    }
    return NextResponse.json(
      { error: 'Verification service is temporarily unavailable.' },
      { status: 502 }
    );
  }
}
