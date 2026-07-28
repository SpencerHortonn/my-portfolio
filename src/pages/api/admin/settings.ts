import type { APIRoute } from 'astro';
import { setSetting } from '../../../lib/db';

export const prerender = false;

function paragraphs(raw: string): string[] {
  return raw.split(/\n\s*\n/).map(s => s.trim()).filter(Boolean);
}

function lines(raw: string): string[] {
  return raw.split('\n').map(s => s.trim()).filter(Boolean);
}

export const POST: APIRoute = async ({ request, redirect }) => {
  const form = await request.formData();
  const f = (name: string) => String(form.get(name) || '');

  await Promise.all([
    setSetting('site_name', f('site_name')),
    setSetting('hero_tagline', f('hero_tagline')),
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
    setSetting('switzerland', {
      dateRange: f('switzerland_date_range'),
      paragraphs: paragraphs(f('switzerland_paragraphs')),
    }),
    setSetting('collaborators', lines(f('collaborators')).map(name => ({ name, logo: '' }))),
  ]);

  return redirect('/admin/settings?saved=1');
};
