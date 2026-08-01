-- Optionaler geteilter Sync für Split Squad.
-- Kostenloses Supabase-Projekt anlegen (supabase.com) und dieses SQL im
-- SQL-Editor ausführen. Danach in der App unter Profil → "Sync einrichten"
-- die Projekt-URL und den Anon-Key eintragen.

create table if not exists public.kv (
  k text primary key,
  v jsonb not null,
  t timestamptz not null default now(),
  -- Nur die von der App verwendeten Datenbereiche zulassen
  constraint kv_known_keys check (k in ('shopping', 'kasse', 'plan', 'safehome', 'crew')),
  -- Missbrauch als Datenhalde verhindern (max. ~200 KB pro Bereich)
  constraint kv_size check (pg_column_size(v) < 200000)
);

alter table public.kv enable row level security;

-- Sicherheitsmodell (bewusst einfach): Der Anon-Key wirkt wie ein geteilter
-- Reisecode. Wer URL + Key hat (= die Crew), darf die 5 Datenbereiche lesen
-- und schreiben. Löschen ist niemandem erlaubt (keine delete-Policy).
-- Keine sensiblen Daten (Passwörter, Zahlungsdaten, Ausweise) hier ablegen!
create policy "crew_read"   on public.kv for select using (true);
create policy "crew_insert" on public.kv for insert with check (true);
create policy "crew_update" on public.kv for update using (true) with check (true);
