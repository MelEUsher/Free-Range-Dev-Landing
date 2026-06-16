import assert from 'node:assert/strict';
import { after, beforeEach, describe, it } from 'node:test';

import { POST, GET } from '../src/app/api/contact/route';
import { resetRateLimit } from '../src/lib/rate-limit';

const API_URL = 'http://localhost/api/contact';
const REQUIRED_SECURITY_HEADERS = [
  'Content-Security-Policy',
  'Referrer-Policy',
  'X-Content-Type-Options',
  'X-Frame-Options',
  'Permissions-Policy',
  'Strict-Transport-Security',
  'X-XSS-Protection',
];

const originalResendApiKey = process.env.RESEND_API_KEY;
const originalFetch = globalThis.fetch;

const makeJsonRequest = (
  body: Record<string, string>,
  extraHeaders?: Record<string, string>,
) =>
  new Request(API_URL, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      ...extraHeaders,
    },
    body: JSON.stringify(body),
  });

const makeFormDataRequest = (
  fields: Record<string, string>,
  extraHeaders?: Record<string, string>,
) => {
  const form = new FormData();
  for (const [key, value] of Object.entries(fields)) {
    form.append(key, value);
  }

  return new Request(API_URL, {
    method: 'POST',
    headers: extraHeaders,
    body: form,
  });
};

beforeEach(() => {
  delete process.env.RESEND_API_KEY;
  globalThis.fetch = originalFetch;
  resetRateLimit();
});

after(() => {
  if (typeof originalResendApiKey === 'string') {
    process.env.RESEND_API_KEY = originalResendApiKey;
  } else {
    delete process.env.RESEND_API_KEY;
  }
  globalThis.fetch = originalFetch;
});

describe('contact API', () => {
  it('responds with 200 and success JSON for a valid submission', async () => {
    process.env.RESEND_API_KEY = 'test-api-key';
    const requests: Array<{ url: string; init?: RequestInit }> = [];
    globalThis.fetch = (async (url: string | URL | Request, init?: RequestInit) => {
      requests.push({ url: String(url), init });
      return new Response(JSON.stringify({ id: 'email_test' }), {
        status: 200,
        headers: { 'content-type': 'application/json' },
      });
    }) as typeof fetch;

    const response = await POST(
      makeJsonRequest(
        {
          firstName: 'Support',
          lastName: 'Tester',
          email: 'support@example.com',
          message: 'Hello there!',
        },
        { 'x-forwarded-for': '203.0.113.1' },
      ),
    );

    assert.equal(response.status, 200);
    const body = (await response.json()) as { ok?: boolean };
    assert.equal(body.ok, true);
    assert.equal(requests.length, 1);
    assert.equal(requests[0]?.url, 'https://api.resend.com/emails');

    const resendBody = JSON.parse(String(requests[0]?.init?.body)) as {
      reply_to?: string;
      to?: string[];
    };
    assert.equal(resendBody.reply_to, 'support@example.com');
    assert.deepEqual(resendBody.to, ['squad@thefreerangedev.dev']);

    for (const header of REQUIRED_SECURITY_HEADERS) {
      assert.ok(response.headers.get(header), `expected ${header} header to be set`);
    }
  });

  it('returns 422 when required fields are missing', async () => {
    const response = await POST(
      makeFormDataRequest(
        {
          name: 'Missing Email',
          firstName: 'Missing',
          lastName: 'Email',
          message: 'Forgot to add the email field.',
        },
        { 'x-forwarded-for': '203.0.113.2' },
      ),
    );

    assert.equal(response.status, 422);
    const body = (await response.json()) as { ok?: boolean };
    assert.equal(body.ok, false);
  });

  it('enforces the sliding window rate limit and returns 429 with Retry-After', async () => {
    process.env.RESEND_API_KEY = 'test-api-key';
    globalThis.fetch = (async () =>
      new Response(JSON.stringify({ id: 'email_test' }), {
        status: 200,
        headers: { 'content-type': 'application/json' },
      })) as typeof fetch;

    const headers = { 'x-forwarded-for': '203.0.113.3' };
    for (let attempt = 0; attempt < 5; attempt += 1) {
      const interimResponse = await POST(
        makeJsonRequest(
          {
            firstName: 'Tester',
            lastName: `${attempt}`,
            email: `tester${attempt}@example.com`,
            message: 'Checking the limiter.',
          },
          headers,
        ),
      );
      assert.equal(
        interimResponse.status,
        200,
        `expected request ${attempt + 1} to succeed`,
      );
    }

    const blockedResponse = await POST(
      makeJsonRequest(
        {
          firstName: 'Rate',
          lastName: 'Limited',
          email: 'ratelimit@example.com',
          message: 'This one should fail.',
        },
        headers,
      ),
    );

    assert.equal(blockedResponse.status, 429);
    assert.equal(
      blockedResponse.headers.has('Retry-After'),
      true,
      'expected Retry-After header',
    );
  });

  it('rejects unsupported methods with 405', async () => {
    const response = await GET();
    assert.equal(response.status, 405);
    assert.equal(response.headers.get('Allow'), 'POST');
  });

  it('returns 500 when delivery is not configured', async () => {
    const response = await POST(
      makeJsonRequest(
        {
          firstName: 'No',
          lastName: 'Secret',
          email: 'nosecret@example.com',
          message: 'This should fail visibly.',
        },
        { 'x-forwarded-for': '203.0.113.4' },
      ),
    );

    assert.equal(response.status, 500);
    const body = (await response.json()) as { ok?: boolean };
    assert.equal(body.ok, false);
  });
});
