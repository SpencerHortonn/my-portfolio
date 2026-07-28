-- One-time migration for the self-hosted visitor analytics feature.
-- Run against the EXISTING database (additive only — no data loss).
-- Supabase's SQL editor rejects multi-statement pastes — run each statement
-- (each block ending in `;`) one at a time.

create table if not exists page_views (
  id         serial primary key,
  path       text not null,
  referrer   text not null default '',
  user_agent text not null default '',
  visitor_id text not null default '',
  created_at timestamptz not null default now()
);

create index if not exists idx_page_views_created on page_views (created_at);
create index if not exists idx_page_views_path on page_views (path);
