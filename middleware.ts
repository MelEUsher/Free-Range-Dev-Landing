import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

type Bucket = {
  tokens: number;
  lastRefill: number;
};

const WINDOW_MS = 5 * 60 * 1000;
const MAX_REQUESTS = 60;
const buckets = new Map<string, Bucket>();

function getClientKey(request: NextRequest) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() ?? "unknown";
  }

  const headerFallbacks = [
    "x-real-ip",
    "cf-connecting-ip",
    "x-client-ip",
    "fastly-client-ip",
  ];

  for (const header of headerFallbacks) {
    const value = request.headers.get(header);
    if (value) {
      return value;
    }
  }

  return request.nextUrl.hostname ?? "unknown";
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

export function middleware(request: NextRequest) {
  if (!request.nextUrl.pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  const now = Date.now();
  const key = getClientKey(request);
  const bucket = refill(
    buckets.get(key) ?? { tokens: MAX_REQUESTS, lastRefill: now },
    now,
  );

  if (bucket.tokens <= 0) {
    const retryAfterSeconds = Math.ceil(
      (bucket.lastRefill + WINDOW_MS - now) / 1000,
    );
    const response = NextResponse.json(
      { error: "Too many requests" },
      { status: 429 },
    );
    response.headers.set(
      "Retry-After",
      String(Math.max(retryAfterSeconds, 1)),
    );
    return response;
  }

  bucket.tokens -= 1;
  buckets.set(key, bucket);

  return NextResponse.next();
}

export const config = {
  matcher: "/api/:path*",
};
