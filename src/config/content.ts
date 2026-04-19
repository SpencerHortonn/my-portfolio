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
  tiktok:    'https://www.tiktok.com/@spencerchicken',
  instagram: 'https://www.instagram.com/spencerchicken',
  youtube:   'https://www.youtube.com/@spencerchicken',
};

// ---- Work grid ------------------------------------------------
// type: 'video' | 'photo' | 'gallery'
//
// video:
//   videoFile — path to local .mov/.mp4 in /public (works on localhost)
//   embedUrl  — YouTube/Vimeo embed URL (use this for Vercel deploy — local .MOV
//               files are too large to host as static assets)
//
// photo:
//   fullUrl   — high-res version shown in lightbox (falls back to thumbnail)
//
// gallery:
//   images[]  — array of local paths shown as a slideshow in the lightbox
//   thumbnail — first image used as the grid tile cover
//
// ⚠️  VIDEO DEPLOY NOTE: The two .MOV files are 581 MB and 1.2 GB respectively.
//     Vercel's static hosting limit is ~100 MB per file. Before deploying:
//     1. Upload both films to YouTube (unlisted is fine) or Vimeo
//     2. Grab the embed URL (e.g. https://www.youtube.com/embed/VIDEO_ID)
//     3. Paste it into embedUrl and clear videoFile for each item
export const workItems = [
  {
    id: 1,
    title: 'A Short Film About Why I Am Going',
    caption: 'Short film — 2026',
    type: 'video' as const,
    orientation: 'landscape' as const,
    thumbnail: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=80&auto=format&fit=crop',
    // Local file — works on localhost. See deploy note above.
    videoFile: '/my%20video%20work/A%20short%20film%20about%20why%20I%20am%20going.MOV',
    embedUrl: '', // TODO: paste YouTube/Vimeo embed URL before deploying to Vercel
    fullUrl: '',
  },
  {
    id: 2,
    title: "I Am a Mosaic of Everyone I've Ever Loved",
    caption: 'Short film — 2025',
    type: 'video' as const,
    orientation: 'landscape' as const,
    thumbnail: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=800&q=80&auto=format&fit=crop',
    videoFile: "/my%20video%20work/I%20am%20a%20mosaic%20of%20everyone%20I've%20ever%20loved..mov",
    embedUrl: '',
    fullUrl: '',
  },
  {
    id: 3,
    title: 'Azalea District',
    caption: 'Photo walk — Tyler, TX',
    type: 'gallery' as const,
    orientation: 'portrait' as const,
    thumbnail: '/my%20photo%20work/Azalea%20district%20photo%20walk/DSC02501.JPG',
    videoFile: '',
    embedUrl: '',
    fullUrl: '',
    // All 12 frames from the walk — shown as a lightbox slideshow
    images: [
      '/my%20photo%20work/Azalea%20district%20photo%20walk/DSC02491.JPG',
      '/my%20photo%20work/Azalea%20district%20photo%20walk/DSC02492.JPG',
      '/my%20photo%20work/Azalea%20district%20photo%20walk/DSC02497.JPG',
      '/my%20photo%20work/Azalea%20district%20photo%20walk/DSC02501.JPG',
      '/my%20photo%20work/Azalea%20district%20photo%20walk/DSC02509.JPG',
      '/my%20photo%20work/Azalea%20district%20photo%20walk/DSC02513.JPG',
      '/my%20photo%20work/Azalea%20district%20photo%20walk/DSC02552.JPG',
      '/my%20photo%20work/Azalea%20district%20photo%20walk/DSC02553.JPG',
      '/my%20photo%20work/Azalea%20district%20photo%20walk/DSC02557.JPG',
      '/my%20photo%20work/Azalea%20district%20photo%20walk/DSC02570.JPG',
      '/my%20photo%20work/Azalea%20district%20photo%20walk/DSC02571.JPG',
      '/my%20photo%20work/Azalea%20district%20photo%20walk/DSC02574.JPG',
    ],
  },
  // ---- Placeholders — swap in real work as you shoot it ----
  {
    id: 4,
    title: 'Texas Highways',
    caption: 'Road trip — summer 2025',
    type: 'photo' as const,
    orientation: 'landscape' as const,
    thumbnail: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80&auto=format&fit=crop',
    videoFile: '',
    embedUrl: '',
    fullUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1600&q=90&auto=format&fit=crop',
    images: [],
  },
  {
    id: 5,
    title: 'Portrait Series Vol. 1',
    caption: 'Portraits — window light only',
    type: 'photo' as const,
    orientation: 'portrait' as const,
    thumbnail: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&q=80&auto=format&fit=crop',
    videoFile: '',
    embedUrl: '',
    fullUrl: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=1200&q=90&auto=format&fit=crop',
    images: [],
  },
  {
    id: 6,
    title: 'Winter Light',
    caption: 'Travel — PNW, January',
    type: 'video' as const,
    orientation: 'landscape' as const,
    thumbnail: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=800&q=80&auto=format&fit=crop',
    videoFile: '',
    embedUrl: '',
    fullUrl: '',
    images: [],
  },
];

// ---- Past collaborators ---------------------------------------
export const collaborators = [
  { name: 'Lightbox Collective', logo: '' },
  { name: 'Brand Partner',       logo: '' },
  { name: 'Brand Partner',       logo: '' },
];
