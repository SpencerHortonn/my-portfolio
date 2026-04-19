# Spencer Lane — Portfolio

Personal brand website for filmmaker, photographer, and short-form creator Spencer Lane (@spencerchicken). Built with Astro + Tailwind CSS.

## Run locally

```bash
npm install
npm run dev
# → http://localhost:4321
```

## Build for production

```bash
npm run build
npm run preview  # preview the production build locally
```

---

## Where to edit copy

All site copy and configuration lives in **`src/config/content.ts`**. This is the single file to touch for:

- Site name, tagline, and email
- Social links
- Work grid items (titles, captions, image URLs, video embed URLs)
- Past collaborator names and logos

Each section component also has its copy at the **top of that file** in a clearly labeled block — so you can edit inline if you prefer:

| Section | File |
|---|---|
| Hero | `src/components/Hero.astro` |
| About | `src/components/About.astro` |
| Work grid | `src/config/content.ts → workItems` |
| Switzerland | `src/components/Switzerland.astro` |
| Work with me | `src/components/WorkWithMe.astro` |
| Footer | `src/config/content.ts → site + socials` |

---

## Where to swap images

Drop real images into **`public/`** and reference them as `/your-image.jpg` in the config or component files. Or update the Unsplash URLs directly in `src/config/content.ts` and `src/components/Hero.astro`.

For the hero, look for the `heroImage` variable near the top of `src/components/Hero.astro`.

---

## Deploy to Vercel

1. Push the repo to GitHub.
2. Go to [vercel.com](https://vercel.com), click **Add New Project**, and import the repo.
3. Vercel auto-detects Astro. Leave all settings at their defaults.
4. Click **Deploy**. Done — your site is live.

For a custom domain, go to **Project → Settings → Domains** in the Vercel dashboard and add `spencerlane.com` (or whatever you have).

---

## Placeholders to replace before going live

- [ ] **Email** — `hello@spencerlane.com` in `src/config/content.ts → site.email`. Also update the `mailto:` link in `src/layouts/Layout.astro` nav.
- [ ] **Hero image / video** — `heroImage` in `src/components/Hero.astro`. Ideally a looped silent `.mp4` or a strong landscape photo.
- [ ] **About photo** — `profileImage` in `src/components/About.astro`. Portrait orientation works best.
- [ ] **Work samples** — all 6 `workItems` in `src/config/content.ts`. Swap `thumbnail`, `fullUrl`, and `embedUrl` (YouTube/Vimeo) for each piece.
- [ ] **Past collaborator logos** — `collaborators` array in `src/config/content.ts`. Add a hosted logo URL for each brand; text pills show as fallback until you do.
- [ ] **Switzerland images** — the two `images` in `src/components/Switzerland.astro`. Replace Unsplash URLs with real trip photos once you're there.
- [ ] **Email signup** — the form in `src/components/Switzerland.astro` needs to POST to a real service (Mailchimp, ConvertKit, Resend, Loops.so). Search for `TODO: wire this up` in that file.
