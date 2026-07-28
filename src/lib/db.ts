import { Pool } from 'pg';

// Reuse a single pool across warm serverless invocations.
declare global {
  // eslint-disable-next-line no-var
  var __pgPool: Pool | undefined;
}

// Supabase/Neon poolers use certs that aren't in Node's default trust store.
// An embedded `sslmode` query param takes priority over the `ssl` option we
// pass to `Pool`, so strip it and rely on our own permissive setting instead.
function stripSslMode(connStr: string): string {
  try {
    const url = new URL(connStr);
    url.searchParams.delete('sslmode');
    return url.toString();
  } catch {
    return connStr;
  }
}

function getPool(): Pool {
  if (!globalThis.__pgPool) {
    // POSTGRES_URL / POSTGRES_URL_NON_POOLING are what Vercel's Supabase/Neon
    // marketplace integrations inject automatically — DATABASE_URL is the
    // generic name we ask for in README if you set it up by hand instead.
    const rawConnectionString =
      process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.POSTGRES_URL_NON_POOLING;
    if (!rawConnectionString) {
      throw new Error('DATABASE_URL (or POSTGRES_URL) is not set — see README for setup.');
    }
    const isLocal = rawConnectionString.includes('localhost') || rawConnectionString.includes('127.0.0.1');
    const connectionString = isLocal ? rawConnectionString : stripSslMode(rawConnectionString);
    globalThis.__pgPool = new Pool({
      connectionString,
      ssl: isLocal ? false : { rejectUnauthorized: false },
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
  // Case-study fields
  slug: string;
  client_name: string;
  client_logo: string;
  description: string;
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

export function getPortfolioItemBySlug(slug: string): Promise<PortfolioItem | null> {
  return queryOne<PortfolioItem>('select * from portfolio_items where slug = $1', [slug]);
}

export function createPortfolioItem(item: Omit<PortfolioItem, 'id' | 'created_at'>): Promise<PortfolioItem> {
  return queryOne<PortfolioItem>(
    `insert into portfolio_items
      (title, caption, type, orientation, thumbnail, full_url, embed_url, video_file, images, sort_order, published, slug, client_name, client_logo, description)
     values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)
     returning *`,
    [
      item.title, item.caption, item.type, item.orientation, item.thumbnail,
      item.full_url, item.embed_url, item.video_file, JSON.stringify(item.images),
      item.sort_order, item.published, item.slug, item.client_name, item.client_logo, item.description,
    ]
  ) as Promise<PortfolioItem>;
}

export function updatePortfolioItem(id: number, item: Omit<PortfolioItem, 'id' | 'created_at'>): Promise<PortfolioItem> {
  return queryOne<PortfolioItem>(
    `update portfolio_items set
      title=$1, caption=$2, type=$3, orientation=$4, thumbnail=$5,
      full_url=$6, embed_url=$7, video_file=$8, images=$9, sort_order=$10, published=$11,
      slug=$12, client_name=$13, client_logo=$14, description=$15
     where id=$16
     returning *`,
    [
      item.title, item.caption, item.type, item.orientation, item.thumbnail,
      item.full_url, item.embed_url, item.video_file, JSON.stringify(item.images),
      item.sort_order, item.published, item.slug, item.client_name, item.client_logo, item.description, id,
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

// ── Testimonials ────────────────────────────────────────────────

export interface Testimonial {
  id: number;
  quote: string;
  author_name: string;
  author_role: string;
  photo: string;
  case_study_id: number | null;
  sort_order: number;
  published: boolean;
  created_at: string;
}

export function listTestimonials(opts: { publishedOnly?: boolean } = {}): Promise<Testimonial[]> {
  const where = opts.publishedOnly ? 'where published = true' : '';
  return query<Testimonial>(
    `select * from testimonials ${where} order by sort_order asc, id asc`
  );
}

export function listTestimonialsForCaseStudy(caseStudyId: number): Promise<Testimonial[]> {
  return query<Testimonial>(
    `select * from testimonials where published = true and case_study_id = $1 order by sort_order asc, id asc`,
    [caseStudyId]
  );
}

export function getTestimonial(id: number): Promise<Testimonial | null> {
  return queryOne<Testimonial>('select * from testimonials where id = $1', [id]);
}

export function createTestimonial(t: Omit<Testimonial, 'id' | 'created_at'>): Promise<Testimonial> {
  return queryOne<Testimonial>(
    `insert into testimonials (quote, author_name, author_role, photo, case_study_id, sort_order, published)
     values ($1,$2,$3,$4,$5,$6,$7)
     returning *`,
    [t.quote, t.author_name, t.author_role, t.photo, t.case_study_id, t.sort_order, t.published]
  ) as Promise<Testimonial>;
}

export function updateTestimonial(id: number, t: Omit<Testimonial, 'id' | 'created_at'>): Promise<Testimonial> {
  return queryOne<Testimonial>(
    `update testimonials set
      quote=$1, author_name=$2, author_role=$3, photo=$4, case_study_id=$5, sort_order=$6, published=$7
     where id=$8
     returning *`,
    [t.quote, t.author_name, t.author_role, t.photo, t.case_study_id, t.sort_order, t.published, id]
  ) as Promise<Testimonial>;
}

export function deleteTestimonial(id: number): Promise<void> {
  return query('delete from testimonials where id = $1', [id]).then(() => undefined);
}

export function setTestimonialOrder(id: number, sortOrder: number): Promise<void> {
  return query('update testimonials set sort_order = $1 where id = $2', [sortOrder, id]).then(() => undefined);
}

// ── Contact messages ────────────────────────────────────────────

export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  message: string;
  created_at: string;
}

export function createContactMessage(m: { name: string; email: string; message: string }): Promise<void> {
  return query(
    'insert into contact_messages (name, email, message) values ($1, $2, $3)',
    [m.name, m.email, m.message]
  ).then(() => undefined);
}

export function listContactMessages(): Promise<ContactMessage[]> {
  return query<ContactMessage>('select * from contact_messages order by created_at desc');
}

// ── Analytics ────────────────────────────────────────────────────

export function recordPageView(v: { path: string; referrer: string; userAgent: string; visitorId: string }): Promise<void> {
  return query(
    'insert into page_views (path, referrer, user_agent, visitor_id) values ($1, $2, $3, $4)',
    [v.path, v.referrer, v.userAgent, v.visitorId]
  ).then(() => undefined);
}

export interface AnalyticsTotals {
  today: number;
  last7: number;
  last30: number;
  allTime: number;
  uniqueToday: number;
  unique7: number;
  unique30: number;
  uniqueAllTime: number;
}

const EMPTY_ANALYTICS_TOTALS: AnalyticsTotals = {
  today: 0, last7: 0, last30: 0, allTime: 0,
  uniqueToday: 0, unique7: 0, unique30: 0, uniqueAllTime: 0,
};

// The analytics queries all fall back to empty/zeroed results on error —
// most commonly because the page_views table hasn't been created yet via
// the migration. Without this, the admin dashboard (which surfaces a
// summary card) would 500 entirely until the migration is run.
export async function getAnalyticsTotals(): Promise<AnalyticsTotals> {
  try {
    const row = await queryOne<{
      today: string; last7: string; last30: string; all_time: string;
      unique_today: string; unique_7: string; unique_30: string; unique_all_time: string;
    }>(`
      select
        count(*) filter (where created_at >= now() - interval '1 day')   as today,
        count(*) filter (where created_at >= now() - interval '7 days')  as last7,
        count(*) filter (where created_at >= now() - interval '30 days') as last30,
        count(*)                                                        as all_time,
        count(distinct visitor_id) filter (where created_at >= now() - interval '1 day')   as unique_today,
        count(distinct visitor_id) filter (where created_at >= now() - interval '7 days')  as unique_7,
        count(distinct visitor_id) filter (where created_at >= now() - interval '30 days') as unique_30,
        count(distinct visitor_id)                                                        as unique_all_time
      from page_views
    `);
    if (!row) return EMPTY_ANALYTICS_TOTALS;
    return {
      today: Number(row.today ?? 0),
      last7: Number(row.last7 ?? 0),
      last30: Number(row.last30 ?? 0),
      allTime: Number(row.all_time ?? 0),
      uniqueToday: Number(row.unique_today ?? 0),
      unique7: Number(row.unique_7 ?? 0),
      unique30: Number(row.unique_30 ?? 0),
      uniqueAllTime: Number(row.unique_all_time ?? 0),
    };
  } catch (err) {
    console.error('getAnalyticsTotals failed (has the page_views migration been run?):', err);
    return EMPTY_ANALYTICS_TOTALS;
  }
}

export async function getDailyViewCounts(days: number): Promise<{ date: string; count: number }[]> {
  try {
    const rows = await query<{ date: string; count: string }>(`
      select d::date::text as date, count(pv.id)::int as count
      from generate_series((current_date - ($1 || ' days')::interval)::date, current_date, interval '1 day') d
      left join page_views pv on date_trunc('day', pv.created_at) = d
      group by d
      order by d
    `, [days - 1]);
    return rows.map(r => ({ date: r.date, count: Number(r.count) }));
  } catch (err) {
    console.error('getDailyViewCounts failed (has the page_views migration been run?):', err);
    const today = new Date();
    return Array.from({ length: days }, (_, i) => {
      const d = new Date(today);
      d.setDate(d.getDate() - (days - 1 - i));
      return { date: d.toISOString().slice(0, 10), count: 0 };
    });
  }
}

export async function getTopPaths(days: number, limit: number): Promise<{ path: string; count: number }[]> {
  try {
    return await query<{ path: string; count: number }>(`
      select path, count(*)::int as count
      from page_views
      where created_at >= now() - ($1 || ' days')::interval
      group by path
      order by count desc
      limit $2
    `, [days, limit]);
  } catch (err) {
    console.error('getTopPaths failed (has the page_views migration been run?):', err);
    return [];
  }
}
