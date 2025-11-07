type RateLimitEntry = {
  count: number;
  expiresAt: number;
};

const WINDOW_MS = 60_000;
const MAX_REQUESTS = 5;
const VISITS = new Map<string, RateLimitEntry>();

export type RateLimitResult = {
  success: boolean;
  remaining: number;
  reset: number;
};

/**
 * Enforces a simple sliding window limit keyed by an identifier such as an IP.
 */
export const enforceRateLimit = (
  identifier: string,
  limit = MAX_REQUESTS
): RateLimitResult => {
  const now = Date.now();
  const existing = VISITS.get(identifier);

  if (!existing || existing.expiresAt <= now) {
    const expiresAt = now + WINDOW_MS;
    VISITS.set(identifier, { count: 1, expiresAt });
    return { success: true, remaining: limit - 1, reset: expiresAt };
  }

  if (existing.count >= limit) {
    return { success: false, remaining: 0, reset: existing.expiresAt };
  }

  existing.count += 1;
  VISITS.set(identifier, existing);

  return {
    success: true,
    remaining: Math.max(0, limit - existing.count),
    reset: existing.expiresAt,
  };
};
