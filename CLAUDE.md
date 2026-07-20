# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Essential Commands
```bash
npm install              # Install dependencies (includes pnpm locally)
npm run dev              # Start dev server on http://localhost:3000
npm run build            # Production build with header verification
npm run lint             # Run ESLint
npm run typecheck        # Run TypeScript compiler check
npm run format           # Check Prettier formatting
npm test                 # Run Node.js native test runner (contact API tests)
npm run verify           # Full verification: lint + typecheck + build
```

### Using pnpm (preferred for scripts)
```bash
./scripts/verify.sh      # Run full verification with pnpm
```

The project uses **pnpm** internally. `npm install` provides a local pnpm binary at `node_modules/.bin/pnpm`.

### Running Single Tests
```bash
# Run specific test file
npm test                 # Currently runs tests/contact_test.ts

# Run with Node.js test runner directly
npx tsx --test tests/contact_test.ts
```

## Architecture Overview

### Next.js 15 App Router Structure
This is a **Next.js 15 App Router** application with strict TypeScript and Tailwind CSS. The architecture emphasizes security, rate limiting, and markdown-based article content.

**Core directories:**
- `src/app/` - App Router pages, layouts, and components
- `src/lib/` - Shared utilities (rate limiting, article loading, nonce generation)
- `content/articles/` - Markdown/MDX articles (`.md` or `.mdx` files)
- `types/` - TypeScript type definitions
- `tests/` - Node.js native test runner tests
- `public/` - Static assets and `_redirects` for Netlify

### Security Architecture

**Proxy (`src/proxy.ts`):**
- Implements token bucket rate limiting (60 req/5 min) for `/api/*` endpoints
- IP detection via `x-forwarded-for`, `x-real-ip`, and CDN headers
- Returns 429 with `Retry-After` header on rate limit violation
- Matcher: `/api/:path*` only — does not currently run on page routes

**Security headers applied globally (`next.config.mjs`):**
- Strict-Transport-Security, X-Frame-Options, X-Content-Type-Options
- Referrer-Policy, Permissions-Policy
- Static Content-Security-Policy with `script-src 'self' 'unsafe-inline'` and
  `style-src 'self' 'unsafe-inline'` (see "CSP Nonce Rollout" below for the
  planned hardening path)

### CSP Nonce Rollout (Planned — Not Yet Enforced)

**Current state:** the CSP above is fully static and enforced for every
route. `src/proxy.ts` does not generate nonces or set any CSP headers.
`src/lib/nonce.ts` (`generateNonce()`, Node `crypto.randomBytes(16).toString("base64")`)
is currently unused — **intentionally retained** for the rollout below, not
accidental dead code.

**Stage 1 findings (validated via a report-only CSP, since reverted):**
- Nonce-based `script-src` requires Next.js to inject the matching nonce into
  its own framework inline scripts during **per-request server-side
  rendering**. Next extracts the nonce from the `Content-Security-Policy` /
  `-Report-Only` header on the *request* (set by the proxy via
  `NextResponse.next({ request: { headers } })`).
- Statically generated/SSG pages (`/`, `/articles`, `/articles/[slug]`) are
  prerendered at build time with no request/nonce available, so their baked-in
  framework `<script>` tags carry no `nonce` attribute. Confirmed empirically:
  served HTML for `/` and `/articles` (both `x-nextjs-cache: HIT`) had 5–9 inline
  `<script>` tags with no `nonce=` attribute.
- A nonce-only `script-src` (dropping `unsafe-inline`) would therefore block
  all of Next's framework inline scripts on these pages and break hydration.

**Enforcement plan (when the client portal exists):**
- Scope nonce-based CSP to **dynamically-rendered routes only** (the future
  client portal), via per-route `export const dynamic = "force-dynamic"`.
- On those routes, reuse `src/lib/nonce.ts`'s `generateNonce()` plus the proxy
  pattern validated in Stage 1: generate a nonce per request, set `x-nonce` +
  `Content-Security-Policy` (with `script-src 'self' 'nonce-${nonce}'`) on
  **both** the proxy's request headers (`requestHeaders.set` +
  `NextResponse.next({ request: { headers: requestHeaders } })`) and the
  response headers.
- Broaden `src/proxy.ts`'s matcher beyond `/api/:path*` to cover the portal
  routes (e.g.
  `["/api/:path*", {source: "/((?!_next/static|_next/image|favicon.ico).*)", missing: [...prefetch headers]}]`),
  but keep the `/api/*` rate-limit logic gated on
  `pathname.startsWith("/api/")` so it is unaffected.
- Static marketing pages (`/`, `/articles`, `/articles/[slug]`) **stay on the existing
  enforced static CSP in `next.config.mjs`**, including `script-src
  'unsafe-inline'` — an accepted tradeoff, since these pages carry no
  first-party inline scripts or injection surface.

