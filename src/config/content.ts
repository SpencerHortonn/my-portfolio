// ============================================================
// SITE CONTENT CONFIG — single source of truth
// ============================================================

export const site = {
  name:     'Spencer Lane',
  tagline:  "17. A camera. Enough light to find what's real.",
  location: 'Tyler, TX',
  email:    'spencerhortonmedia@gmail.com',
  phone:    '(903) 521-6471',
  phoneTel: 'tel:+19035216471',
};

export const socials = {
  // All handles @spencerchicken
  tiktok:    'https://www.tiktok.com/@spencerchicken',
  instagram: 'https://www.instagram.com/spencerchicken',
  youtube:   'https://www.youtube.com/@spencerchicken',
};

// ---- Work grid ------------------------------------------------
// Photos curated for a Kodak Portra / analog film look.
// CSS color grade (contrast · saturate · sepia · brightness) is applied
// site-wide in Layout.astro — swap the filter there to regrade everything at once.
// TODO: replace thumbnail / fullUrl / embedUrl with real work samples.
export const workItems = [
  {
    id: 1,
    title: 'The Quiet Hours',
    caption: 'Short film — Tyler, TX',
    type: 'video' as const,
    orientation: 'landscape' as const,
    // Mountain road at golden hour — warm Portra feel
    thumbnail: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=80&auto=format&fit=crop',
    embedUrl: '', // TODO: YouTube/Vimeo embed URL
    fullUrl: '',
  },
  {
    id: 2,
    title: 'Golden Hour',
    caption: 'Photo series — wide open',
    type: 'photo' as const,
    orientation: 'landscape' as const,
    // Wheat field, warm light — analog travel feel
    thumbnail: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=800&q=80&auto=format&fit=crop',
    embedUrl: '',
    fullUrl: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=1600&q=90&auto=format&fit=crop',
  },
  {
    id: 3,
    title: 'Before the Wave',
    caption: 'Short-form — surf & water',
    type: 'video' as const,
    orientation: 'portrait' as const,
    // Moody ocean, vertical crop — native short-form format
    thumbnail: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=600&q=80&auto=format&fit=crop',
    embedUrl: '',
    fullUrl: '',
  },
  {
    id: 4,
    title: 'Into the Trees',
    caption: 'Cinematic — available light',
    type: 'photo' as const,
    orientation: 'landscape' as const,
    // Dark forest with shafts of light — filmic, moody
    thumbnail: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80&auto=format&fit=crop',
    embedUrl: '',
    fullUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1600&q=90&auto=format&fit=crop',
  },
  {
    id: 5,
    title: 'Portrait Series Vol. 1',
    caption: 'Portraits — window light only',
    type: 'photo' as const,
    orientation: 'portrait' as const,
    // Warm natural-light portrait — Portra skin tones
    thumbnail: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&q=80&auto=format&fit=crop',
    embedUrl: '',
    fullUrl: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=1200&q=90&auto=format&fit=crop',
  },
  {
    id: 6,
    title: 'Winter Light',
    caption: 'Travel — PNW, January',
    type: 'video' as const,
    orientation: 'landscape' as const,
    // Mountain lake at blue hour — quiet, cinematic
    thumbnail: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=800&q=80&auto=format&fit=crop',
    embedUrl: '',
    fullUrl: '',
  },
];

// ---- Past collaborators ---------------------------------------
// TODO: add real logo URLs. Text pill shows until logo is provided.
export const collaborators = [
  { name: 'Lightbox Collective', logo: '' }, // TODO: add logo URL
  { name: 'Brand Partner',       logo: '' }, // TODO: replace
  { name: 'Brand Partner',       logo: '' }, // TODO: replace
];
