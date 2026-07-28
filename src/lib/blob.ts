import { put } from '@vercel/blob';

export async function uploadFile(file: File, folder: string): Promise<string> {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) throw new Error('BLOB_READ_WRITE_TOKEN is not set — see README for setup.');

  const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, '_');
  const pathname = `${folder}/${Date.now()}-${safeName}`;

  const blob = await put(pathname, file, {
    access: 'public',
    token,
    addRandomSuffix: false,
  });

  return blob.url;
}
