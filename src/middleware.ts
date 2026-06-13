import { NextResponse, type NextRequest } from "next/server";

import { enforceRateLimit } from "@/lib/rate-limit";

const GLOBAL_WINDOW_MS = 5 * 60 * 1000;
const GLOBAL_MAX_REQUESTS = 60;

const IP_HEADER_FALLBACKS = [
  "x-real-ip",
  "cf-connecting-ip",
  "x-client-ip",
  "fastly-client-ip",
];

function getClientKey(request: NextRequest) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() || "unknown";
  }

  for (const header of IP_HEADER_FALLBACKS) {
    const value = request.headers.get(header);
    if (value) {
      return value;
    }
  }

  return request.nextUrl.hostname || "unknown";
}

export function middleware(request: NextRequest) {
  const key = `global:${getClientKey(request)}`;
  const result = enforceRateLimit(key, GLOBAL_MAX_REQUESTS, GLOBAL_WINDOW_MS);

  if (!result.success) {
    const response = NextResponse.json(
      { ok: false, error: "Too many requests" },
      { status: 429 }
    );
    response.headers.set(
      "Retry-After",
      Math.max(1, Math.ceil((result.reset - Date.now()) / 1000)).toString()
    );
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/api/:path*",
};
