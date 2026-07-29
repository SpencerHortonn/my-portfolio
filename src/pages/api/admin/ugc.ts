import type { APIRoute } from 'astro';
import {
  createUgcItem,
  deleteUgcItem,
  listUgcItems,
  setUgcItemOrder,
  updateUgcItem,
  type UgcItem,
} from '../../../lib/db';
import { uploadFile } from '../../../lib/blob';

export const prerender = false;

export const POST: APIRoute = async ({ request, redirect }) => {
  const form = await request.formData();
  const intent = String(form.get('intent') || '');

  if (intent === 'delete') {
    await deleteUgcItem(Number(form.get('id')));
    return redirect('/admin/ugc');
  }

  if (intent === 'move') {
    const id = Number(form.get('id'));
    const direction = String(form.get('direction'));
    const items = await listUgcItems();
    const index = items.findIndex(i => i.id === id);
    const swapWith = direction === 'up' ? index - 1 : index + 1;
    if (index >= 0 && swapWith >= 0 && swapWith < items.length) {
      const a = items[index];
      const b = items[swapWith];
      await setUgcItemOrder(a.id, b.sort_order);
      await setUgcItemOrder(b.id, a.sort_order);
    }
    return redirect('/admin/ugc');
  }

  const id = form.get('id') ? Number(form.get('id')) : null;

  let videoFile = String(form.get('video_file') || '');
  const videoFileUpload = form.get('video_file_file');
  if (videoFileUpload instanceof File && videoFileUpload.size > 0) {
    videoFile = await uploadFile(videoFileUpload, 'ugc');
  }

  let thumbnail = String(form.get('thumbnail') || '');
  const thumbFile = form.get('thumbnail_file');
  if (thumbFile instanceof File && thumbFile.size > 0) {
    thumbnail = await uploadFile(thumbFile, 'ugc');
  }

  const u: Omit<UgcItem, 'id' | 'created_at'> = {
    brand_name: String(form.get('brand_name') || ''),
    platform: String(form.get('platform') || ''),
    caption: String(form.get('caption') || ''),
    video_file: videoFile,
    embed_url: String(form.get('embed_url') || ''),
    thumbnail,
    sort_order: Number(form.get('sort_order') || 0),
    published: form.get('published') === 'on',
  };

  if (id) {
    await updateUgcItem(id, u);
  } else {
    const existing = await listUgcItems();
    u.sort_order = existing.length;
    await createUgcItem(u);
  }

  return redirect('/admin/ugc');
};
