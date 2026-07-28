import type { APIRoute } from 'astro';
import { ADMIN_COOKIE_NAME } from '../../../lib/auth';

export const prerender = false;

export const POST: APIRoute = async ({ cookies, redirect }) => {
  cookies.delete(ADMIN_COOKIE_NAME, { path: '/' });
  return redirect('/admin');
};
