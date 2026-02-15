-- ===========================================
-- PlateRate MVP — Supabase Database Schema
-- ===========================================
-- Run this in your Supabase SQL Editor (Dashboard → SQL Editor → New Query)

-- 1. Restaurants table
create table public.restaurants (
  id uuid default gen_random_uuid() primary key,
  owner_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  slug text unique not null,
  google_review_url text default '',
  rating_threshold integer default 4 check (rating_threshold between 1 and 5),
  created_at timestamp with time zone default now()
);

-- 2. Feedback table
create table public.feedback (
  id uuid default gen_random_uuid() primary key,
  restaurant_id uuid references public.restaurants(id) on delete cascade not null,
  rating integer not null check (rating between 1 and 5),
  comment text default '',
  customer_name text default 'Anonymous',
  was_redirected boolean default false,
  created_at timestamp with time zone default now()
);

-- 3. Enable Row Level Security
alter table public.restaurants enable row level security;
alter table public.feedback enable row level security;

-- 4. RLS Policies — owners can only see their own data
create policy "Owners can view their own restaurants"
  on public.restaurants for select
  using (auth.uid() = owner_id);

create policy "Owners can insert their own restaurants"
  on public.restaurants for insert
  with check (auth.uid() = owner_id);

create policy "Owners can update their own restaurants"
  on public.restaurants for update
  using (auth.uid() = owner_id);

-- Feedback: owners see feedback for their restaurants
create policy "Owners can view feedback for their restaurants"
  on public.feedback for select
  using (
    restaurant_id in (
      select id from public.restaurants where owner_id = auth.uid()
    )
  );

-- Public: anyone can read a restaurant by slug (for the review page)
create policy "Anyone can read restaurant by slug"
  on public.restaurants for select
  using (true);

-- Public: anyone can insert feedback (customers submitting reviews)
create policy "Anyone can submit feedback"
  on public.feedback for insert
  with check (true);

-- 5. Indexes for performance
create index idx_restaurants_slug on public.restaurants(slug);
create index idx_restaurants_owner on public.restaurants(owner_id);
create index idx_feedback_restaurant on public.feedback(restaurant_id);
create index idx_feedback_created on public.feedback(created_at desc);