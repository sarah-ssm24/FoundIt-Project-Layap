-- FoundIt schema untuk Supabase.
-- Jalankan di Supabase > SQL Editor.
-- CATATAN: script ini TIDAK menghapus tabel items yang sudah ada.

create table if not exists public.items (
  id bigint generated always as identity primary key,
  user_id uuid not null default auth.uid(),
  tipe text not null check (tipe in ('hilang','ditemukan')),
  kategori text not null,
  nama text not null,
  merek text,
  warna text,
  ciri text,
  lokasi text not null,
  area text,
  tanggal date not null,
  waktu text not null,
  wa text not null,
  bukti text,
  foto text[] not null default '{}',
  selesai boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.items enable row level security;
revoke all on public.items from anon, authenticated;
grant select (id,user_id,tipe,kategori,nama,merek,warna,ciri,lokasi,area,tanggal,waktu,wa,foto,selesai,created_at) on public.items to authenticated;
grant insert (tipe,kategori,nama,merek,warna,ciri,lokasi,area,tanggal,waktu,wa,bukti,foto) on public.items to authenticated;

drop policy if exists baca on public.items;
create policy baca on public.items for select to authenticated using (true);
drop policy if exists lapor on public.items;
create policy lapor on public.items for insert to authenticated with check (user_id = auth.uid());

create or replace function public.selesaikan(p_id bigint) returns boolean
language sql security definer set search_path = public as $$
  with u as (
    update public.items set selesai = true
    where id = p_id and user_id = auth.uid()
    returning 1
  )
  select exists (select 1 from u);
$$;
grant execute on function public.selesaikan(bigint) to authenticated;

insert into storage.buckets (id,name,public)
values ('foto','foto',true)
on conflict (id) do nothing;

drop policy if exists upload_foto on storage.objects;
create policy upload_foto on storage.objects
for insert to authenticated
with check (bucket_id = 'foto');
