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
This is a **Next.js 15 App Router** application with strict TypeScript and Tailwind CSS. The architecture emphasizes security, rate limiting, and markdown-based blog content.

**Core directories:**
- `src/app/` - App Router pages, layouts, and components
- `src/lib/` - Shared utilities (rate limiting, blog post loading, nonce generation)
- `content/posts/` - Markdown/MDX blog posts (`.md` or `.mdx` files)
- `types/` - TypeScript type definitions
- `tests/` - Node.js native test runner tests
- `public/` - Static assets and `_redirects` for Netlify

### Security Architecture

**Middleware (`src/middleware.ts`):**
- Generates cryptographic nonces for CSP on every request
- Applies Content-Security-Policy and security headers to all routes
- Implements token bucket rate limiting (60 req/5 min) for `/api/*` endpoints
- IP detection via `x-forwarded-for`, `x-real-ip`, and CDN headers
- Returns 429 with `Retry-After` header on rate limit violation

**Security headers applied globally:**
- Strict-Transport-Security, X-Frame-Options, X-Content-Type-Options
- Referrer-Policy, Permissions-Policy
- CSP with nonce-based script execution

**Nonce flow:**
1. Middleware generates nonce → sets `x-nonce` header
2. `layout.tsx` reads nonce from headers → adds to `data-csp-nonce` attribute
3. Components can access nonce for inline scripts/styles if needed

### API Routes

**Contact API (`src/app/api/contact/route.ts`):**
- POST-only endpoint with method validation (405 for other methods)
- Dual rate limiting: middleware (global) + endpoint-specific (`src/lib/rate-limit.ts`, 5 req/min)
- Accepts both JSON and form-data submissions
- Zod validation for name/email/message fields
- Sends via Resend API when `RESEND_API_KEY` and `SUPPORT_EMAIL` env vars are set
- Falls back to console logging in development
- All responses include security headers

### Blog System

**Content loading (`src/lib/posts.ts`):**
- Reads markdown files from `content/posts/`
- Uses `gray-matter` to parse frontmatter (requires `title` and `date` fields)
- Provides three main functions:
  - `getAllPosts()` - Returns sorted list of post metadata (sync, for static generation)
  - `loadPosts()` - Async version for SSR contexts
  - `loadPostBySlug(slug)` - Loads individual post with full content
- Auto-generates excerpts from markdown content
- Supports both `.md` and `.mdx` files

**Blog routes:**
- `/blog` - Post listing page (`src/app/blog/page.tsx`)
- `/blog/[slug]` - Individual post page (`src/app/blog/[slug]/page.tsx`)

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

### Adding New Blog Posts
1. Create markdown file in `content/posts/` (e.g., `my-post.md`)
2. Include required frontmatter:
   ```yaml
   ---
   title: "Post Title"
   date: "2024-01-15"
   ---
   ```
3. Post automatically appears in `/blog` (sorted by date, newest first)

### Rate Limiting Layers
- **Middleware layer:** 60 requests per 5 minutes per IP (all `/api/*` routes)
- **Contact API layer:** 5 requests per minute per IP (specific to `/api/contact`)
- Both use sliding window algorithm
- Both return 429 + Retry-After on limit breach

### CSP and Inline Scripts
- All inline scripts/styles require nonce attribute
- Access nonce via `data-csp-nonce` attribute on `<body>` element
- Middleware regenerates nonce on every request
- Do not hardcode nonces - always read from headers/attributes

### Environment Variables
- `RESEND_API_KEY` - Required for sending contact form emails
- `SUPPORT_EMAIL` - Destination email for contact submissions
- Without these, contact API logs to console (dev/test mode)

## File References

- Security headers: `src/middleware.ts:12-18`, `next.config.mjs:1-10`
- Rate limiting implementation: `src/middleware.ts:69-99`, `src/lib/rate-limit.ts`
- Blog post loading: `src/lib/posts.ts`
- Contact API validation: `src/app/api/contact/route.ts:6-10`
- Font configuration: `src/app/fonts.ts`, `tailwind.config.ts:11-59`
- Test utilities: `tests/contact_test.ts`