**Hash-based static CSP — evaluated, deliberately deferred:**
- Next.js 16's `experimental.sri` only adds `integrity` attributes to
  *external* `<script src="/_next/static/...">` bundle files; it does **not**
  generate CSP `script-src 'sha256-...'` hash-sources for inline framework
  scripts.
- Dropping `unsafe-inline` on static pages would require custom postbuild
  tooling: parse each prerendered page's inline `<script>` content → SHA-256 →
  emit per-route CSP headers (e.g. via Netlify's `_headers` file, since
  `next.config.mjs`'s `headers()` is static and can't vary per computed
  content).
- This is a separate future project, not currently planned.

### API Routes

**Contact API (`src/app/api/contact/route.ts`):**
- POST-only endpoint with method validation (405 for other methods)
- Dual rate limiting: proxy (global) + endpoint-specific (`src/lib/rate-limit.ts`, 5 req/min)
- Accepts both JSON and form-data submissions
- Zod validation for name/email/message fields
- Sends via Resend API when `RESEND_EMAIL_API_KEY` is set
- Returns an error when email delivery is not configured
- All responses include security headers

### Articles System

**Content loading (`src/lib/articles.ts`):**
- Reads markdown files from `content/articles/`
- Uses `gray-matter` to parse frontmatter (requires `title` and `date` fields)
- Provides three main functions:
  - `getAllArticles()` - Returns sorted list of article metadata (sync, for static generation)
  - `loadArticles()` - Async version for SSR contexts
  - `loadArticleBySlug(slug)` - Loads individual article with full content
- Auto-generates excerpts from markdown content
- Supports both `.md` and `.mdx` files

**Articles routes:**
- `/articles` - Persistent layout (left index rail + center); index shows the
  featured (newest) article (`src/app/articles/page.tsx`,
  `src/app/articles/layout.tsx`)
- `/articles/[slug]` - Individual article in the center column
  (`src/app/articles/[slug]/page.tsx`)

### Font System

**Brand fonts (`src/app/fonts.ts`):**
- **Inter** - Default sans-serif (400, 600, 700 weights)
- **Kalam** - Handwriting style (400 weight) - accessible via `font-hand`
- **Comfortaa** - Display font (400, 700 weights) - accessible via `font-display`
- All loaded as local fonts via WOFF2 for performance
- CSS variables: `--font-inter`, `--font-kalam`, `--font-comfortaa`

**Tailwind integration:**
- Default body: `font-sans` (Inter)
- Use `font-hand` for Kalam, `font-display` for Comfortaa
- Brand colors: `bg-base-bg` (#f9f8f3), `text-base-text` (#333333)

## Testing Strategy

**Node.js native test runner:**
- No Jest/Vitest required - uses built-in `node:test` module
- Tests import route handlers directly (e.g., `POST`, `GET` from `route.ts`)
- Mock env vars in `beforeEach`, restore in `after` hooks
- Use `resetRateLimit()` to clear rate limit state between tests

**Contact API test coverage:**
- Valid submission flow (200 response)
- Missing/invalid field validation (422 response)
- Rate limiting enforcement (429 with Retry-After)
- Method validation (405 for non-POST methods)
- Security header presence on all responses

## Development Notes

### Adding New Articles
1. Create markdown file in `content/articles/` (e.g., `my-article.md`)
2. Include required frontmatter:
   ```yaml
   ---
   title: "Article Title"
   date: "2024-01-15"
   ---
   ```
3. Article automatically appears in `/articles` (sorted by date, newest first)

### Rate Limiting Layers
- **Proxy layer (`src/proxy.ts`):** 60 requests per 5 minutes per IP (all `/api/*` routes)
- **Contact API layer:** 5 requests per minute per IP (specific to `/api/contact`)
- Both use sliding window algorithm
- Both return 429 + Retry-After on limit breach

### CSP and Inline Scripts
- The enforced CSP (`next.config.mjs`) currently allows `'unsafe-inline'` for
  both `script-src` and `style-src`
- No custom inline `<script>`/`<style>`/`dangerouslySetInnerHTML` exist in
  `src/` — only Next.js framework-injected inline scripts
- See "CSP Nonce Rollout" above for the planned nonce-based hardening path,
  scoped to future dynamic routes only

### Environment Variables
- `RESEND_EMAIL_API_KEY` - Required for sending contact form emails
- Without this, contact API returns an email delivery error

## File References

- Security headers: `next.config.mjs:12-57`
- Rate limiting implementation: `src/proxy.ts`, `src/lib/rate-limit.ts`
- Nonce generation (planned, currently unused): `src/lib/nonce.ts` — see "CSP Nonce Rollout"
- Article loading: `src/lib/articles.ts`
- Contact API validation: `src/app/api/contact/route.ts:6-10`
- Font configuration: `src/app/fonts.ts`
- Test utilities: `tests/contact_test.ts`, `tests/proxy_test.ts`
