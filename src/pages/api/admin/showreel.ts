import type { APIRoute } from 'astro';
import { setSetting } from '../../../lib/db';
import { uploadFile } from '../../../lib/blob';

export const prerender = false;

export const POST: APIRoute = async ({ request, redirect }) => {
  const form = await request.formData();

  let videoUrl = String(form.get('showreel_video_url') || '');
  const videoFile = form.get('showreel_video_file');
  if (videoFile instanceof File && videoFile.size > 0) {
    videoUrl = await uploadFile(videoFile, 'showreel');
  }

  await setSetting('showreel', {
    hidden: form.get('showreel_hidden') === 'on',
    videoUrl,
    embedUrl: String(form.get('showreel_embed_url') || ''),
  });

  return redirect('/admin/portfolio?saved=1');
};
