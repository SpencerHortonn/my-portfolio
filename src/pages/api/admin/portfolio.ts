import type { APIRoute } from 'astro';
import {
  createPortfolioItem,
  deletePortfolioItem,
  listPortfolioItems,
  setPortfolioItemOrder,
  updatePortfolioItem,
  type PortfolioItem,
} from '../../../lib/db';
import { uploadFile } from '../../../lib/blob';

export const prerender = false;

function parseLines(raw: string): string[] {
  return raw.split('\n').map(s => s.trim()).filter(Boolean);
}

function slugify(title: string): string {
  return title.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export const POST: APIRoute = async ({ request, redirect }) => {
  const form = await request.formData();
  const intent = String(form.get('intent') || '');

  if (intent === 'delete') {
    await deletePortfolioItem(Number(form.get('id')));
    return redirect('/admin/portfolio');
  }

  if (intent === 'move') {
    const id = Number(form.get('id'));
    const direction = String(form.get('direction'));
    const items = await listPortfolioItems();
    const index = items.findIndex(i => i.id === id);
    const swapWith = direction === 'up' ? index - 1 : index + 1;
    if (index >= 0 && swapWith >= 0 && swapWith < items.length) {
      const a = items[index];
      const b = items[swapWith];
      await setPortfolioItemOrder(a.id, b.sort_order);
      await setPortfolioItemOrder(b.id, a.sort_order);
    }
    return redirect('/admin/portfolio');
  }

  const id = form.get('id') ? Number(form.get('id')) : null;
  const title = String(form.get('title') || '');

  let thumbnail = String(form.get('thumbnail') || '');
  const thumbFile = form.get('thumbnail_file');
  if (thumbFile instanceof File && thumbFile.size > 0) {
    thumbnail = await uploadFile(thumbFile, 'portfolio');
  }

  let clientLogo = String(form.get('client_logo') || '');
  const clientLogoFile = form.get('client_logo_file');
  if (clientLogoFile instanceof File && clientLogoFile.size > 0) {
    clientLogo = await uploadFile(clientLogoFile, 'portfolio-logos');
  }

  let slug = String(form.get('slug') || '').trim();
  if (!slug) slug = slugify(title);

  const item: Omit<PortfolioItem, 'id' | 'created_at'> = {
    title,
    caption: String(form.get('caption') || ''),
    type: (String(form.get('type') || 'photo')) as PortfolioItem['type'],
    orientation: (String(form.get('orientation') || 'landscape')) as PortfolioItem['orientation'],
    thumbnail,
    full_url: String(form.get('full_url') || ''),
    embed_url: String(form.get('embed_url') || ''),
    video_file: String(form.get('video_file') || ''),
    images: parseLines(String(form.get('images') || '')),
    sort_order: Number(form.get('sort_order') || 0),
    published: form.get('published') === 'on',
    slug,
    client_name: String(form.get('client_name') || ''),
    client_logo: clientLogo,
    description: String(form.get('description') || ''),
  };

  if (id) {
    await updatePortfolioItem(id, item);
  } else {
    const existing = await listPortfolioItems();
    item.sort_order = existing.length;
    await createPortfolioItem(item);
  }

  return redirect('/admin/portfolio');
};
