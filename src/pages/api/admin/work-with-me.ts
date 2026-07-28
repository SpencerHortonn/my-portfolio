import type { APIRoute } from 'astro';
import { setSetting } from '../../../lib/db';

export const prerender = false;

function parseServices(raw: string): { title: string; desc: string }[] {
  return raw
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean)
    .map(line => {
      const [title, ...rest] = line.split('|');
      return { title: (title || '').trim(), desc: rest.join('|').trim() };
    })
    .filter(s => s.title);
}

export const POST: APIRoute = async ({ request, redirect }) => {
  const form = await request.formData();

  await setSetting('work_with_me', {
    intro: String(form.get('intro') || ''),
    services: parseServices(String(form.get('services') || '')),
  });

  return redirect('/admin/work-with-me?saved=1');
};
