create extension if not exists pgcrypto;

create table if not exists public.gifts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  price integer not null check (price >= 0),
  emoji text default '🎁',
  recipients text[] default '{}',
  occasions text[] default '{}',
  interests text[] default '{}',
  personalities text[] default '{}',
  tags text[] default '{}',
  why text default '',
  shop_url text default '',
  owner_id uuid not null,
  created_at timestamptz default now()
);

alter table public.gifts enable row level security;

create policy "Anyone can read gifts"
  on public.gifts
  for select
  using (true);

create policy "Anonymous users can add own gifts"
  on public.gifts
  for insert
  with check (auth.uid() = owner_id);

create policy "Users can delete own gifts"
  on public.gifts
  for delete
  using (auth.uid() = owner_id);
