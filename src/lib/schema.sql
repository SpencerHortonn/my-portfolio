-- Run this once against the Postgres database (Vercel dashboard's Query editor,
-- or `psql "$DATABASE_URL" -f src/lib/schema.sql`).

create table if not exists portfolio_items (
  id           serial primary key,
  title        text not null,
  caption      text not null default '',
  type         text not null check (type in ('video', 'photo', 'gallery')),
  orientation  text not null default 'landscape' check (orientation in ('landscape', 'portrait')),
  thumbnail    text not null default '',
  full_url     text not null default '',
  embed_url    text not null default '',
  video_file   text not null default '',
  images       jsonb not null default '[]',
  sort_order   integer not null default 0,
  published    boolean not null default true,
  created_at   timestamptz not null default now()
);

create table if not exists shop_products (
  id               serial primary key,
  title            text not null,
  slug             text not null unique,
  description      text not null default '',
  price_cents      integer not null default 0,
  currency         text not null default 'usd',
  cover_image      text not null default '',
  gallery          jsonb not null default '[]',
  file_url         text not null default '',
  status           text not null default 'draft' check (status in ('draft', 'active')),
  stripe_price_id  text not null default '',
  sort_order       integer not null default 0,
  created_at       timestamptz not null default now()
);

create table if not exists site_settings (
  key   text primary key,
  value jsonb not null
);

create table if not exists subscribers (
  id         serial primary key,
  email      text not null unique,
  created_at timestamptz not null default now()
);

create index if not exists idx_portfolio_items_sort on portfolio_items (sort_order, id);
create index if not exists idx_shop_products_sort on shop_products (sort_order, id);
