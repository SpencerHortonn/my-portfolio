// Fallback values used until the corresponding row exists in `site_settings`.
// Edit these live from /admin/settings once the database is set up — this
// file only matters before the first save.

export const DEFAULT_SETTINGS = {
  site_name: 'Spencer Lane',
  hero_tagline: "17. A camera. Enough light to find what's real.",

  hero_media: {
    type: 'image' as 'image' | 'video',
    url: '/pictures%20of%20me/IMG_4652.JPG',
  },

  about_photo: '/image%20for%20about%20me.JPG',

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

  work_with_me: {
    intro: "I make content that lands — not because of the specs, but because I'm paying attention. If your brand is doing something worth showing, I want to help show it.",
    services: [
      { title: 'Short-form video', desc: 'TikTok, Reels, Shorts — native-format content made by someone who actually lives on the platforms.' },
      { title: 'Photography', desc: 'Available-light portraits, travel editorial, lifestyle product work. No studio required.' },
      { title: 'Cinematic content', desc: 'Longer-form brand films with a travel or adventure angle. Story first, specs second.' },
      { title: 'UGC-adjacent', desc: 'Creator-feel content without the agency price tag. Raw, honest, on-brand.' },
    ],
  },

  nav_visibility: {
    about: true,
    portfolio: true,
    shop: true,
    workWithMe: true,
  },

  showreel: {
    hidden: false,
    videoUrl: '',
    embedUrl: '',
  },
};

export type SiteSettings = typeof DEFAULT_SETTINGS;
