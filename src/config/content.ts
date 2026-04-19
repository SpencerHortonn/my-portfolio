// ============================================================
// SITE CONTENT CONFIG
// This is the single source of truth for copy, links, and
// image URLs. Edit here — changes ripple through the whole site.
// ============================================================

export const site = {
  name: 'Spencer Lane',
  tagline: "17. A camera. Enough light to find what's real.",
  location: 'Tyler, TX',
  // TODO: swap in real email before going live
  email: 'hello@spencerlane.com',
};

export const socials = {
  // All handles are @spencerchicken
  tiktok:    'https://www.tiktok.com/@spencerchicken',
  instagram: 'https://www.instagram.com/spencerchicken',
  youtube:   'https://www.youtube.com/@spencerchicken',
};

// ---- Work grid ------------------------------------------------
// orientation: 'landscape' | 'portrait'
// type: 'photo' | 'video'
// embedUrl: YouTube/Vimeo embed URL (leave '' until you have one)
// fullUrl: high-res photo for the lightbox (leave '' to use thumbnail)
// TODO: replace all thumbnail/fullUrl/embedUrl values with real work
export const workItems = [
  {
    id: 1,
    title: 'The Quiet Hours',
    caption: 'Short film — Tyler, TX',
    type: 'video' as const,
    orientation: 'landscape' as const,
    thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80&auto=format&fit=crop',
    embedUrl: '', // TODO: paste YouTube/Vimeo embed URL here
    fullUrl: '',
  },
  {
    id: 2,
    title: 'Golden Hour',
    caption: 'Photo series — coastal',
    type: 'photo' as const,
    orientation: 'landscape' as const,
    thumbnail: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80&auto=format&fit=crop',
    embedUrl: '',
    fullUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600&q=90&auto=format&fit=crop',
  },
  {
    id: 3,
    title: 'Before the Wave',
    caption: 'Short-form — surf & water',
    type: 'video' as const,
    orientation: 'portrait' as const,
    thumbnail: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=600&q=80&auto=format&fit=crop',
    embedUrl: '',
    fullUrl: '',
  },
  {
    id: 4,
    title: 'Texas Highways',
    caption: 'Road trip — summer 2025',
    type: 'photo' as const,
    orientation: 'landscape' as const,
    thumbnail: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&q=80&auto=format&fit=crop',
    embedUrl: '',
    fullUrl: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=1600&q=90&auto=format&fit=crop',
  },
  {
    id: 5,
    title: 'Portrait Series Vol. 1',
    caption: 'Portraits — available light only',
    type: 'photo' as const,
    orientation: 'portrait' as const,
    thumbnail: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&q=80&auto=format&fit=crop',
    embedUrl: '',
    fullUrl: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=1200&q=90&auto=format&fit=crop',
  },
  {
    id: 6,
    title: 'Winter Light',
    caption: 'Cinematic travel — PNW',
    type: 'video' as const,
    orientation: 'landscape' as const,
    thumbnail: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&q=80&auto=format&fit=crop',
    embedUrl: '',
    fullUrl: '',
  },
];

// ---- Past collaborators ---------------------------------------
// TODO: add real logo URLs. Name is shown as text until logo exists.
export const collaborators = [
  { name: 'Lightbox Collective', logo: '' }, // TODO: add logo URL
  { name: 'Brand Partner',       logo: '' }, // TODO: replace with real brand
  { name: 'Brand Partner',       logo: '' }, // TODO: replace with real brand
];
