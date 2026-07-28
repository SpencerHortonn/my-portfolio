import { defineMiddleware } from 'astro:middleware';
import { ADMIN_COOKIE_NAME, verifySessionToken } from './lib/auth';
import { recordPageView } from './lib/db';

// Paths inside the /admin and /api/admin trees that must stay reachable
// without a session — the password screen itself and the endpoint that
// issues the session cookie.
const PUBLIC_ADMIN_PATHS = new Set(['/admin', '/admin/', '/api/admin/login']);

const VISITOR_COOKIE_NAME = 'visitor_id';

// Anything with a file extension (.js, .png, .ico, .xml, ...) is an asset
// request, not a real page view.
function looksLikeAsset(pathname: string): boolean {
  const lastSegment = pathname.split('/').pop() || '';
  return lastSegment.includes('.');
}

export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname } = context.url;
  const isAdminArea = pathname.startsWith('/admin') || pathname.startsWith('/api/admin');

  if (isAdminArea && !PUBLIC_ADMIN_PATHS.has(pathname)) {
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
  }

  const response = await next();

  // Track real page views only — skip admin, API, and asset requests, and
  // anything that didn't actually render successfully.
  const shouldTrack =
    context.request.method === 'GET' &&
    !isAdminArea &&
    !pathname.startsWith('/api') &&
    !looksLikeAsset(pathname) &&
    response.status === 200;

  if (shouldTrack) {
    let visitorId = context.cookies.get(VISITOR_COOKIE_NAME)?.value;
    if (!visitorId) {
      visitorId = crypto.randomUUID();
      context.cookies.set(VISITOR_COOKIE_NAME, visitorId, {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 365,
      });
    }

    try {
      await recordPageView({
        path: pathname,
        referrer: context.request.headers.get('referer') || '',
        userAgent: context.request.headers.get('user-agent') || '',
        visitorId,
      });
    } catch (err) {
      // Never let analytics logging break a page load.
      console.error('Failed to record page view:', err);
    }
  }

  return response;
});
