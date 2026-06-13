import assert from "node:assert/strict";
import { beforeEach, describe, it } from "node:test";

import { NextRequest } from "next/server";

import { resetRateLimit } from "../src/lib/rate-limit";
import { middleware } from "../src/middleware";

const API_URL = "http://localhost/api/contact";

const makeRequest = (headers: Record<string, string>) =>
  new NextRequest(API_URL, { headers });

beforeEach(() => {
  resetRateLimit();
});

describe("global API rate limit middleware", () => {
  it("allows requests under the limit", () => {
    const headers = { "x-forwarded-for": "198.51.100.10" };

    for (let attempt = 0; attempt < 60; attempt += 1) {
      const response = middleware(makeRequest(headers));
      assert.equal(
        response.headers.get("x-middleware-next"),
        "1",
        `expected request ${attempt + 1} to pass through`
      );
    }
  });

  it("returns 429 with Retry-After once the limit is exceeded", () => {
    const headers = { "x-forwarded-for": "198.51.100.11" };

    for (let attempt = 0; attempt < 60; attempt += 1) {
      middleware(makeRequest(headers));
    }

    const blocked = middleware(makeRequest(headers));

    assert.equal(blocked.status, 429);
    assert.equal(blocked.headers.has("Retry-After"), true);
  });

  it("tracks limits independently per client", () => {
    const headersA = { "x-forwarded-for": "198.51.100.12" };
    const headersB = { "x-forwarded-for": "198.51.100.13" };

    for (let attempt = 0; attempt < 60; attempt += 1) {
      middleware(makeRequest(headersA));
    }

    const blockedA = middleware(makeRequest(headersA));
    assert.equal(blockedA.status, 429);

    const allowedB = middleware(makeRequest(headersB));
    assert.equal(allowedB.headers.get("x-middleware-next"), "1");
  });
});
