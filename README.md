# Spencer Lane — Portfolio

Personal brand website for filmmaker, photographer, and short-form creator Spencer Lane (@spencerchicken). Built with Astro (SSR) + Tailwind CSS + Postgres, deployed on Vercel.

The site is five pages — **Home**, **About**, **Portfolio** (case studies + testimonials), **Shop**, **Work With Me** — plus a password-gated **admin panel** at `/admin` where you edit everything without touching code or redeploying, including which nav tabs are visible.

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
| `DATABASE_URL` | Postgres connection string | Vercel project → Storage → your Postgres/Supabase store → env var, or your provider's dashboard directly |
| `BLOB_READ_WRITE_TOKEN` | Image/file uploads from the admin panel | Vercel project → Storage → your Blob store → env var |
| `ADMIN_PASSWORD_HASH` | The admin password, bcrypt-hashed (never store it in plaintext) | Generate with `node -e "console.log(require('bcryptjs').hashSync('YOUR_PASSWORD', 10))"` |
| `SESSION_SECRET` | Signs the admin session cookie | Any long random string, e.g. `openssl rand -hex 32` |
| `RESEND_API_KEY` | Sends the Work With Me contact form to your inbox | resend.com (free tier) → API Keys |

Set all five in the Vercel dashboard (Project → Settings → Environment Variables) so the live site has them too.

## One-time database setup

Run `src/lib/schema.sql` once against your Postgres database (Supabase's SQL editor, or `psql "$DATABASE_URL" -f src/lib/schema.sql`) to create all tables — it's safe to re-run any time since everything uses `if not exists`. If you're upgrading an existing database that predates the case-studies/testimonials update, run `src/lib/migrations/002_case_studies.sql` instead (adds the new columns/tables additively, no data loss).

**Note:** Supabase's SQL editor rejects multi-statement pastes — run each statement one at a time if you hit that error.

Then seed the existing portfolio items + starter copy: `npm run seed`.

After that, everything is managed from `/admin` — this only needs to happen once.

## Using the admin panel

Go to `/admin`, enter the password, and you'll land on the dashboard:

- **Portfolio** — add/edit/delete/reorder case studies shown on `/portfolio`. Each one has a client name (or leave blank for a personal project), a logo (shown in the homepage client strip), a cover image, and a description of what you delivered (shown on its own `/portfolio/[slug]` page).
- **Testimonials** — quotes that rotate on `/portfolio`; optionally link one to a specific case study to also show it on that project's page.
- **Shop** — add/edit/delete/reorder digital products (LUTs/presets) shown on `/shop`. Products marked **Active** appear publicly with a "Notify me" button (no real checkout yet — see below).
- **Work With Me** — the intro paragraph and services list shown on `/work-with-me`.
- **Messages** — contact form submissions (also emailed to you directly via Resend).
- **Settings** — hero background (image or video) + tagline, About bio/photo, contact info, socials, and checkboxes for which nav tabs are visible (hiding a tab just removes it from the menu — the page still works via direct link).

Every save takes effect on the live site immediately — no rebuild or redeploy needed.

## Turning on real checkout later

The shop is data-modeled for Stripe but checkout isn't wired up. Each product has a `stripe_price_id` field ready to fill in — when you're ready, that's the hook point for a real "Buy" button + Stripe Checkout session instead of the current "Notify me" form.

## Deploy to Vercel

The project already has the `@astrojs/vercel` adapter configured (`output: 'server'`) and `engines.node: "20.x"` pinned in `package.json` (required — the adapter doesn't recognize newer Node majors and falls back to a runtime Vercel has since retired). Push to GitHub and Vercel will build and deploy automatically. Make sure the five environment variables above are set in the Vercel project settings first — the site won't render without them.

## Where things live in code

| What | File |
|---|---|
| Database queries | `src/lib/db.ts` |
| Table definitions | `src/lib/schema.sql` (fresh install), `src/lib/migrations/` (upgrades) |
| Admin auth (password check, session cookie) | `src/lib/auth.ts`, `src/middleware.ts` |
| Image/file uploads | `src/lib/blob.ts` |
| Contact form email | `src/lib/email.ts`, `src/pages/api/contact.ts` |
| Public pages | `src/pages/index.astro`, `about.astro`, `portfolio.astro`, `portfolio/[slug].astro`, `shop.astro`, `shop/[slug].astro`, `work-with-me.astro` |
| Admin pages | `src/pages/admin/*.astro` |
| Admin API routes | `src/pages/api/admin/*.ts` |
| Nav / global page chrome (film grain, cursor, nav visibility) | `src/layouts/Layout.astro` |

## Placeholders still worth replacing

- [ ] **Showreel** — `/portfolio` shows a "Showreel coming soon" placeholder. Once you've cut a reel, swap the placeholder block in `src/pages/portfolio.astro` for a real embed.
- [ ] **Hero background** — set a real video or photo of yourself via `/admin/settings` (currently falls back to the same coastal placeholder image as before).
