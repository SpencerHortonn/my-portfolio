import type { APIRoute } from 'astro';
import { ADMIN_COOKIE_NAME, createSessionToken, verifyPassword } from '../../../lib/auth';

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const form = await request.formData();
  const password = String(form.get('password') || '');

  const ok = password.length > 0 && (await verifyPassword(password));
  if (!ok) {
    return redirect('/admin?error=1');
  }

  cookies.set(ADMIN_COOKIE_NAME, createSessionToken(), {
    httpOnly: true,
    secure: import.meta.env.PROD,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
  });

  return redirect('/admin/dashboard');
};
