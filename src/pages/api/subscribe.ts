import type { APIRoute } from 'astro';
import { addSubscriber } from '../../lib/db';

export const prerender = false;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const POST: APIRoute = async ({ request }) => {
  let email = '';
  try {
    const body = await request.json();
    email = String(body?.email || '').trim().toLowerCase();
  } catch (_) {
    return new Response(JSON.stringify({ error: 'invalid request' }), { status: 400 });
  }

  if (!EMAIL_RE.test(email)) {
    return new Response(JSON.stringify({ error: 'invalid email' }), { status: 400 });
  }

  await addSubscriber(email);
  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
