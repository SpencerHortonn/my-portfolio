import type { APIRoute } from 'astro';
import {
  createTestimonial,
  deleteTestimonial,
  listTestimonials,
  setTestimonialOrder,
  updateTestimonial,
  type Testimonial,
} from '../../../lib/db';
import { uploadFile } from '../../../lib/blob';

export const prerender = false;

export const POST: APIRoute = async ({ request, redirect }) => {
  const form = await request.formData();
  const intent = String(form.get('intent') || '');

  if (intent === 'delete') {
    await deleteTestimonial(Number(form.get('id')));
    return redirect('/admin/testimonials');
  }

  if (intent === 'move') {
    const id = Number(form.get('id'));
    const direction = String(form.get('direction'));
    const items = await listTestimonials();
    const index = items.findIndex(i => i.id === id);
    const swapWith = direction === 'up' ? index - 1 : index + 1;
    if (index >= 0 && swapWith >= 0 && swapWith < items.length) {
      const a = items[index];
      const b = items[swapWith];
      await setTestimonialOrder(a.id, b.sort_order);
      await setTestimonialOrder(b.id, a.sort_order);
    }
    return redirect('/admin/testimonials');
  }

  const id = form.get('id') ? Number(form.get('id')) : null;

  let photo = String(form.get('photo') || '');
  const photoFile = form.get('photo_file');
  if (photoFile instanceof File && photoFile.size > 0) {
    photo = await uploadFile(photoFile, 'testimonials');
  }

  const caseStudyRaw = String(form.get('case_study_id') || '');

  const t: Omit<Testimonial, 'id' | 'created_at'> = {
    quote: String(form.get('quote') || ''),
    author_name: String(form.get('author_name') || ''),
    author_role: String(form.get('author_role') || ''),
    photo,
    case_study_id: caseStudyRaw ? Number(caseStudyRaw) : null,
    sort_order: Number(form.get('sort_order') || 0),
    published: form.get('published') === 'on',
  };

  if (id) {
    await updateTestimonial(id, t);
  } else {
    const existing = await listTestimonials();
    t.sort_order = existing.length;
    await createTestimonial(t);
  }

  return redirect('/admin/testimonials');
};
