-- Nailflow — schema inicial (Fase 2/3)
-- Aplicar no Supabase: Dashboard → SQL Editor → colar e rodar.
-- Idempotente onde possível.

-- ============================================================ TABELAS ===

create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  duration_min int not null default 60,
  price numeric(10,2),
  created_at timestamptz not null default now()
);

create table if not exists public.clients (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text,
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists public.appointments (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references public.clients(id) on delete set null,
  client_name text not null,
  client_phone text,
  service_id uuid references public.services(id) on delete set null,
  service_name text,
  starts_at timestamptz not null,
  duration_min int not null default 60,
  status text not null default 'agendado', -- agendado | concluido | cancelado
  notes text,
  created_at timestamptz not null default now()
);
create index if not exists appointments_starts_at_idx on public.appointments (starts_at);

-- conteúdo editável da landing (chave/valor)
create table if not exists public.site_content (
  key text primary key,
  value text,
  updated_at timestamptz not null default now()
);

-- galeria (fotos no Storage)
create table if not exists public.gallery_images (
  id uuid primary key default gen_random_uuid(),
  title text,
  storage_path text not null,
  public_url text not null,
  sort int not null default 0,
  created_at timestamptz not null default now()
);

-- =============================================================== RLS ===
-- Modelo: leitura pública (landing) onde faz sentido; escrita só logado (a dona).
-- clients/appointments: nada para o público (anon), só autenticado.

alter table public.services       enable row level security;
alter table public.clients        enable row level security;
alter table public.appointments   enable row level security;
alter table public.site_content   enable row level security;
alter table public.gallery_images enable row level security;

-- helper de política idempotente via drop+create
drop policy if exists services_read     on public.services;
drop policy if exists services_write    on public.services;
drop policy if exists content_read       on public.site_content;
drop policy if exists content_write      on public.site_content;
drop policy if exists gallery_read       on public.gallery_images;
drop policy if exists gallery_write      on public.gallery_images;
drop policy if exists clients_all        on public.clients;
drop policy if exists appointments_all   on public.appointments;

create policy services_read   on public.services       for select using (true);
create policy services_write  on public.services       for all    using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy content_read    on public.site_content   for select using (true);
create policy content_write   on public.site_content   for all    using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy gallery_read    on public.gallery_images for select using (true);
create policy gallery_write   on public.gallery_images for all    using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy clients_all      on public.clients        for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy appointments_all on public.appointments   for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- =========================================================== STORAGE ===
insert into storage.buckets (id, name, public)
values ('gallery', 'gallery', true)
on conflict (id) do nothing;

drop policy if exists gallery_obj_read   on storage.objects;
drop policy if exists gallery_obj_insert on storage.objects;
drop policy if exists gallery_obj_update on storage.objects;
drop policy if exists gallery_obj_delete on storage.objects;

create policy gallery_obj_read   on storage.objects for select using (bucket_id = 'gallery');
create policy gallery_obj_insert on storage.objects for insert with check (bucket_id = 'gallery' and auth.role() = 'authenticated');
create policy gallery_obj_update on storage.objects for update using (bucket_id = 'gallery' and auth.role() = 'authenticated');
create policy gallery_obj_delete on storage.objects for delete using (bucket_id = 'gallery' and auth.role() = 'authenticated');

-- ============================================================= SEED ===
insert into public.services (name, price, duration_min)
select v.name, v.price, v.duration_min
from (values
  ('Alongamento em Fibra', 120, 120),
  ('Unhas em Gel',          90,  90),
  ('Esmaltação em Gel',     60,  60),
  ('Nail Art',               0,  60),
  ('Banho de Gel',          75,  75),
  ('Manutenção',            70,  90)
) as v(name, price, duration_min)
where not exists (select 1 from public.services);

insert into public.site_content (key, value) values
  ('hero_title',    'Suas mãos merecem arte.'),
  ('hero_subtitle', 'Alongamento, gel e nail art feitos com cuidado de verdade. Reserve seu horário online em segundos.')
on conflict (key) do nothing;
