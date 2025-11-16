# Free Range Dev Landing

Next.js 15 App Router baseline that mirrors the legacy site’s base system (fonts, colors, and empty layout) so future features can drop in without visual churn.

## What’s Included

- **Stack** – Next.js 15.5 (App Router) + TypeScript (strict) + Tailwind CSS 3.4.
- **Brand system** – Inter (default), Kalam, and Comfortaa loaded via `next/font/google`; body defaults to `#f9f8f3` background and `#333333` text.
- **Page shell** – `/app/page.tsx` renders only `<main id="main" aria-label="Main content" className="min-h-screen" />` as required.
- **Global styling** – `globals.css` wires Tailwind base/components/utilities plus an accessible `:focus-visible` outline; no additional UI.
- **Security** – `next.config.mjs` sends CSP, Referrer-Policy, X-Content-Type-Options, X-Frame-Options, and Permissions-Policy headers for every route.
- **Rate limiting** – `middleware.ts` adds a lightweight in-memory token bucket (60 req / 5 min per IP) for `/api/*` and returns 429 + Retry-After on overage.
- **Tooling** – ESLint (`next/core-web-vitals`, `next/typescript`), Prettier, and a verify script that runs lint/typecheck/build via pnpm.
- **Parity assets** – `legacy-static/` retains the previous `index.html`, README, and `/assets`; production-ready assets + `_redirects` live under `public/`.

## Local Development

```bash
npm install              # installs npm + pnpm CLI locally
npm run dev              # starts Next.js on http://localhost:3000
npm run lint             # eslint
npm run typecheck        # tsc --noEmit
npm run build            # production build (also verifies headers/middleware)
npm run format           # prettier --check
```

### Verification Bundle

`scripts/verify.sh` exports the local pnpm binary (`node_modules/.bin/pnpm`) onto PATH and runs:

```bash
./scripts/verify.sh
# -> pnpm lint && pnpm typecheck && pnpm build
```

Install pnpm globally if you prefer (`corepack enable pnpm`), otherwise the local binary created by `npm install` is sufficient.

## Deploying

- **Vercel** – `npm run build` generates an App Router build with the custom headers automatically applied. Deploy via the standard Next.js preset.
- **Netlify** – Use the Next.js adapter or Netlify’s Next runtime. The legacy `_redirects` file already lives in `public/` and will be published automatically.

## File Map

- `src/app/layout.tsx` – Loads Google fonts, exports metadata + viewport (`width=device-width, initial-scale=1.0`), and applies the global font/color classes.
- `src/app/page.tsx` – Empty `<main>` placeholder; add content in future tickets only.
- `src/app/globals.css` – Tailwind directives plus baseline typography/background + focus styles.
- `middleware.ts` – API rate-limit stub (Edge/runtime friendly `Map` implementation).
- `next.config.mjs` – Security headers for every route.
- `tailwind.config.ts` – Registers brand colors + font families for Tailwind utilities.
- `legacy-static/` – Archive of the original static export for reference during migration.

Future tasks can now focus exclusively on content/components; the design system, security posture, and CI helpers are already in place.
