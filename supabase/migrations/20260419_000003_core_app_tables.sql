create schema if not exists private;

create table if not exists public.user_data (
  user_id uuid primary key references auth.users(id) on delete cascade,
  bookmarks jsonb not null default '[]'::jsonb,
  notes jsonb not null default '{}'::jsonb,
  read_keys jsonb not null default '[]'::jsonb,
  highlights jsonb not null default '[]'::jsonb,
  tsd_profile jsonb,
  momentum_state jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.quiz_stats (
  user_id uuid primary key references auth.users(id) on delete cascade,
  total_played integer not null default 0,
  total_answered integer not null default 0,
  total_correct integer not null default 0,
  best_streak integer not null default 0,
  topics_played jsonb not null default '{}'::jsonb,
  achievements jsonb not null default '[]'::jsonb,
  history jsonb not null default '[]'::jsonb,
  daily_date text not null default '',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  author text not null,
  author_avatar_url text not null default '',
  title text not null,
  body text not null default '',
  flair text not null default 'General',
  votes integer not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  parent_id uuid references public.comments(id) on delete cascade,
  author text not null,
  author_avatar_url text not null default '',
  text text not null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.post_votes (
  user_id uuid not null references auth.users(id) on delete cascade,
  post_id uuid not null references public.posts(id) on delete cascade,
  dir integer not null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  primary key (user_id, post_id)
);

create index if not exists posts_user_id_idx on public.posts (user_id);
create index if not exists posts_created_at_idx on public.posts (created_at desc);
create index if not exists comments_post_id_idx on public.comments (post_id);
create index if not exists comments_user_id_idx on public.comments (user_id);
create index if not exists comments_parent_id_idx on public.comments (parent_id);
create index if not exists comments_created_at_idx on public.comments (created_at);
create index if not exists post_votes_post_id_idx on public.post_votes (post_id);

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'user_data_bookmarks_is_array'
      and conrelid = 'public.user_data'::regclass
  ) then
    alter table public.user_data
      add constraint user_data_bookmarks_is_array
      check (jsonb_typeof(bookmarks) = 'array');
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'user_data_notes_is_object'
      and conrelid = 'public.user_data'::regclass
  ) then
    alter table public.user_data
      add constraint user_data_notes_is_object
      check (jsonb_typeof(notes) = 'object');
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'user_data_read_keys_is_array'
      and conrelid = 'public.user_data'::regclass
  ) then
    alter table public.user_data
      add constraint user_data_read_keys_is_array
      check (jsonb_typeof(read_keys) = 'array');
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'user_data_highlights_is_array'
      and conrelid = 'public.user_data'::regclass
  ) then
    alter table public.user_data
      add constraint user_data_highlights_is_array
      check (jsonb_typeof(highlights) = 'array');
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'quiz_stats_totals_nonnegative'
      and conrelid = 'public.quiz_stats'::regclass
  ) then
    alter table public.quiz_stats
      add constraint quiz_stats_totals_nonnegative
      check (
        total_played >= 0
        and total_answered >= 0
        and total_correct >= 0
        and best_streak >= 0
        and total_correct <= total_answered
      );
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'quiz_stats_topics_played_is_object'
      and conrelid = 'public.quiz_stats'::regclass
  ) then
    alter table public.quiz_stats
      add constraint quiz_stats_topics_played_is_object
      check (jsonb_typeof(topics_played) = 'object');
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'quiz_stats_achievements_is_array'
      and conrelid = 'public.quiz_stats'::regclass
  ) then
    alter table public.quiz_stats
      add constraint quiz_stats_achievements_is_array
      check (jsonb_typeof(achievements) = 'array');
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'quiz_stats_history_is_array'
      and conrelid = 'public.quiz_stats'::regclass
  ) then
    alter table public.quiz_stats
      add constraint quiz_stats_history_is_array
      check (jsonb_typeof(history) = 'array');
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'post_votes_dir_valid'
      and conrelid = 'public.post_votes'::regclass
  ) then
    alter table public.post_votes
      add constraint post_votes_dir_valid
      check (dir in (-1, 1));
  end if;
end $$;

create or replace function private.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create or replace function private.handle_new_user_defaults()
returns trigger
language plpgsql
security definer
set search_path = public, auth, pg_temp
as $$
begin
  insert into public.user_data (user_id)
  values (new.id)
  on conflict (user_id) do nothing;

  insert into public.quiz_stats (user_id)
  values (new.id)
  on conflict (user_id) do nothing;

  return new;
end;
$$;

create or replace function private.sync_post_vote_totals()
returns trigger
language plpgsql
as $$
declare
  target_post_id uuid;
begin
  target_post_id = coalesce(new.post_id, old.post_id);

  update public.posts
  set votes = coalesce((
    select sum(dir)
    from public.post_votes
    where post_id = target_post_id
  ), 0),
  updated_at = timezone('utc', now())
  where id = target_post_id;

  return coalesce(new, old);
end;
$$;

drop trigger if exists user_data_set_updated_at on public.user_data;
create trigger user_data_set_updated_at
before update on public.user_data
for each row
execute function private.set_updated_at();

drop trigger if exists quiz_stats_set_updated_at on public.quiz_stats;
create trigger quiz_stats_set_updated_at
before update on public.quiz_stats
for each row
execute function private.set_updated_at();

drop trigger if exists posts_set_updated_at on public.posts;
create trigger posts_set_updated_at
before update on public.posts
for each row
execute function private.set_updated_at();

