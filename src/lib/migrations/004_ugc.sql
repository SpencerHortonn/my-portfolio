-- One-time migration for the UGC portfolio page.
-- Run against the EXISTING database (additive only — no data loss).
-- Supabase's SQL editor rejects multi-statement pastes — run each statement
-- (each block ending in `;`) one at a time.

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

create index if not exists idx_ugc_items_sort on ugc_items (sort_order, id);
