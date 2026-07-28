import type { APIRoute } from 'astro';
import { createContactMessage } from '../../lib/db';
import { sendContactNotification } from '../../lib/email';

export const prerender = false;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const POST: APIRoute = async ({ request }) => {
  let name = '';
  let email = '';
  let message = '';
  try {
    const body = await request.json();
    name = String(body?.name || '').trim();
    email = String(body?.email || '').trim().toLowerCase();
    message = String(body?.message || '').trim();
  } catch (_) {
    return new Response(JSON.stringify({ error: 'invalid request' }), { status: 400 });
  }

  if (!name || !message || !EMAIL_RE.test(email)) {
    return new Response(JSON.stringify({ error: 'missing or invalid fields' }), { status: 400 });
  }

  await createContactMessage({ name, email, message });

  try {
    await sendContactNotification({ name, email, message });
  } catch (err) {
    // The message is already saved — don't fail the request over email delivery.
    console.error('Failed to send contact notification email:', err);
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
