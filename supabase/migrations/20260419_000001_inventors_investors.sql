-- v0.6.5 — Inventors & Investors
-- Feature tag: #Inventors_InvestorsWhenTheyClickOnTheSidebarInventorsAndInvestors

create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  full_name text not null default '',
  role text check (role in ('investor', 'inventor')),
  avatar_url text,
  location text,
  bio text,
  email text,
  phone text,
  email_public boolean not null default false,
  phone_public boolean not null default false,
  profile_completed boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.investor_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  investment_budget numeric,
  investment_range_min numeric,
  investment_range_max numeric,
  looking_to_invest_in text,
  preferred_industries text[] not null default '{}',
  stage_preference text check (stage_preference in ('idea', 'startup', 'growing business', 'established business')),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.inventor_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  invention_name text not null default '',
  invention_type text,
  description text,
  revenue numeric,
  equity_available numeric,
  funding_sought numeric,
  category text,
  website_url text,
  social_links text[] not null default '{}',
  short_pitch text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.inventor_profile_images (
  id uuid primary key default gen_random_uuid(),
  inventor_profile_id uuid not null references public.inventor_profiles(id) on delete cascade,
  image_url text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.swipes (
  id uuid primary key default gen_random_uuid(),
  from_user_id uuid not null references auth.users(id) on delete cascade,
  to_user_id uuid not null references auth.users(id) on delete cascade,
  action text not null check (action in ('interested', 'pass')),
  created_at timestamptz not null default timezone('utc', now()),
  unique (from_user_id, to_user_id)
);

create table if not exists public.conversations (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.conversation_participants (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  last_read_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  unique (conversation_id, user_id)
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  sender_user_id uuid not null references auth.users(id) on delete cascade,
  message_text text not null,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.blocked_users (
  id uuid primary key default gen_random_uuid(),
  blocker_user_id uuid not null references auth.users(id) on delete cascade,
  blocked_user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default timezone('utc', now()),
  unique (blocker_user_id, blocked_user_id),
  check (blocker_user_id <> blocked_user_id)
);

create table if not exists public.reported_profiles (
  id uuid primary key default gen_random_uuid(),
  reporter_user_id uuid not null references auth.users(id) on delete cascade,
  reported_user_id uuid not null references auth.users(id) on delete cascade,
  reason text not null,
  details text,
  created_at timestamptz not null default timezone('utc', now()),
  check (reporter_user_id <> reported_user_id)
);

create index if not exists idx_profiles_role on public.profiles(role);
create index if not exists idx_profiles_updated_at on public.profiles(updated_at desc);
create index if not exists idx_swipes_from_user_id on public.swipes(from_user_id);
create index if not exists idx_swipes_to_user_id on public.swipes(to_user_id);
create index if not exists idx_blocked_users_blocker on public.blocked_users(blocker_user_id);
create index if not exists idx_blocked_users_blocked on public.blocked_users(blocked_user_id);
create index if not exists idx_conversation_participants_user_id on public.conversation_participants(user_id);
create index if not exists idx_messages_conversation_id_created_at on public.messages(conversation_id, created_at desc);
create index if not exists idx_inventor_profile_images_profile_id_sort on public.inventor_profile_images(inventor_profile_id, sort_order);

create or replace function public.touch_conversation_updated_at()
returns trigger
language plpgsql
as $$
begin
  update public.conversations
  set updated_at = timezone('utc', now())
  where id = new.conversation_id;
  return new;
end;
$$;

drop trigger if exists trg_profiles_set_updated_at on public.profiles;
create trigger trg_profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists trg_investor_profiles_set_updated_at on public.investor_profiles;
create trigger trg_investor_profiles_set_updated_at
before update on public.investor_profiles
for each row execute function public.set_updated_at();

drop trigger if exists trg_inventor_profiles_set_updated_at on public.inventor_profiles;
create trigger trg_inventor_profiles_set_updated_at
before update on public.inventor_profiles
for each row execute function public.set_updated_at();

drop trigger if exists trg_conversations_set_updated_at on public.conversations;
create trigger trg_conversations_set_updated_at
before update on public.conversations
for each row execute function public.set_updated_at();

drop trigger if exists trg_messages_touch_conversations on public.messages;
create trigger trg_messages_touch_conversations
after insert on public.messages
for each row execute function public.touch_conversation_updated_at();

alter table public.profiles enable row level security;
alter table public.investor_profiles enable row level security;
alter table public.inventor_profiles enable row level security;
alter table public.inventor_profile_images enable row level security;
alter table public.swipes enable row level security;
alter table public.conversations enable row level security;
alter table public.conversation_participants enable row level security;
alter table public.messages enable row level security;
alter table public.blocked_users enable row level security;
alter table public.reported_profiles enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
on public.profiles
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own"
on public.profiles
for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
on public.profiles
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "investor_profiles_select_own" on public.investor_profiles;
create policy "investor_profiles_select_own"
on public.investor_profiles
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "investor_profiles_insert_own" on public.investor_profiles;
create policy "investor_profiles_insert_own"
on public.investor_profiles
for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "investor_profiles_update_own" on public.investor_profiles;
create policy "investor_profiles_update_own"
on public.investor_profiles
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "inventor_profiles_select_own" on public.inventor_profiles;
create policy "inventor_profiles_select_own"
on public.inventor_profiles
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "inventor_profiles_insert_own" on public.inventor_profiles;
create policy "inventor_profiles_insert_own"
on public.inventor_profiles
for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "inventor_profiles_update_own" on public.inventor_profiles;
create policy "inventor_profiles_update_own"
on public.inventor_profiles
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "inventor_profile_images_select_own" on public.inventor_profile_images;
create policy "inventor_profile_images_select_own"
on public.inventor_profile_images
for select
to authenticated
using (
  exists (
    select 1 from public.inventor_profiles ip
    where ip.id = inventor_profile_images.inventor_profile_id
      and ip.user_id = auth.uid()
  )
);

drop policy if exists "inventor_profile_images_insert_own" on public.inventor_profile_images;
create policy "inventor_profile_images_insert_own"
on public.inventor_profile_images
for insert
to authenticated
with check (
  exists (
    select 1 from public.inventor_profiles ip
    where ip.id = inventor_profile_images.inventor_profile_id
      and ip.user_id = auth.uid()
  )
);

drop policy if exists "inventor_profile_images_delete_own" on public.inventor_profile_images;
create policy "inventor_profile_images_delete_own"
on public.inventor_profile_images
for delete
to authenticated
using (
  exists (
    select 1 from public.inventor_profiles ip
    where ip.id = inventor_profile_images.inventor_profile_id
      and ip.user_id = auth.uid()
  )
);

drop policy if exists "swipes_select_own" on public.swipes;
create policy "swipes_select_own"
on public.swipes
for select
to authenticated
using (auth.uid() = from_user_id);

drop policy if exists "swipes_insert_own" on public.swipes;
create policy "swipes_insert_own"
on public.swipes
for insert
to authenticated
with check (auth.uid() = from_user_id and from_user_id <> to_user_id);

drop policy if exists "conversations_select_participant" on public.conversations;
create policy "conversations_select_participant"
on public.conversations
for select
to authenticated
using (
  exists (
    select 1
    from public.conversation_participants cp
    where cp.conversation_id = conversations.id
      and cp.user_id = auth.uid()
  )
);

drop policy if exists "conversation_participants_select_own" on public.conversation_participants;
create policy "conversation_participants_select_own"
on public.conversation_participants
for select
to authenticated
using (
  exists (
    select 1
    from public.conversation_participants self_cp
    where self_cp.conversation_id = conversation_participants.conversation_id
      and self_cp.user_id = auth.uid()
  )
);

drop policy if exists "conversation_participants_update_own" on public.conversation_participants;
create policy "conversation_participants_update_own"
on public.conversation_participants
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "messages_select_participant" on public.messages;
create policy "messages_select_participant"
on public.messages
for select
to authenticated
using (
  exists (
    select 1
    from public.conversation_participants cp
    where cp.conversation_id = messages.conversation_id
      and cp.user_id = auth.uid()
  )
);

drop policy if exists "messages_insert_participant" on public.messages;
create policy "messages_insert_participant"
on public.messages
for insert
to authenticated
with check (
  auth.uid() = sender_user_id
  and exists (
    select 1
    from public.conversation_participants cp
    where cp.conversation_id = messages.conversation_id
      and cp.user_id = auth.uid()
  )
  and not exists (
    select 1
    from public.blocked_users b
    join public.conversation_participants self_cp
      on self_cp.conversation_id = messages.conversation_id
     and self_cp.user_id = auth.uid()
    join public.conversation_participants other_cp
      on other_cp.conversation_id = messages.conversation_id
     and other_cp.user_id <> auth.uid()
    where (b.blocker_user_id = auth.uid() and b.blocked_user_id = other_cp.user_id)
       or (b.blocker_user_id = other_cp.user_id and b.blocked_user_id = auth.uid())
  )
);

drop policy if exists "blocked_users_select_involving_self" on public.blocked_users;
create policy "blocked_users_select_involving_self"
on public.blocked_users
for select
to authenticated
using (auth.uid() = blocker_user_id or auth.uid() = blocked_user_id);

drop policy if exists "blocked_users_insert_self" on public.blocked_users;
create policy "blocked_users_insert_self"
on public.blocked_users
for insert
to authenticated
with check (auth.uid() = blocker_user_id and blocker_user_id <> blocked_user_id);

drop policy if exists "blocked_users_delete_self" on public.blocked_users;
create policy "blocked_users_delete_self"
on public.blocked_users
for delete
to authenticated
using (auth.uid() = blocker_user_id);

drop policy if exists "reported_profiles_select_own" on public.reported_profiles;
create policy "reported_profiles_select_own"
on public.reported_profiles
for select
to authenticated
using (auth.uid() = reporter_user_id);

drop policy if exists "reported_profiles_insert_own" on public.reported_profiles;
create policy "reported_profiles_insert_own"
on public.reported_profiles
for insert
to authenticated
with check (auth.uid() = reporter_user_id and reporter_user_id <> reported_user_id);

create or replace view public.inventors_investors_public_profiles as
select
  p.user_id,
  p.full_name,
  p.role,
  p.avatar_url,
  p.location,
  p.bio,
  p.created_at,
  p.updated_at,
  case when p.email_public then p.email else null end as public_email,
  case when p.phone_public then p.phone else null end as public_phone,
  ipf.id as investor_profile_id,
  ipf.investment_budget,
  ipf.investment_range_min,
  ipf.investment_range_max,
  ipf.looking_to_invest_in,
  ipf.preferred_industries,
  ipf.stage_preference,
  inv.id as inventor_profile_id,
  inv.invention_name,
  inv.invention_type,
  inv.description,
  inv.revenue,
  inv.equity_available,
  inv.funding_sought,
  inv.category,
  inv.website_url,
  inv.social_links,
  inv.short_pitch
from public.profiles p
left join public.investor_profiles ipf on ipf.user_id = p.user_id
left join public.inventor_profiles inv on inv.user_id = p.user_id
where p.profile_completed = true
  and p.role in ('investor', 'inventor');

grant select on public.inventors_investors_public_profiles to authenticated;

create or replace function public.ensure_inventors_investors_conversation(other_user_id uuid)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  current_user_id uuid := auth.uid();
  existing_conversation_id uuid;
  new_conversation_id uuid;
begin
  if current_user_id is null then
    raise exception 'Authentication required';
  end if;

  if other_user_id is null or other_user_id = current_user_id then
    raise exception 'Invalid participant';
  end if;

  if exists (
    select 1
    from public.blocked_users b
    where (b.blocker_user_id = current_user_id and b.blocked_user_id = other_user_id)
       or (b.blocker_user_id = other_user_id and b.blocked_user_id = current_user_id)
  ) then
    raise exception 'Conversation unavailable';
  end if;

  select cp.conversation_id
  into existing_conversation_id
  from public.conversation_participants cp
  where cp.user_id in (current_user_id, other_user_id)
  group by cp.conversation_id
  having count(distinct cp.user_id) = 2
     and count(*) = 2
  limit 1;

  if existing_conversation_id is not null then
    return existing_conversation_id;
  end if;

  insert into public.conversations default values returning id into new_conversation_id;

  insert into public.conversation_participants (conversation_id, user_id, last_read_at)
  values
    (new_conversation_id, current_user_id, timezone('utc', now())),
    (new_conversation_id, other_user_id, null);

  return new_conversation_id;
end;
$$;

grant execute on function public.ensure_inventors_investors_conversation(uuid) to authenticated;

create or replace function public.mark_inventors_investors_conversation_read(target_conversation_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then
    raise exception 'Authentication required';
  end if;

  update public.conversation_participants
  set last_read_at = timezone('utc', now())
  where conversation_id = target_conversation_id
    and user_id = auth.uid();
end;
$$;

grant execute on function public.mark_inventors_investors_conversation_read(uuid) to authenticated;

insert into storage.buckets (id, name, public)
values ('inventors-investors-media', 'inventors-investors-media', true)
on conflict (id) do nothing;

drop policy if exists "ii_storage_public_read" on storage.objects;
create policy "ii_storage_public_read"
on storage.objects
for select
to authenticated
using (bucket_id = 'inventors-investors-media');

drop policy if exists "ii_storage_upload_own_folder" on storage.objects;
create policy "ii_storage_upload_own_folder"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'inventors-investors-media'
  and auth.uid()::text = (storage.foldername(name))[1]
);

drop policy if exists "ii_storage_update_own_folder" on storage.objects;
create policy "ii_storage_update_own_folder"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'inventors-investors-media'
  and auth.uid()::text = (storage.foldername(name))[1]
)
with check (
  bucket_id = 'inventors-investors-media'
  and auth.uid()::text = (storage.foldername(name))[1]
);

drop policy if exists "ii_storage_delete_own_folder" on storage.objects;
create policy "ii_storage_delete_own_folder"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'inventors-investors-media'
  and auth.uid()::text = (storage.foldername(name))[1]
);
