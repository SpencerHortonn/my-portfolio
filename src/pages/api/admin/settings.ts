import type { APIRoute } from 'astro';
import { setSetting } from '../../../lib/db';
import { uploadFile } from '../../../lib/blob';

export const prerender = false;

function paragraphs(raw: string): string[] {
  return raw.split(/\n\s*\n/).map(s => s.trim()).filter(Boolean);
}

export const POST: APIRoute = async ({ request, redirect }) => {
  const form = await request.formData();
  const f = (name: string) => String(form.get(name) || '');

  let heroUrl = f('hero_media_url');
  const heroFile = form.get('hero_media_file');
  if (heroFile instanceof File && heroFile.size > 0) {
    heroUrl = await uploadFile(heroFile, 'hero');
  }

  let aboutPhoto = f('about_photo');
  const aboutPhotoFile = form.get('about_photo_file');
  if (aboutPhotoFile instanceof File && aboutPhotoFile.size > 0) {
    aboutPhoto = await uploadFile(aboutPhotoFile, 'about');
  }

  await Promise.all([
    setSetting('site_name', f('site_name')),
    setSetting('hero_tagline', f('hero_tagline')),
    setSetting('hero_media', {
      type: f('hero_media_type') === 'video' ? 'video' : 'image',
      url: heroUrl,
    }),
    setSetting('about_photo', aboutPhoto),
    setSetting('contact', {
      email: f('contact_email'),
      phone: f('contact_phone'),
      phoneTel: f('contact_phone_tel'),
      location: f('contact_location'),
    }),
    setSetting('socials', {
      tiktok: f('social_tiktok'),
      instagram: f('social_instagram'),
      youtube: f('social_youtube'),
    }),
    setSetting('about_paragraphs', paragraphs(f('about_paragraphs'))),
    setSetting('nav_visibility', {
      about: form.get('nav_about') === 'on',
      portfolio: form.get('nav_portfolio') === 'on',
      shop: form.get('nav_shop') === 'on',
      workWithMe: form.get('nav_work_with_me') === 'on',
    }),
  ]);

  return redirect('/admin/settings?saved=1');
};
