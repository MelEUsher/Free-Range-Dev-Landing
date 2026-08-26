# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Essential Commands

```bash
npm install              # Install dependencies
npm run dev              # Start dev server on http://localhost:3000
npm run build            # Production build (next build)
npm run lint             # Run ESLint
npm run typecheck        # Run TypeScript compiler check
npm run format           # Check Prettier formatting (prettier --check .)
npm run verify           # Full verification: lint + typecheck + build
```

`package.json` defines no `test` script, so `npm test` fails with `Missing script: "test"`. See
"Testing" below for how to run the files under `tests/`.

### scripts/verify.sh

`./scripts/verify.sh` runs `pnpm lint`, `pnpm typecheck`, and `pnpm build`. It requires a `pnpm`
binary on `PATH` or in `node_modules/.bin`. `npm install` does not supply one, because pnpm is not
a dependency of this project, so run `corepack enable pnpm` or install pnpm globally before using
the script. `npm run verify` performs the same three steps through npm and requires no extra setup.

## Architecture Overview

### Next.js 16 App Router Structure

This is a Next.js 16 App Router application (`next` ^16.2.9, React 19) with strict TypeScript and
Tailwind CSS v4. The architecture emphasizes security, rate limiting, and markdown-based article
content.

**Core directories:**

- `src/app/` - App Router pages, layouts, and components
- `src/lib/` - Shared utilities (article loading, category registry, rate limiting, nonce generation)
- `content/articles/` - Markdown/MDX articles (`.md` or `.mdx` files)
- `types/` - TypeScript type definitions
- `tests/` - Test files for the Node.js native test runner
- `public/` - Static assets, plus a `_redirects` file mapping `/blog` to `/articles`

A second `_redirects` file at the repository root holds the `.dev` to `.com` domain redirect.

### Security Architecture

**Proxy (`src/proxy.ts`):**

- Applies a global rate limit of 60 requests per 5 minutes per client for `/api/*` endpoints
- Client key from `x-forwarded-for`, then `x-real-ip`, `cf-connecting-ip`, `x-client-ip`, and
  `fastly-client-ip`, falling back to the request hostname
- Returns 429 with a `Retry-After` header on rate limit violation
- Matcher: `/api/:path*` only, so it does not run on page routes

**Security headers applied globally (`next.config.mjs`):**

- Strict-Transport-Security, X-Frame-Options, X-Content-Type-Options, X-XSS-Protection
- Referrer-Policy, Permissions-Policy
- A static Content-Security-Policy that sets `default-src 'self'`,
  `script-src 'self' 'unsafe-inline'`, `style-src 'self' 'unsafe-inline'`, `img-src 'self' data:`,
  `font-src 'self' data:`, `connect-src 'self'`, and `frame-src` for YouTube and TikTok

See "CSP Nonce Rollout" below for the planned hardening path.

### CSP Nonce Rollout (Planned, Not Yet Enforced)

**Current state:** the CSP above is fully static and enforced for every route. `src/proxy.ts` does
not generate nonces or set any CSP headers. `src/lib/nonce.ts` (`generateNonce()`, Node
`crypto.randomBytes(16).toString("base64")`) has no callers anywhere in `src/`. It is retained on
purpose for the rollout below and is not accidental dead code.

**Stage 1 findings (validated via a report-only CSP, since reverted):**

- Nonce-based `script-src` requires Next.js to inject the matching nonce into its own framework
  inline scripts during **per-request server-side rendering**. Next extracts the nonce from the
  `Content-Security-Policy` / `-Report-Only` header on the _request_ (set by the proxy via
  `NextResponse.next({ request: { headers } })`).
- Statically generated pages (`/`, `/articles`, `/articles/[slug]`, `/articles/topics/[key]`) are
  prerendered at build time with no request and no nonce available, so their baked-in framework
  `<script>` tags carry no `nonce` attribute. Confirmed empirically: served HTML for `/` and
  `/articles` (both `x-nextjs-cache: HIT`) had 5 to 9 inline `<script>` tags with no `nonce=`
  attribute.
