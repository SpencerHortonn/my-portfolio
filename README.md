# Spencer Lane — Portfolio

Personal brand website for filmmaker, photographer, and short-form creator Spencer Lane (@spencerchicken). Built with Astro (SSR) + Tailwind CSS + Postgres, deployed on Vercel.

The site is four pages — **Home**, **About**, **Portfolio**, **Shop** — plus a password-gated **admin panel** at `/admin` where you edit everything without touching code or redeploying.

## Run locally

```bash
npm install
npm run dev
# → http://localhost:4321
```

You need the environment variables below set locally (a `.env` file works — Astro loads it automatically). Without them, pages that read from the database will error.

## Environment variables

| Variable | What it's for | Where it comes from |
|---|---|---|
| `DATABASE_URL` | Postgres connection string | Vercel project → Storage → your Postgres/Neon store → `.env.local` tab |
| `BLOB_READ_WRITE_TOKEN` | Image/file uploads from the admin panel | Vercel project → Storage → your Blob store → `.env.local` tab |
| `ADMIN_PASSWORD_HASH` | The admin password, bcrypt-hashed (never store it in plaintext) | Generate with `node -e "console.log(require('bcryptjs').hashSync('YOUR_PASSWORD', 10))"` |
| `SESSION_SECRET` | Signs the admin session cookie | Any long random string, e.g. `openssl rand -hex 32` |

Set all four in the Vercel dashboard (Project → Settings → Environment Variables) so the live site has them too.

## One-time database setup

1. In the Vercel dashboard, open this project → **Storage** → **Create** → add a **Postgres** store and a **Blob** store.
2. Pull the resulting env vars locally: `vercel link` then `vercel env pull .env.local` (or copy them by hand from the Storage tab).
3. Create the tables: `psql "$DATABASE_URL" -f src/lib/schema.sql` (or paste `src/lib/schema.sql` into the Postgres store's Query tab in the dashboard).
4. Seed the existing portfolio items + starter copy: `npm run seed`.

After that, everything is managed from `/admin` — this only needs to happen once.

## Using the admin panel

Go to `/admin`, enter the password, and you'll land on the dashboard:

- **Portfolio** — add/edit/delete/reorder the films, photos, and galleries shown on `/portfolio`. Upload a thumbnail directly or paste an image URL; paste a YouTube/Vimeo embed URL for videos.
- **Shop** — add/edit/delete/reorder digital products (LUTs/presets) shown on `/shop`. Products marked **Active** appear publicly with a "Notify me" button (no real checkout yet — see below). Upload the digital file and a cover image directly.
- **Settings** — hero tagline, About bio, Switzerland update copy, contact info, socials, and past collaborators — everything else the site shows.
- **Subscribers** — read-only list of emails collected from the "Switzerland follow-along" form on the home page.

Every save takes effect on the live site immediately — no rebuild or redeploy needed.

## Turning on real checkout later

The shop is data-modeled for Stripe but checkout isn't wired up. Each product has a `stripe_price_id` field ready to fill in — when you're ready, that's the hook point for a real "Buy" button + Stripe Checkout session instead of the current "Notify me" form.

## Deploy to Vercel

The project already has the `@astrojs/vercel` adapter configured (`output: 'server'`). Push to GitHub and Vercel will build and deploy automatically. Make sure the four environment variables above are set in the Vercel project settings first — the site won't render without them.

## Where things live in code

| What | File |
|---|---|
| Database queries | `src/lib/db.ts` |
| Table definitions | `src/lib/schema.sql` |
| Admin auth (password check, session cookie) | `src/lib/auth.ts`, `src/middleware.ts` |
| Image/file uploads | `src/lib/blob.ts` |
| Public pages | `src/pages/index.astro`, `about.astro`, `portfolio.astro`, `shop.astro`, `shop/[slug].astro` |
| Admin pages | `src/pages/admin/*.astro` |
| Admin API routes | `src/pages/api/admin/*.ts` |
| Nav / global page chrome (film grain, cursor, nav) | `src/layouts/Layout.astro` |

## Placeholders still worth replacing

- [ ] **Showreel** — `/portfolio` shows a "Showreel coming soon" placeholder. Once you've cut a reel, either add it as a `portfolio_items` entry via `/admin/portfolio` or swap the placeholder block in `src/pages/portfolio.astro` for a real embed.
- [ ] **About photo** — `profileImage` in `src/components/About.astro`.
- [ ] **Switzerland trip photos** — the two `images` in `src/components/Switzerland.astro` (currently Unsplash placeholders).
