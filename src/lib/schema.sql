-- Run this once against the Postgres database (Supabase/Vercel SQL editor,
-- or `psql "$DATABASE_URL" -f src/lib/schema.sql`).
-- NOTE: Supabase's SQL editor rejects multi-statement pastes — run each
-- statement (each one ending in `;`) one at a time if you hit that error.

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
  created_at   timestamptz not null default now(),
  -- Case-study fields (v2)
  slug         text unique,
  client_name  text not null default '',
  client_logo  text not null default '',
  description  text not null default ''
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

create table if not exists testimonials (
  id            serial primary key,
  quote         text not null,
  author_name   text not null,
  author_role   text not null default '',
  photo         text not null default '',
  case_study_id integer references portfolio_items(id) on delete set null,
  sort_order    integer not null default 0,
  published     boolean not null default true,
  created_at    timestamptz not null default now()
);

create table if not exists contact_messages (
  id         serial primary key,
  name       text not null,
  email      text not null,
  message    text not null,
  created_at timestamptz not null default now()
);

create table if not exists page_views (
  id         serial primary key,
  path       text not null,
  referrer   text not null default '',
  user_agent text not null default '',
  visitor_id text not null default '',
  created_at timestamptz not null default now()
);

create table if not exists ugc_items (
  id           serial primary key,
  brand_name   text not null default '',
  platform     text not null default '',
  caption      text not null default '',
  video_file   text not null default '',
  embed_url    text not null default '',
  thumbnail    text not null default '',
  sort_order   integer not null default 0,
  published    boolean not null default true,
  created_at   timestamptz not null default now()
);

create index if not exists idx_portfolio_items_sort on portfolio_items (sort_order, id);
create index if not exists idx_shop_products_sort on shop_products (sort_order, id);
create index if not exists idx_testimonials_sort on testimonials (sort_order, id);
create index if not exists idx_page_views_created on page_views (created_at);
create index if not exists idx_page_views_path on page_views (path);
create index if not exists idx_ugc_items_sort on ugc_items (sort_order, id);
