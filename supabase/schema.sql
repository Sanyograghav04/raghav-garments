-- =========================================================
-- RAGHAV GARMENTS — Supabase Database Schema
-- Phase 4: Database Tables, Relationships & Row Level Security (RLS)
-- =========================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Profiles Table (extends auth.users)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  full_name text,
  phone text,
  role text default 'customer' check (role in ('customer', 'admin')),
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Products Table
create table if not exists public.products (
  id text primary key default concat('prod-', gen_random_uuid()),
  name text not null,
  slug text unique not null,
  description text not null,
  long_description text,
  category text not null check (category in ('men', 'women', 'kids')),
  subcategory text not null,
  price numeric(10, 2) not null,
  compare_price numeric(10, 2),
  images text[] not null default '{}',
  sizes text[] not null default '{}',
  colors jsonb not null default '[]'::jsonb,
  in_stock boolean default true,
  stock_count integer default 10,
  featured boolean default false,
  is_best_seller boolean default false,
  is_new_arrival boolean default false,
  rating numeric(2, 1) default 5.0,
  review_count integer default 0,
  details text[] default '{}',
  fabric_care text[] default '{}',
  sku text unique,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Customer Addresses Table
create table if not exists public.addresses (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  full_name text not null,
  phone text not null,
  street_address text not null,
  city text not null,
  state text not null,
  postal_code text not null,
  is_default boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Orders Table
create table if not exists public.orders (
  id uuid default gen_random_uuid() primary key,
  order_number text unique not null,
  user_id uuid references public.profiles(id) on delete set null,
  guest_email text,
  guest_phone text,
  guest_name text,
  status text default 'pending' check (status in ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
  payment_status text default 'unpaid' check (payment_status in ('unpaid', 'paid', 'refunded', 'failed')),
  subtotal numeric(10, 2) not null,
  discount numeric(10, 2) default 0,
  shipping numeric(10, 2) default 0,
  total numeric(10, 2) not null,
  shipping_address jsonb not null,
  razorpay_order_id text,
  razorpay_payment_id text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. Order Items Table
create table if not exists public.order_items (
  id uuid default gen_random_uuid() primary key,
  order_id uuid references public.orders(id) on delete cascade not null,
  product_id text references public.products(id) on delete set null,
  product_name text not null,
  product_image text,
  size text not null,
  color text not null,
  unit_price numeric(10, 2) not null,
  quantity integer not null check (quantity > 0),
  subtotal numeric(10, 2) not null
);

-- 6. Product Reviews Table
create table if not exists public.reviews (
  id uuid default gen_random_uuid() primary key,
  product_id text references public.products(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete set null,
  author text not null,
  rating integer not null check (rating >= 1 and rating <= 5),
  title text,
  comment text not null,
  verified boolean default true,
  size_purchased text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 7. Wishlist Table
create table if not exists public.wishlist (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  product_id text references public.products(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, product_id)
);

-- =========================================================
-- Enable Row Level Security (RLS)
-- =========================================================

alter table public.profiles enable row level security;
alter table public.products enable row level security;
alter table public.addresses enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.reviews enable row level security;
alter table public.wishlist enable row level security;

-- Policies for Products (Public Read, Admin Write)
create policy "Products are viewable by everyone"
  on public.products for select using (true);

create policy "Admins can insert products"
  on public.products for insert
  with check (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.role = 'admin'
    )
  );

create policy "Admins can update products"
  on public.products for update
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.role = 'admin'
    )
  );

create policy "Admins can delete products"
  on public.products for delete
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.role = 'admin'
    )
  );

-- Policies for Profiles
create policy "Users can view own profile"
  on public.profiles for select using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update using (auth.uid() = id);

-- Policies for Addresses
create policy "Users can manage own addresses"
  on public.addresses for all using (auth.uid() = user_id);

-- Policies for Orders
create policy "Users can view own orders"
  on public.orders for select using (auth.uid() = user_id);

create policy "Users can insert orders"
  on public.orders for insert with check (true);

create policy "Admins can view all orders"
  on public.orders for select
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.role = 'admin'
    )
  );

-- Policies for Order Items
create policy "Users can view own order items"
  on public.order_items for select
  using (
    exists (
      select 1 from public.orders
      where orders.id = order_items.order_id and orders.user_id = auth.uid()
    )
  );

-- Policies for Reviews
create policy "Reviews are viewable by everyone"
  on public.reviews for select using (true);

create policy "Authenticated users can insert reviews"
  on public.reviews for insert with check (auth.role() = 'authenticated');

-- Policies for Wishlist
create policy "Users can manage own wishlist"
  on public.wishlist for all using (auth.uid() = user_id);

-- =========================================================
-- Trigger for automatic user profile creation on signup
-- =========================================================
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce(new.raw_user_meta_data->>'role', 'customer')
  );
  return new;
end;
$$ language plpgsql security definer;

-- Drop trigger if exists
drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
