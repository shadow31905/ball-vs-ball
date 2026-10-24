-- Ball VS Ball: run once in Supabase SQL Editor.
-- Supabase Auth stores email/password securely. No password is stored in these tables.
-- A UNIQUE index on lower(nick) prevents duplicates even with simultaneous signups.

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  nick text not null check (nick ~ '^[A-Za-z0-9_]{3,16}$'),
  wins integer not null default 0 check (wins >= 0),
  level integer not null default 1 check (level >= 1),
  updated_at timestamptz not null default now()
);
create unique index if not exists bvb_profiles_nick_unique on public.profiles (lower(nick));

create table if not exists public.saves (
  user_id uuid primary key references auth.users(id) on delete cascade,
  state text not null check (char_length(state) <= 350000),
  updated_at timestamptz not null default now()
);

create table if not exists public.friends (
  user_id uuid not null references auth.users(id) on delete cascade,
  friend_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id,friend_id),
  check (user_id <> friend_id)
);

create table if not exists public.invites (
  id uuid primary key default gen_random_uuid(),
  sender_id uuid not null references auth.users(id) on delete cascade,
  recipient_id uuid not null references auth.users(id) on delete cascade,
  room_code text not null check (char_length(room_code) between 3 and 150),
  created_at timestamptz not null default now(),
  check (sender_id <> recipient_id)
);
create index if not exists bvb_invites_recipient on public.invites (recipient_id, created_at desc);

-- Runs inside the Auth sign-up transaction, so nickname uniqueness is atomic.
-- Untrusted user_metadata never grants privileges or stores a password here.
create schema if not exists bvb_private;

create or replace function bvb_private.bvb_create_profile()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare chosen_nick text;
begin
  chosen_nick := new.raw_user_meta_data ->> 'nick';
  if chosen_nick is null or chosen_nick !~ '^[A-Za-z0-9_]{3,16}$' then
    raise exception 'Invalid BVB nickname';
  end if;
  insert into public.profiles(id,nick) values (new.id,chosen_nick);
  return new;
end;
$$;

drop trigger if exists bvb_auth_user_created on auth.users;
create trigger bvb_auth_user_created
  after insert on auth.users
  for each row execute function bvb_private.bvb_create_profile();

alter table public.profiles enable row level security;
alter table public.saves enable row level security;
alter table public.friends enable row level security;
alter table public.invites enable row level security;

-- Nick + leaderboard stats are public; no email or private state in profiles.
drop policy if exists bvb_profile_public on public.profiles;
create policy bvb_profile_public on public.profiles for select to anon, authenticated using (true);
drop policy if exists bvb_profile_self_update on public.profiles;
create policy bvb_profile_self_update on public.profiles for update to authenticated
  using (id = (select auth.uid())) with check (id = (select auth.uid()));

-- No direct profile inserts/deletes from clients. Auth trigger creates them.
drop policy if exists bvb_save_self_select on public.saves;
create policy bvb_save_self_select on public.saves for select to authenticated
  using (user_id = (select auth.uid()));
drop policy if exists bvb_save_self_insert on public.saves;
create policy bvb_save_self_insert on public.saves for insert to authenticated
  with check (user_id = (select auth.uid()));
drop policy if exists bvb_save_self_update on public.saves;
create policy bvb_save_self_update on public.saves for update to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));

drop policy if exists bvb_friends_self_select on public.friends;
create policy bvb_friends_self_select on public.friends for select to authenticated
  using (user_id = (select auth.uid()));
drop policy if exists bvb_friends_self_insert on public.friends;
create policy bvb_friends_self_insert on public.friends for insert to authenticated
  with check (user_id = (select auth.uid()));
drop policy if exists bvb_friends_self_delete on public.friends;
create policy bvb_friends_self_delete on public.friends for delete to authenticated
  using (user_id = (select auth.uid()));

drop policy if exists bvb_invites_private_select on public.invites;
create policy bvb_invites_private_select on public.invites for select to authenticated
  using (sender_id = (select auth.uid()) or recipient_id = (select auth.uid()));
drop policy if exists bvb_invites_sender_insert on public.invites;
create policy bvb_invites_sender_insert on public.invites for insert to authenticated
  with check (sender_id = (select auth.uid()));
drop policy if exists bvb_invites_delete on public.invites;
create policy bvb_invites_delete on public.invites for delete to authenticated
  using (sender_id = (select auth.uid()) or recipient_id = (select auth.uid()));

-- Least-privilege grants; RLS applies to all requests from web clients.
grant usage on schema public to anon,authenticated;
grant select on public.profiles to anon,authenticated;
grant update (nick,wins,level,updated_at) on public.profiles to authenticated;
grant select,insert,update on public.saves to authenticated;
grant select,insert,delete on public.friends to authenticated;
grant select,insert,delete on public.invites to authenticated;

-- Ranking is informational only. Preventing falsified wins needs a trusted server.
-- Privileged Auth trigger stays in a non-exposed schema.
revoke all on schema bvb_private from public, anon, authenticated;
revoke all on function bvb_private.bvb_create_profile() from public, anon, authenticated;
