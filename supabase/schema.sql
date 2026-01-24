-- Create profiles table
create table public.profiles (
  id uuid references auth.users not null primary key,
  updated_at timestamp with time zone,
  username text unique,
  full_name text,
  avatar_url text,
  website text,
  role text default 'user'
);

-- Set up Row Level Security (RLS)
alter table public.profiles enable row level security;

create policy "Public profiles are viewable by everyone."
  on profiles for select
  using ( true );

create policy "Users can insert their own profile."
  on profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile."
  on profiles for update
  using ( auth.uid() = id );

-- Create articles table
create table public.articles (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  slug text unique not null,
  excerpt text,
  content text,
  category text,
  image_url text,
  author_id uuid references public.profiles(id),
  published_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  views integer default 0,
  is_featured boolean default false,
  is_breaking boolean default false
);

alter table public.articles enable row level security;

create policy "Articles are viewable by everyone."
  on articles for select
  using ( true );

-- Only allow authenticated users with role 'admin' or 'editor' to insert/update/delete (Simplified for now - anyone logged in can edit for demo purposes if we don't strict check role yet)
create policy "Authenticated users can create articles."
  on articles for insert
  with check ( auth.role() = 'authenticated' );

create policy "Authenticated users can update articles."
  on articles for update
  using ( auth.role() = 'authenticated' );

-- Create jobs table
create table public.jobs (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  department text,
  type text,
  description text,
  requirements text[],
  deadline timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  is_open boolean default true
);

alter table public.jobs enable row level security;

create policy "Jobs are viewable by everyone."
  on jobs for select
  using ( true );

create policy "Authenticated users can manage jobs."
  on jobs for all
  using ( auth.role() = 'authenticated' );


-- RPC for incrementing views safely
create or replace function increment_views(article_id uuid)
returns void as $$
begin
  update articles
  set views = views + 1
  where id = article_id;
end;
$$ language plpgsql security definer;

-- Comments Table
create table public.comments (
  id uuid default gen_random_uuid() primary key,
  article_id uuid references public.articles(id), -- Nullable if we want site-wide comments, but usually linked to article
  user_id uuid references auth.users(id), -- Link to auth user if logged in
  parent_id uuid references public.comments(id), -- For replies
  content text not null,
  author_name text, -- For guest comments or caching name
  status text default 'approved', -- approved, pending, spam
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  likes integer default 0
);

alter table public.comments enable row level security;

create policy "Comments are viewable by everyone."
  on comments for select
  using ( true );

create policy "Authenticated users can insert comments."
  on comments for insert
  with check ( auth.role() = 'authenticated' );

create policy "Users can update their own comments."
  on comments for update
  using ( auth.uid() = user_id );

create policy "Users can delete their own comments."
  on comments for delete
  using ( auth.uid() = user_id );

-- Site Settings Table (Key-Value Store)
create table public.site_settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

alter table public.site_settings enable row level security;

create policy "Settings are viewable by everyone."
  on site_settings for select
  using ( true );

create policy "Only admins can modify settings."
  on site_settings for all
  using ( auth.role() = 'authenticated' ); -- Refine this if we have specific admin roles in auth.users metadata

-- Initial Default Settings (Optional - can be inserted via UI or script)
insert into public.site_settings (key, value)
values 
  ('site', '{"siteName": "TruthLens", "tagline": "Authentic Stories. Unbiased Voices.", "contactEmail": "contact@truthlens.com", "maintenanceMode": false}'::jsonb),

-- Team Members
create table public.team_members (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  role text not null,
  bio text,
  avatar_url text,
  email text,
  twitter_url text,
  linkedin_url text,
  display_order integer default 0
);

alter table public.team_members enable row level security;

create policy "Team members are viewable by everyone."
  on team_members for select
  using ( true );

create policy "Admins can manage team members."
  on team_members for all
  using ( auth.role() = 'authenticated' );

-- Internship Applications
create table public.internship_applications (
  id uuid default gen_random_uuid() primary key,
  full_name text not null,
  email text not null,
  phone text,
  university text,
  department text,
  portfolio_url text,
  cover_letter text,
  cv_url text,
  status text default 'pending',
  submitted_at timestamp with time zone default timezone('utc'::text, now())
);

alter table public.internship_applications enable row level security;

create policy "Admins can view applications."
  on internship_applications for select
  using ( auth.role() = 'authenticated' );

create policy "Public can submit applications."
  on internship_applications for insert
  with check ( true ); 
