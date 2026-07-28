import { defineMiddleware } from 'astro:middleware';
import { ADMIN_COOKIE_NAME, verifySessionToken } from './lib/auth';

// Paths inside the /admin and /api/admin trees that must stay reachable
// without a session — the password screen itself and the endpoint that
// issues the session cookie.
const PUBLIC_ADMIN_PATHS = new Set(['/admin', '/admin/', '/api/admin/login']);

export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname } = context.url;
  const isAdminArea = pathname.startsWith('/admin') || pathname.startsWith('/api/admin');

  if (!isAdminArea || PUBLIC_ADMIN_PATHS.has(pathname)) {
    return next();
  }

  const token = context.cookies.get(ADMIN_COOKIE_NAME)?.value;
  const authed = verifySessionToken(token);

  if (!authed) {
    if (pathname.startsWith('/api/admin')) {
      return new Response(JSON.stringify({ error: 'unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    return context.redirect('/admin');
  }

  return next();
});