- A nonce-only `script-src` (dropping `unsafe-inline`) would therefore block all of Next's framework
  inline scripts on these pages and break hydration.

**Enforcement plan (when the client portal exists):**

- Scope nonce-based CSP to **dynamically-rendered routes only** (the future client portal), via
  per-route `export const dynamic = "force-dynamic"`.
- On those routes, reuse `src/lib/nonce.ts`'s `generateNonce()` plus the proxy pattern validated in
  Stage 1: generate a nonce per request, then set `x-nonce` and `Content-Security-Policy` (with
  `script-src 'self' 'nonce-${nonce}'`) on **both** the proxy's request headers
  (`requestHeaders.set` plus `NextResponse.next({ request: { headers: requestHeaders } })`) and the
  response headers.
- Broaden `src/proxy.ts`'s matcher beyond `/api/:path*` to cover the portal routes (for example
  `["/api/:path*", {source: "/((?!_next/static|_next/image|favicon.ico).*)", missing: [...prefetch headers]}]`),
  but keep the `/api/*` rate-limit logic gated on `pathname.startsWith("/api/")` so it is
  unaffected.
- Static marketing and article pages **stay on the existing enforced static CSP in
  `next.config.mjs`**, including `script-src 'unsafe-inline'`. That is an accepted tradeoff, since
  these pages carry no first-party inline scripts or injection surface.

**Hash-based static CSP, evaluated and deferred on purpose:**

- Next.js 16's `experimental.sri` only adds `integrity` attributes to _external_
  `<script src="/_next/static/...">` bundle files. It does **not** generate
  `script-src 'sha256-...'` hash-sources in the CSP for inline framework scripts.
- Dropping `unsafe-inline` on static pages would require custom postbuild tooling: parse each
  prerendered page's inline `<script>` content, hash it with SHA-256, then emit per-route CSP
  headers (for example via Netlify's `_headers` file, since `next.config.mjs`'s `headers()` is
  static and cannot vary per computed content).
- This is a separate future project and is not currently planned.

### API Routes

**Contact API (`src/app/api/contact/route.ts`):**

- The endpoint accepts POST only. `GET`, `HEAD`, `PUT`, `PATCH`, `DELETE`, and `OPTIONS` return 405
  with an `Allow: POST` header.
- Dual rate limiting: the proxy's global limit plus an endpoint limit of 5 requests per minute per
  client (`src/lib/rate-limit.ts`), which returns 429 with `Retry-After`
- Accepts JSON, `multipart/form-data`, and `application/x-www-form-urlencoded` bodies
- The Zod schema takes `firstName` (required), `lastName` (optional), `businessName` (optional),
  `email` (required), and `message` (required). A body that fails validation returns 422.
- Sends via the Resend API when `RESEND_EMAIL_API_KEY` is set, to `squad@thefreerangedev.dev`
- Returns 500 when email delivery is not configured or the send fails
- All responses carry the security header set defined in the route

### Articles System

