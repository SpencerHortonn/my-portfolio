// Fallback values used until the corresponding row exists in `site_settings`.
// Edit these live from /admin/settings once the database is set up — this
// file only matters before the first save.

export const DEFAULT_SETTINGS = {
  site_name: 'Spencer Lane',
  hero_tagline: "17. A camera. Enough light to find what's real.",

  contact: {
    email: 'spencerhortonmedia@gmail.com',
    phone: '(903) 521-6471',
    phoneTel: 'tel:+19035216471',
    location: 'Tyler, TX',
  },

  socials: {
    tiktok: 'https://www.tiktok.com/@spencerchicken',
    instagram: 'https://www.instagram.com/spencerchicken',
    youtube: 'https://www.youtube.com/@spencerchicken',
  },

  about_paragraphs: [
    "I'm 17, based in Tyler, Texas, and I've been making things with a camera long enough that it stopped feeling like a hobby and started feeling like the only thing that made sense. Films, photos, short-form content — I care about what a frame makes you feel, not how it performs.",
    "I'm not interested in building a career that looks good on paper but costs everything else. I'd rather make work that means something and figure out the money as it comes than flip that around. That's not a philosophy I picked up somewhere. It's just what's been true every time I've been honest about it.",
    "This June I'm heading to Switzerland for YWAM DTS — five months through November. It's not a gap year. It's not an escape. It's where I'm supposed to be, and I can't really explain it better than that. I'm bringing my camera.",
  ],

  switzerland: {
    dateRange: 'June 28 – Nov 22, 2026',
    paragraphs: [
      "On June 28th I leave for Switzerland for YWAM DTS — a five-month discipleship and mission training program that runs through November 22nd. It's not a gap year. It's not a sabbatical. It's where I'm supposed to be, and I can't really explain it better than that.",
      "I'll be creating the whole time — the places, the people, whatever God's doing in the middle of it. If you want to follow along, drop your email below. I'll reach out when things go live.",
    ],
  },

  collaborators: [
    { name: 'Lightbox Collective', logo: '' },
    { name: 'Brand Partner', logo: '' },
    { name: 'Brand Partner', logo: '' },
  ],
};

export type SiteSettings = typeof DEFAULT_SETTINGS;
