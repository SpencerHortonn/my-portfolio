import type { APIRoute } from 'astro';
import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';

export const prerender = false;

// Issues a short-lived token so the browser can upload directly to Blob
// storage, bypassing Vercel's ~4.5MB serverless function payload limit
// (which broke uploads of real photos/videos when they went through
// /api/admin/* as multipart form data instead).
export const POST: APIRoute = async ({ request }) => {
  const body = (await request.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async () => ({
        allowedContentTypes: ['image/*', 'video/*'],
        addRandomSuffix: true,
      }),
      onUploadCompleted: async () => {
        // Nothing to do server-side — the client already has the blob URL.
      },
    });
    return new Response(JSON.stringify(jsonResponse), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: (error as Error).message }), { status: 400 });
  }
};
