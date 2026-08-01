# 🌴 Split Squad

**One trip. Seven people. Zero chaos.**

Privates Urlaubscockpit für den Gruppenurlaub in **Kaštel Sućurac & Split, 13.–20. August 2026** – für Jonas, Max, Lukas, Tobi, Nik, Paul und Flo.

Mobile-first PWA: installierbar auf iPhone & Android, offline-fähig, ohne Login-Zwang.

## Features

- **Heute** – Countdown bzw. „Tag X von 8", nächster Programmpunkt, Schnellaktionen (Route, Uber, Bolt, Ausgabe, Sicher nach Hause), offene Aufgaben & Schulden auf einen Blick
- **Plan** – kompletter Reiseplan 13.–20.08. mit Tages-Timeline, Teilnahme (Dabei / Vielleicht / Nicht dabei), eigene Programmpunkte anlegen & löschen
- **Einkaufen** – gemeinsame Liste mit Kategorien, Mengen, Zuständigkeiten („bringt Max mit"), Filter „Meine", „Im Korb"-Bereich mit Wiederherstellen
- **Ausgaben** – Gruppenkasse à la Splitwise: Ausgaben mit beliebiger Beteiligten-Auswahl, Salden pro Person, **„So seid ihr quitt"** mit minimalen Ausgleichszahlungen (Greedy-Matching), Budget-Tracking (4.500 €), Kategorien-Auswertung
- **Orte** – die besten Spots (Airbnb, Lidl, Altstadt, Kašjuni, Trogir, Blue Lagoon, Clubs, Bus 37 …) mit Deep Links zu Google Maps, Uber & Bolt
- **Sicher nach Hause** – Vollbild-Ansicht mit Airbnb-Adresse (auch auf Kroatisch), Kopieren/Maps/Uber/Bolt, Aufteilung auf zwei Autos und Live-Status pro Person („Noch im Club" → „Angekommen")

## Warum dieser Tech-Ansatz?

Es gab zwei Prompt-Varianten: eine minimale Single-File-App und ein Full-Stack-Konzept mit Supabase (Auth, Realtime, RLS). Umgesetzt ist der **sinnvollste Mittelweg**:

- **Local-first**: Alle Daten liegen sofort in `localStorage` – die App funktioniert ohne Backend, ohne Registrierung und mit schlechtem Empfang am Strand. Ein Supabase-Zwang hätte ohne provisioniertes Projekt eine nicht lauffähige App bedeutet.
- **Optionaler geteilter Sync**: Mit einem kostenlosen Supabase-Projekt (5 Minuten Setup, siehe unten) synchronisiert sich die Crew automatisch – per REST, ohne zusätzliche Client-Library. Konfliktregel: Last-write-wins pro Datenbereich.
- **Kein Framework-Ballast**: Preact + Signals, handgeschriebenes Design-System (Adria-Palette: Türkis `#0797A5`, Navy `#082E5C`, Orange `#F5A623`, Violett `#5E3AAE`). Gesamtes JS: ~24 KB gzip.

## Lokal starten

```bash
npm install
npm run dev      # Dev-Server
npm test         # 12 Unit-Tests (Splitwise-Mathe, Ausgleich, Datumslogik)
npm run build    # Produktions-Build nach docs/
```

## Deployment (GitHub Pages)

Der Build liegt versioniert in `docs/`. Einmalig aktivieren:

1. GitHub → **Settings → Pages**
2. Source: **Deploy from a branch**, Branch: `main` (bzw. dieser Branch), Ordner: **/docs**
3. Die App ist dann unter `https://<user>.github.io/Urlaub/` erreichbar – Link an die Crew schicken, jeder wählt beim ersten Öffnen seinen Namen.

**Installieren:** iPhone → Teilen → „Zum Home-Bildschirm" · Android → Menü → „App installieren".

## Geteilten Sync einrichten (optional, ~5 Minuten)

1. Kostenloses Projekt auf [supabase.com](https://supabase.com) anlegen
2. `supabase/schema.sql` im SQL-Editor ausführen
3. In der App: Profil-Menü (oben rechts) → **Sync einrichten** → Projekt-URL + Anon-Key eintragen
4. Dieselben zwei Werte an die Crew weitergeben – fertig. Die App pollt alle 30 s, bei App-Fokus und über den Sync-Button.

> Hinweis: Der Anon-Key wirkt wie ein geteilter Reisecode – wer ihn hat, sieht die gemeinsamen Daten. Keine sensiblen Daten eintragen.

## Mögliche Ausbaustufen

- Abstimmungen (Bootstour Montag oder Dienstag?) mit Übernahme in den Plan
- Ungleiche Kostenaufteilung (individuelle Beträge / Prozente)
- Vorräte-Bereich in der Einkaufsliste, Belegfotos bei Ausgaben
- Echtes Realtime (Supabase Channels) statt Polling, Push-Benachrichtigungen
- Kartenansicht der Orte (MapLibre/Leaflet)
