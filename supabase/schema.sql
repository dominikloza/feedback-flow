-- 1. Create a table for public profiles (extends auth.users)
-- Supabase handles credentials in auth.users, we keep public data here.
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  full_name text,
  avatar_url text,
  updated_at timestamp with time zone
);

-- 2. Create the feedback table
-- Using an ENUM for strict typing on the database level
create type public.feedback_status as enum ('idea', 'planned', 'in-progress', 'completed');

create table public.feedback (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text not null,
  status feedback_status default 'idea'::feedback_status not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone
);

-- 3. Create votes table
create table public.votes (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  feedback_id uuid references public.feedback(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, feedback_id) -- One vote per user per feedback ticket
);

-- 4. Turn on Row Level Security (RLS) - CRITICAL FOR MID/SENIOR DEVS
alter table public.profiles enable row level security;
alter table public.feedback enable row level security;
alter table public.votes enable row level security;

-- 5. Basic RLS Policies

-- Profiles: Anyone can read, but users can only update their own profile
create policy "Public profiles are viewable by everyone." on public.profiles for select using (true);
create policy "Users can update their own profile." on public.profiles for update using (auth.uid() = id);

-- Feedback: Anyone can read, authenticated users can insert, users can update/delete their own
create policy "Feedback is viewable by everyone." on public.feedback for select using (true);
create policy "Authenticated users can insert feedback." on public.feedback for insert with check (auth.role() = 'authenticated');
create policy "Users can update their own feedback." on public.feedback for update using (auth.uid() = user_id);
create policy "Users can delete their own feedback." on public.feedback for delete using (auth.uid() = user_id);

-- Votes: Anyone can read, users can insert/delete their own votes
create policy "Votes are viewable by everyone." on public.votes for select using (true);
create policy "Authenticated users can insert votes." on public.votes for insert with check (auth.uid() = user_id);
create policy "Users can delete their own votes." on public.votes for delete using (auth.uid() = user_id);

-- 6. Optional but powerful: Trigger to automatically create a profile when a new user signs up via Auth
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
