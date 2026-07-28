import type { APIRoute } from 'astro';
import {
  createShopProduct,
  deleteShopProduct,
  listShopProducts,
  setShopProductOrder,
  updateShopProduct,
  type ShopProduct,
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
    await deleteShopProduct(Number(form.get('id')));
    return redirect('/admin/shop');
  }

  if (intent === 'move') {
    const id = Number(form.get('id'));
    const direction = String(form.get('direction'));
    const items = await listShopProducts();
    const index = items.findIndex(i => i.id === id);
    const swapWith = direction === 'up' ? index - 1 : index + 1;
    if (index >= 0 && swapWith >= 0 && swapWith < items.length) {
      const a = items[index];
      const b = items[swapWith];
      await setShopProductOrder(a.id, b.sort_order);
      await setShopProductOrder(b.id, a.sort_order);
    }
    return redirect('/admin/shop');
  }

  const id = form.get('id') ? Number(form.get('id')) : null;
  const title = String(form.get('title') || '');

  let coverImage = String(form.get('cover_image') || '');
  const coverFile = form.get('cover_image_file');
  if (coverFile instanceof File && coverFile.size > 0) {
    coverImage = await uploadFile(coverFile, 'shop');
  }

  let fileUrl = String(form.get('file_url') || '');
  const digitalFile = form.get('digital_file');
  if (digitalFile instanceof File && digitalFile.size > 0) {
    fileUrl = await uploadFile(digitalFile, 'shop-files');
  }

  let slug = String(form.get('slug') || '').trim();
  if (!slug) slug = slugify(title);

  const product: Omit<ShopProduct, 'id' | 'created_at'> = {
    title,
    slug,
    description: String(form.get('description') || ''),
    price_cents: Math.round(Number(form.get('price') || 0) * 100),
    currency: 'usd',
    cover_image: coverImage,
    gallery: parseLines(String(form.get('gallery') || '')),
    file_url: fileUrl,
    status: (String(form.get('status') || 'draft')) as ShopProduct['status'],
    stripe_price_id: String(form.get('stripe_price_id') || ''),
    sort_order: Number(form.get('sort_order') || 0),
  };

  if (id) {
    await updateShopProduct(id, product);
  } else {
    const existing = await listShopProducts();
    product.sort_order = existing.length;
    await createShopProduct(product);
  }

  return redirect('/admin/shop');
};
