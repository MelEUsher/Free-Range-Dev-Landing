import { NextResponse, type NextRequest } from 'next/server';

type Bucket = {
  tokens: number;
  lastRefill: number;
};

const WINDOW_MS = 5 * 60 * 1000;
const MAX_REQUESTS = 60;
const buckets = new Map<string, Bucket>();

const ADDITIONAL_SECURITY_HEADERS: Record<string, string> = {
  'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=(), usb=()',
};

const CSP_TEMPLATE =
  "default-src 'self'; script-src 'self' 'nonce-${nonce}'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self' https://fonts.gstatic.com data:; connect-src 'self';";

function generateNonce() {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');
}

function getClientKey(request: NextRequest) {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0]?.trim() ?? 'unknown';
  }

  const headerFallbacks = [
    'x-real-ip',
    'cf-connecting-ip',
    'x-client-ip',
    'fastly-client-ip',
  ];

  for (const header of headerFallbacks) {
    const value = request.headers.get(header);
    if (value) {
      return value;
    }
  }

  return request.nextUrl.hostname ?? 'unknown';
}

function refill(bucket: Bucket, now: number) {
  const elapsed = now - bucket.lastRefill;
  if (elapsed <= 0) {
    return bucket;
  }

  const tokensToAdd = Math.floor((elapsed / WINDOW_MS) * MAX_REQUESTS);
  if (tokensToAdd > 0) {
    bucket.tokens = Math.min(MAX_REQUESTS, bucket.tokens + tokensToAdd);
    bucket.lastRefill = now;
  }

  return bucket;
}

function rateLimit(request: NextRequest) {
  if (!request.nextUrl.pathname.startsWith('/api/')) {
    return null;
  }

  const now = Date.now();
  const key = getClientKey(request);
  const bucket = refill(
    buckets.get(key) ?? { tokens: MAX_REQUESTS, lastRefill: now },
    now,
  );

  if (bucket.tokens <= 0) {
    const retryAfterSeconds = Math.ceil((bucket.lastRefill + WINDOW_MS - now) / 1000);
    const response = NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    response.headers.set('Retry-After', String(Math.max(retryAfterSeconds, 1)));
    return response;
  }

  bucket.tokens -= 1;
  buckets.set(key, bucket);
  return null;
}

function applySecurityHeaders(response: NextResponse, nonce: string) {
  response.headers.set(
    'Content-Security-Policy',
    CSP_TEMPLATE.replace('${nonce}', nonce),
  );
  response.headers.set('x-nonce', nonce);

  for (const [key, value] of Object.entries(ADDITIONAL_SECURITY_HEADERS)) {
    response.headers.set(key, value);
  }

  return response;
}

export function middleware(request: NextRequest) {
  const nonce = generateNonce();
  const rateLimitResponse = rateLimit(request);
  if (rateLimitResponse) {
    return applySecurityHeaders(rateLimitResponse, nonce);
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-nonce', nonce);

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  return applySecurityHeaders(response, nonce);
}
