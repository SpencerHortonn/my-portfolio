import { Pool } from 'pg';

// Reuse a single pool across warm serverless invocations.
declare global {
  // eslint-disable-next-line no-var
  var __pgPool: Pool | undefined;
}

function getPool(): Pool {
  if (!globalThis.__pgPool) {
    // POSTGRES_URL / POSTGRES_URL_NON_POOLING are what Vercel's Supabase/Neon
    // marketplace integrations inject automatically — DATABASE_URL is the
    // generic name we ask for in README if you set it up by hand instead.
    const connectionString =
      process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.POSTGRES_URL_NON_POOLING;
    if (!connectionString) {
      throw new Error('DATABASE_URL (or POSTGRES_URL) is not set — see README for setup.');
    }
    globalThis.__pgPool = new Pool({
      connectionString,
      ssl: connectionString.includes('localhost') ? false : { rejectUnauthorized: false },
      max: 5,
    });
  }
  return globalThis.__pgPool;
}

export async function query<T = any>(text: string, params: any[] = []): Promise<T[]> {
  const pool = getPool();
  const res = await pool.query(text, params);
  return res.rows as T[];
}

export async function queryOne<T = any>(text: string, params: any[] = []): Promise<T | null> {
  const rows = await query<T>(text, params);
  return rows[0] ?? null;
}

// ── Portfolio items ────────────────────────────────────────────

export interface PortfolioItem {
  id: number;
  title: string;
  caption: string;
  type: 'video' | 'photo' | 'gallery';
  orientation: 'landscape' | 'portrait';
  thumbnail: string;
  full_url: string;
  embed_url: string;
  video_file: string;
  images: string[];
  sort_order: number;
  published: boolean;
  created_at: string;
}

export function listPortfolioItems(opts: { publishedOnly?: boolean } = {}): Promise<PortfolioItem[]> {
  const where = opts.publishedOnly ? 'where published = true' : '';
  return query<PortfolioItem>(
    `select * from portfolio_items ${where} order by sort_order asc, id asc`
  );
}

export function getPortfolioItem(id: number): Promise<PortfolioItem | null> {
  return queryOne<PortfolioItem>('select * from portfolio_items where id = $1', [id]);
}

export function createPortfolioItem(item: Omit<PortfolioItem, 'id' | 'created_at'>): Promise<PortfolioItem> {
  return queryOne<PortfolioItem>(
    `insert into portfolio_items
      (title, caption, type, orientation, thumbnail, full_url, embed_url, video_file, images, sort_order, published)
     values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
     returning *`,
    [
      item.title, item.caption, item.type, item.orientation, item.thumbnail,
      item.full_url, item.embed_url, item.video_file, JSON.stringify(item.images),
      item.sort_order, item.published,
    ]
  ) as Promise<PortfolioItem>;
}

export function updatePortfolioItem(id: number, item: Omit<PortfolioItem, 'id' | 'created_at'>): Promise<PortfolioItem> {
  return queryOne<PortfolioItem>(
    `update portfolio_items set
      title=$1, caption=$2, type=$3, orientation=$4, thumbnail=$5,
      full_url=$6, embed_url=$7, video_file=$8, images=$9, sort_order=$10, published=$11
     where id=$12
     returning *`,
    [
      item.title, item.caption, item.type, item.orientation, item.thumbnail,
      item.full_url, item.embed_url, item.video_file, JSON.stringify(item.images),
      item.sort_order, item.published, id,
    ]
  ) as Promise<PortfolioItem>;
}

export function deletePortfolioItem(id: number): Promise<void> {
  return query('delete from portfolio_items where id = $1', [id]).then(() => undefined);
}

export function setPortfolioItemOrder(id: number, sortOrder: number): Promise<void> {
  return query('update portfolio_items set sort_order = $1 where id = $2', [sortOrder, id]).then(() => undefined);
}

// ── Shop products ──────────────────────────────────────────────

export interface ShopProduct {
  id: number;
  title: string;
  slug: string;
  description: string;
  price_cents: number;
  currency: string;
  cover_image: string;
  gallery: string[];
  file_url: string;
  status: 'draft' | 'active';
  stripe_price_id: string;
  sort_order: number;
  created_at: string;
}

export function listShopProducts(opts: { activeOnly?: boolean } = {}): Promise<ShopProduct[]> {
  const where = opts.activeOnly ? "where status = 'active'" : '';
  return query<ShopProduct>(
    `select * from shop_products ${where} order by sort_order asc, id asc`
  );
}

export function getShopProduct(id: number): Promise<ShopProduct | null> {
  return queryOne<ShopProduct>('select * from shop_products where id = $1', [id]);
}

export function getShopProductBySlug(slug: string): Promise<ShopProduct | null> {
  return queryOne<ShopProduct>('select * from shop_products where slug = $1', [slug]);
}

export function createShopProduct(p: Omit<ShopProduct, 'id' | 'created_at'>): Promise<ShopProduct> {
  return queryOne<ShopProduct>(
    `insert into shop_products
      (title, slug, description, price_cents, currency, cover_image, gallery, file_url, status, stripe_price_id, sort_order)
     values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
     returning *`,
    [
      p.title, p.slug, p.description, p.price_cents, p.currency, p.cover_image,
      JSON.stringify(p.gallery), p.file_url, p.status, p.stripe_price_id, p.sort_order,
    ]
  ) as Promise<ShopProduct>;
}

export function updateShopProduct(id: number, p: Omit<ShopProduct, 'id' | 'created_at'>): Promise<ShopProduct> {
  return queryOne<ShopProduct>(
    `update shop_products set
      title=$1, slug=$2, description=$3, price_cents=$4, currency=$5, cover_image=$6,
      gallery=$7, file_url=$8, status=$9, stripe_price_id=$10, sort_order=$11
     where id=$12
     returning *`,
    [
      p.title, p.slug, p.description, p.price_cents, p.currency, p.cover_image,
      JSON.stringify(p.gallery), p.file_url, p.status, p.stripe_price_id, p.sort_order, id,
    ]
  ) as Promise<ShopProduct>;
}

export function deleteShopProduct(id: number): Promise<void> {
  return query('delete from shop_products where id = $1', [id]).then(() => undefined);
}

export function setShopProductOrder(id: number, sortOrder: number): Promise<void> {
  return query('update shop_products set sort_order = $1 where id = $2', [sortOrder, id]).then(() => undefined);
}

// ── Site settings (key/value JSON) ─────────────────────────────

export async function getSetting<T = any>(key: string, fallback: T): Promise<T> {
  const row = await queryOne<{ value: T }>('select value from site_settings where key = $1', [key]);
  return row ? row.value : fallback;
}

export async function getSettings(keys: string[]): Promise<Record<string, any>> {
  const rows = await query<{ key: string; value: any }>(
    'select key, value from site_settings where key = any($1)',
    [keys]
  );
  return Object.fromEntries(rows.map(r => [r.key, r.value]));
}

export function setSetting(key: string, value: any): Promise<void> {
  return query(
    `insert into site_settings (key, value) values ($1, $2)
     on conflict (key) do update set value = excluded.value`,
    [key, JSON.stringify(value)]
  ).then(() => undefined);
}

// ── Subscribers ─────────────────────────────────────────────────

export function addSubscriber(email: string): Promise<void> {
  return query(
    'insert into subscribers (email) values ($1) on conflict (email) do nothing',
    [email]
  ).then(() => undefined);
}

export function listSubscribers(): Promise<{ id: number; email: string; created_at: string }[]> {
  return query('select * from subscribers order by created_at desc');
}
