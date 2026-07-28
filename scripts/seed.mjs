// One-time seed: ports the existing hardcoded workItems + settings into Postgres.
// Usage: DATABASE_URL="..." node scripts/seed.mjs
import pg from 'pg';

const rawConnectionString =
  process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.POSTGRES_URL_NON_POOLING;
if (!rawConnectionString) {
  console.error('Set DATABASE_URL first, e.g.\n  DATABASE_URL="..." node scripts/seed.mjs');
  process.exit(1);
}

// An embedded `sslmode` query param overrides the `ssl` option below, and
// Supabase/Neon pooler certs aren't in Node's default trust store — strip it.
const isLocal = rawConnectionString.includes('localhost') || rawConnectionString.includes('127.0.0.1');
let connectionString = rawConnectionString;
if (!isLocal) {
  const url = new URL(rawConnectionString);
  url.searchParams.delete('sslmode');
  connectionString = url.toString();
}

const pool = new pg.Pool({
  connectionString,
  ssl: isLocal ? false : { rejectUnauthorized: false },
});

const workItems = [
  {
    title: 'A Short Film About Why I Am Going',
    caption: 'Short film — 2026',
    type: 'video',
    orientation: 'landscape',
    thumbnail: '/my%20video%20work/a%20short%20film%20about%20why%20I%20am%20going/thumbnail.jpg',
    video_file: '/my%20video%20work/a%20short%20film%20about%20why%20I%20am%20going/a%20short%20film%20about%20why%20im%20going.mov',
    embed_url: 'https://www.youtube.com/embed/qPr2DSbFXb0',
    full_url: '',
    images: [],
  },
  {
    title: "I Am a Mosaic of Everyone I've Ever Loved",
    caption: 'Short film — 2025',
    type: 'video',
    orientation: 'landscape',
    thumbnail: "/my%20video%20work/I%20am%20a%20mosaic%20of%20everyone%20i've%20ever%20loved/thumbnail.jpg",
    video_file: "/my%20video%20work/I%20am%20a%20mosaic%20of%20everyone%20i've%20ever%20loved/I%20am%20a%20mosaic%20of%20everyone%20I've%20ever%20loved..mov",
    embed_url: 'https://www.youtube.com/embed/eFJUvO7l91c',
    full_url: '',
    images: [],
  },
  {
    title: 'Azalea District',
    caption: 'Photo walk — Tyler, TX',
    type: 'gallery',
    orientation: 'portrait',
    thumbnail: '/my%20photo%20work/Azalea%20district%20photo%20walk/DSC02501.JPG',
    video_file: '',
    embed_url: '',
    full_url: '',
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
];

const settings = {
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

async function main() {
  const { rows: existing } = await pool.query('select count(*) from portfolio_items');
  if (Number(existing[0].count) > 0) {
    console.log(`portfolio_items already has ${existing[0].count} rows — skipping item seed.`);
  } else {
    for (const [i, item] of workItems.entries()) {
      await pool.query(
        `insert into portfolio_items
          (title, caption, type, orientation, thumbnail, full_url, embed_url, video_file, images, sort_order, published)
         values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,true)`,
        [item.title, item.caption, item.type, item.orientation, item.thumbnail,
         item.full_url, item.embed_url, item.video_file, JSON.stringify(item.images), i]
      );
    }
    console.log(`Seeded ${workItems.length} portfolio items.`);
  }

  for (const [key, value] of Object.entries(settings)) {
    await pool.query(
      `insert into site_settings (key, value) values ($1, $2)
       on conflict (key) do nothing`,
      [key, JSON.stringify(value)]
    );
  }
  console.log('Seeded site_settings (existing keys left untouched).');

  await pool.end();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
