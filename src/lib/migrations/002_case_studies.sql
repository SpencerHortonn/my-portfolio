-- One-time migration for the case-studies/testimonials/contact-form update.
-- Run against the EXISTING database (additive only — no data loss).
-- Supabase's SQL editor rejects multi-statement pastes — run each statement
-- (each block ending in `;`) one at a time.

alter table portfolio_items add column if not exists slug text unique;
alter table portfolio_items add column if not exists client_name text not null default '';
alter table portfolio_items add column if not exists client_logo text not null default '';
alter table portfolio_items add column if not exists description text not null default '';

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

create index if not exists idx_testimonials_sort on testimonials (sort_order, id);
