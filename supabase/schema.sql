-- Optionaler geteilter Sync für Split Squad.
-- Kostenloses Supabase-Projekt anlegen (supabase.com) und dieses SQL im
-- SQL-Editor ausführen. Danach in der App unter Profil → "Sync einrichten"
-- die Projekt-URL und den Anon-Key eintragen.

create table if not exists public.kv (
  k text primary key,
  v jsonb not null,
  t timestamptz not null default now()
);

alter table public.kv enable row level security;

-- Bewusst einfach gehalten: Jeder mit dem Anon-Key (= jeder aus der Crew,
-- der die App-Konfiguration hat) darf lesen und schreiben. Der Key wirkt
-- damit wie ein geteilter Reisecode. Keine sensiblen Daten hier ablegen!
create policy "crew_read"  on public.kv for select using (true);
create policy "crew_write" on public.kv for insert with check (true);
create policy "crew_update" on public.kv for update using (true);