drop trigger if exists comments_set_updated_at on public.comments;
create trigger comments_set_updated_at
before update on public.comments
for each row
execute function private.set_updated_at();

drop trigger if exists post_votes_set_updated_at on public.post_votes;
create trigger post_votes_set_updated_at
before update on public.post_votes
for each row
execute function private.set_updated_at();

drop trigger if exists on_auth_user_created_core_defaults on auth.users;
create trigger on_auth_user_created_core_defaults
after insert on auth.users
for each row
execute function private.handle_new_user_defaults();

drop trigger if exists sync_post_vote_totals_after_change on public.post_votes;
create trigger sync_post_vote_totals_after_change
after insert or update or delete on public.post_votes
for each row
execute function private.sync_post_vote_totals();

alter table public.user_data enable row level security;
alter table public.quiz_stats enable row level security;
alter table public.posts enable row level security;
alter table public.comments enable row level security;
alter table public.post_votes enable row level security;

alter table public.user_data force row level security;
alter table public.quiz_stats force row level security;
alter table public.posts force row level security;
alter table public.comments force row level security;
alter table public.post_votes force row level security;

drop policy if exists "user_data_select_own" on public.user_data;
create policy "user_data_select_own"
on public.user_data
for select
to authenticated
using (auth.uid() is not null and auth.uid() = user_id);

drop policy if exists "user_data_insert_own" on public.user_data;
create policy "user_data_insert_own"
on public.user_data
for insert
to authenticated
with check (auth.uid() is not null and auth.uid() = user_id);

drop policy if exists "user_data_update_own" on public.user_data;
create policy "user_data_update_own"
on public.user_data
for update
to authenticated
using (auth.uid() is not null and auth.uid() = user_id)
with check (auth.uid() is not null and auth.uid() = user_id);

drop policy if exists "user_data_delete_own" on public.user_data;
create policy "user_data_delete_own"
on public.user_data
for delete
to authenticated
using (auth.uid() is not null and auth.uid() = user_id);

drop policy if exists "quiz_stats_select_own" on public.quiz_stats;
create policy "quiz_stats_select_own"
on public.quiz_stats
for select
to authenticated
using (auth.uid() is not null and auth.uid() = user_id);

drop policy if exists "quiz_stats_insert_own" on public.quiz_stats;
create policy "quiz_stats_insert_own"
on public.quiz_stats
for insert
to authenticated
with check (auth.uid() is not null and auth.uid() = user_id);

drop policy if exists "quiz_stats_update_own" on public.quiz_stats;
create policy "quiz_stats_update_own"
on public.quiz_stats
for update
to authenticated
using (auth.uid() is not null and auth.uid() = user_id)
with check (auth.uid() is not null and auth.uid() = user_id);

drop policy if exists "quiz_stats_delete_own" on public.quiz_stats;
create policy "quiz_stats_delete_own"
on public.quiz_stats
for delete
to authenticated
using (auth.uid() is not null and auth.uid() = user_id);

drop policy if exists "posts_select_authenticated" on public.posts;
create policy "posts_select_authenticated"
on public.posts
for select
to authenticated
using (true);

drop policy if exists "posts_insert_own" on public.posts;
create policy "posts_insert_own"
on public.posts
for insert
to authenticated
with check (auth.uid() is not null and auth.uid() = user_id);

drop policy if exists "posts_update_own" on public.posts;
create policy "posts_update_own"
on public.posts
for update
to authenticated
using (auth.uid() is not null and auth.uid() = user_id)
with check (auth.uid() is not null and auth.uid() = user_id);

drop policy if exists "posts_delete_own" on public.posts;
create policy "posts_delete_own"
on public.posts
for delete
to authenticated
using (auth.uid() is not null and auth.uid() = user_id);

drop policy if exists "comments_select_authenticated" on public.comments;
create policy "comments_select_authenticated"
on public.comments
for select
to authenticated
using (true);

drop policy if exists "comments_insert_own" on public.comments;
create policy "comments_insert_own"
on public.comments
for insert
to authenticated
with check (auth.uid() is not null and auth.uid() = user_id);

drop policy if exists "comments_update_own" on public.comments;
create policy "comments_update_own"
on public.comments
for update
to authenticated
using (auth.uid() is not null and auth.uid() = user_id)
with check (auth.uid() is not null and auth.uid() = user_id);

drop policy if exists "comments_delete_own" on public.comments;
create policy "comments_delete_own"
on public.comments
for delete
to authenticated
using (auth.uid() is not null and auth.uid() = user_id);

drop policy if exists "post_votes_select_own" on public.post_votes;
create policy "post_votes_select_own"
on public.post_votes
for select
to authenticated
using (auth.uid() is not null and auth.uid() = user_id);

drop policy if exists "post_votes_insert_own" on public.post_votes;
create policy "post_votes_insert_own"
on public.post_votes
for insert
to authenticated
with check (auth.uid() is not null and auth.uid() = user_id);

drop policy if exists "post_votes_update_own" on public.post_votes;
create policy "post_votes_update_own"
on public.post_votes
for update
to authenticated
using (auth.uid() is not null and auth.uid() = user_id)
with check (auth.uid() is not null and auth.uid() = user_id);

drop policy if exists "post_votes_delete_own" on public.post_votes;
create policy "post_votes_delete_own"
on public.post_votes
for delete
to authenticated
using (auth.uid() is not null and auth.uid() = user_id);

insert into public.user_data (user_id)
select id
from auth.users
on conflict (user_id) do nothing;

insert into public.quiz_stats (user_id)
select id
from auth.users
on conflict (user_id) do nothing;
