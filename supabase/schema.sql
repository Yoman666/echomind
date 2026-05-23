create table if not exists records (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  type text not null check (type in ('expense', 'mood', 'journal', 'learning')),
  title text not null,
  content text not null,
  tags jsonb not null default '[]'::jsonb,
  amount numeric,
  created_at timestamptz not null default now()
);

create index if not exists records_user_id_idx on records (user_id);
create index if not exists records_type_idx on records (type);
create index if not exists records_created_at_idx on records (created_at desc);