**Content lives in `content/articles/` as `.md` or `.mdx` files.** The category restructure
(PR #105) replaced the flat article index with a category taxonomy, so an article's `category`
frontmatter field is what makes it appear anywhere on the site.

**The article queue lives at `/ARTICLE-IDEAS.md`.** That file at the repository root is the durable
record of which articles are published, which topics are queued, and which topics have been ruled
out. It is the primary source the weekly article-planning session reads, because that session runs
fresh and cannot count on reaching project memory, while it can always read this repository. The
file is not a published page and builds no route, since only files under `content/articles/` become
pages. Keep it current: publishing an article includes checking off its entry there, which is step 8
of "Adding New Articles" below.

#### Frontmatter fields

| Field         | Type   | Required                                          | Effect                                                                |
| ------------- | ------ | ------------------------------------------------- | --------------------------------------------------------------------- |
| `title`       | string | Yes, enforced by the loader                       | Rendered as the page H1 and the card title                            |
| `date`        | string | Yes, enforced by the loader                       | Sort key and displayed date, an ISO string such as `"2026-08-05"`     |
| `category`    | string | Yes in practice, optional to `ArticleFrontmatter` | Registry key, without which the article cannot be found by browsing   |
| `description` | string | Yes by editorial process, optional to the loader  | Meta description, OpenGraph, Twitter card, and the visible card blurb |

`title` and `date` are the only two fields `isValidFrontmatter` enforces. An article missing either
one is skipped by every loader and never builds a page. `category` and `description` are not
enforced by code, which is why both need attention when adding an article. The consequences of
omitting them are described below.

**`publishedAt` is dead.** PR #105 reconciled the date field to `date` and removed `publishedAt`
from every content file. It survives only as an unused optional property on the
`MarkdownFrontmatter` type in `src/lib/articles.ts`, and nothing in the codebase reads it. The same
is true of `updatedAt`. Do not add either field to a new article.

#### Category resolution (`src/lib/categories.ts`)

`CATEGORIES` is the registry and the single source of truth for the taxonomy. It holds two keys
today:

- `automation-tech` (label "Automation & Tech", order 1)
- `sales-persuasion` (label "Sales & Persuasion", order 2)

`resolveCategoryKey(raw)` trims and lowercases the frontmatter value, returns it when the registry
contains it, and otherwise returns `UNCATEGORIZED_KEY` (`"uncategorized"`). `uncategorized` is not a
registered category, so an article that resolves to it:

- never appears in the left category nav,
- never appears in the Featured view at `/articles`,
- never appears in any `/articles/topics/[key]` list,
- still builds and remains reachable at its own `/articles/[slug]` URL, with the category chip
  hidden.

A missing, misspelled, or unregistered `category` therefore ships an article that no reader can find
by browsing the site. Check the key against the registry before committing.

`renderedCategories(articles)` narrows the registry to categories that have at least one article.
A registered category with no articles stays out of the nav and the Featured view, and its topics
route returns 404, until its first article publishes. It then appears on the next build with no code
change. A category can therefore be registered ahead of the writing that fills it, and an empty
registered category is an expected state rather than a defect.

To add a category, add one entry to `CATEGORIES` with a `key`, a `label`, and an `order`, then tag
at least one article with that key.

#### Slugs and the `SAFE_SLUG` guard

The slug comes from the **filename** (`path.basename` without the extension), not from frontmatter.
`src/lib/articles.ts` constrains it with an allowlist:

```ts
const SAFE_SLUG = /^[a-z0-9-]+$/;
```

The guard is applied at all three slug origins: both list loaders and `loadArticleBySlug`. It exists
because CodeQL flagged a stored cross-site scripting flow running from an article filename into
`slug` and out into a `<Link href>`, and the allowlist closes that flow at its source. A file whose
basename contains an uppercase letter, an underscore, a space, a dot, or any other character outside
`[a-z0-9-]` is dropped by `getAllArticles()` and `loadArticles()`, and returns `null` from
`loadArticleBySlug()`, so it produces no page at all. Name new files in lowercase kebab-case.

#### Loader functions (`src/lib/articles.ts`)

- `getAllArticles()` (sync) returns `ArticleMeta[]` sorted newest first, and backs the index, the
  topic pages, and the layout nav. It drops any file that fails `isValidFrontmatter`, any file whose
  `date` does not parse, and any file that fails `SAFE_SLUG`. It also resolves `categoryKey` and
  builds the mechanical `excerpt`.
- `loadArticles()` (async) returns slug, raw content, and frontmatter, and backs
  `generateStaticParams` for `/articles/[slug]`. It does not validate that `date` parses, so an
  article with an unparseable date still gets its own page while being absent from every list.
- `loadArticleBySlug(slug)` (async) loads one article, resolving `.mdx` before `.md`.
- `toExcerpt(body, max = 160)` strips markdown and truncates. `ArticleCard` uses
  `article.description ?? article.excerpt`, so an article with no `description` shows this
  mechanical truncation as its public card blurb.
- `deriveDescription()` in `src/app/articles/[slug]/page.tsx` is the matching metadata fallback: the
  first 156 characters of the stripped body, cut mid-sentence.

#### Articles routes

- `/articles` (`src/app/articles/page.tsx`) is the **Featured view**: one full-width lead card per
  rendered category, each showing that category's newest article, in registry order. The route is
  `force-static`.
- `/articles/topics/[key]` (`src/app/articles/topics/[key]/page.tsx`) is a single category, with the
  newest article as a lead card and the remainder as row cards. The route is `force-static` and sets
  `dynamicParams = false`, and its `generateStaticParams` covers rendered categories only, so an
  empty registered category returns 404.
- `/articles/[slug]` (`src/app/articles/[slug]/page.tsx`) is the single article. The route sets
  `runtime = 'nodejs'` and `dynamicParams = false`. It renders the frontmatter title as the H1, the
  formatted date, and a category chip when the category resolves to a registered key.
- `src/app/articles/layout.tsx` wraps all three in a persistent shell: a sticky left **category
  nav** (`ArticlesNav`, showing "Featured Articles" plus one link per rendered category) and a
  center content column, collapsing to a single column at 880px and below. There is no per-article
  index rail. `ArticlesRail.tsx` was deleted in the category restructure.
- `ArticleCard.tsx` renders both card variants, `lead` and `row`.

#### Body conventions

- The single-article page supplies the H1 from `frontmatter.title`, so the markdown body should
  start at H2 (`##`). An H1 in the body duplicates the title.
- The OpenGraph and Twitter image is the site logo constant
  (`/assets/free-range-dev-logo-no-background.png`) for every article. Per-article images are not
  implemented.

### Font System

**Local fonts (`src/app/fonts.ts`, loaded via `next/font/local` from `src/fonts/*.woff2`):**

- **Inter** - Default sans-serif (400, 600, 700 weights), variable `--font-inter`
- **Kalam** - Handwriting style (400 weight), variable `--font-kalam`, available as `font-hand`
- **Comfortaa** - Display font (400, 700 weights), variable `--font-comfortaa`, available as
  `font-display`

**Google fonts (`src/app/fonts.ts`, loaded via `next/font/google`):**

- **Cormorant Garamond** - variable `--font-cormorant-garamond` (400, 500, 600, roman and italic)
- **Jost** - variable `--font-jost` (300, 400, 500, 600)

All five variables are applied to `<body>` in `src/app/layout.tsx`. Cormorant Garamond and Jost back
the `home-redesign` theme used by the homepage, `/studio`, and the articles pages, through
`--home-display` and `--home-body` in `globals.css`.

**Tailwind integration:**

- Default body: `font-sans` (Inter)
- Use `font-hand` for Kalam and `font-display` for Comfortaa
- Brand colors: `bg-base-bg` (#f9f8f3), `text-base-text` (#333333)

## Testing

**No npm test script exists.** `package.json` declares no `test` script and no test runner in
`devDependencies`, so `npm test` fails. The suites under `tests/` are TypeScript and run under the
Node.js native test runner through an on-demand TypeScript loader:

```bash
npx tsx --test tests/contact_test.ts   # 6 tests
npx tsx --test tests/proxy_test.ts     # 3 tests
```

Both suites pass as of 2026-08-20. `tsx` is fetched on demand by `npx` and is not a declared
dependency.

**CI does not run them.** `.github/workflows/deploy.yml` runs `npm ci`, `npm run build`, and
Lighthouse CI. It does not run lint, typecheck, or the test files, so run `npm run verify` and the
two commands above locally before opening a pull request.

**Node.js native test runner conventions:**

- No Jest or Vitest is required, since the suites use the built-in `node:test` module
- Tests import route handlers directly (for example `POST` and `GET` from `route.ts`)
- Mock environment variables in `beforeEach` and restore them in `after` hooks
- Use `resetRateLimit()` to clear rate limit state between tests

**Contact API test coverage (`tests/contact_test.ts`):**

- Valid submission flow (200 response)
- Missing required fields (422 response)
- Blank optional `lastName` and `businessName` fields accepted
- Rate limiting enforcement (429 with Retry-After)
- Method validation (405 for non-POST methods)
- Delivery not configured (500 response)
- Security header presence on all responses

**Proxy test coverage (`tests/proxy_test.ts`):** the suite covers requests under the limit, a 429
with Retry-After once the limit is exceeded, and independent tracking per client.

## Development Notes

### Adding New Articles

1. Create a markdown file in `content/articles/`. The filename becomes the URL slug, so use
   lowercase kebab-case matching `/^[a-z0-9-]+$/` (for example `where-your-api-key-should-live.md`).
2. Include all four frontmatter fields:

   ```yaml
   ---
   title: "Article Title"
   date: "2026-08-20"
   description: "One or two sentences of hand-authored marketing and SEO copy."
   category: "automation-tech"
   ---
   ```

3. `category` must be a key registered in `src/lib/categories.ts`. The current keys are
   `automation-tech` and `sales-persuasion`. Any other value, or no value, resolves to
   `uncategorized` and the article vanishes from the nav, the Featured view, and every topic list
   while remaining live at its own URL.
4. `description` is a required pre-publish step. It feeds the meta description, OpenGraph, and
   Twitter card, and it renders as the visible blurb on the article card. Without it the card falls
   back to a mechanical 160-character truncation of the body.
5. Do not add `publishedAt`. The date field is `date`.
6. Start the body at H2 (`##`). The page renders the H1 from the title.
7. Build the site. `generateStaticParams` reads the directory, so no manifest, index, or config
   change is needed.
8. Check off the article's entry in `/ARTICLE-IDEAS.md` in the same pull request that adds the
   article, recording its date and its slug. That file is how the next article-planning session
   knows the piece shipped, so an unchecked entry gets the topic proposed a second time.

### Rate Limiting Layers

- **Proxy layer (`src/proxy.ts`):** 60 requests per 5 minutes per client, for all `/api/*` routes
- **Contact API layer:** 5 requests per minute per client, specific to `/api/contact`
- Both call `enforceRateLimit` in `src/lib/rate-limit.ts`, which keeps a fixed-window counter in an
  in-memory `Map`: the first request opens a window, later requests increment the count, and the
  window resets once it expires. State is per process and does not survive a restart.
- Both return 429 with `Retry-After` on limit breach

### CSP and Inline Scripts

- The enforced CSP (`next.config.mjs`) currently allows `'unsafe-inline'` for both `script-src` and
  `style-src`
- No custom inline `<script>`, `<style>`, or `dangerouslySetInnerHTML` exists in `src/`. Only
  Next.js framework-injected inline scripts are present.
- See "CSP Nonce Rollout" above for the planned nonce-based hardening path, scoped to future dynamic
  routes only

### Environment Variables

- `RESEND_EMAIL_API_KEY` - Required for sending contact form emails
- Without it, the contact API returns a 500 email delivery error

## File References

- Security headers: `next.config.mjs:12-57`
- Rate limiting implementation: `src/proxy.ts`, `src/lib/rate-limit.ts`
- Nonce generation (planned, currently unused): `src/lib/nonce.ts`, see "CSP Nonce Rollout"
- Article loading and the `SAFE_SLUG` guard: `src/lib/articles.ts`
- Category registry and resolution: `src/lib/categories.ts`
- Article types: `types/articles.ts`
- Article routes: `src/app/articles/page.tsx`, `src/app/articles/topics/[key]/page.tsx`,
  `src/app/articles/[slug]/page.tsx`, `src/app/articles/layout.tsx`
- Article UI: `src/app/articles/ArticlesNav.tsx`, `src/app/articles/ArticleCard.tsx`
- Contact API validation: `src/app/api/contact/route.ts:6-12`
- Font configuration: `src/app/fonts.ts`
- Test files: `tests/contact_test.ts`, `tests/proxy_test.ts`
