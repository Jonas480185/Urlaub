// Statische Stammdaten der Reise + Seed-Daten für den ersten Start.

export const TRIP = {
  name: 'Split Squad',
  claim: 'One trip. Seven people. Zero chaos.',
  destination: 'Kaštel Sućurac & Split',
  start: '2026-08-13',
  end: '2026-08-20',
  budget: 4500,
  departure: { label: 'Abflug', when: '2026-08-13T09:40:00' },
}

export const MEMBERS = [
  { id: 'jonas', name: 'Jonas', color: '#0797A5' },
  { id: 'max',   name: 'Max',   color: '#F5A623' },
  { id: 'lukas', name: 'Lukas', color: '#5E3AAE' },
  { id: 'tobi',  name: 'Tobi',  color: '#D64545' },
  { id: 'nik',   name: 'Nik',   color: '#1B9E6B' },
  { id: 'paul',  name: 'Paul',  color: '#3B6FD4' },
  { id: 'flo',   name: 'Flo',   color: '#C2571B' },
]

export const EXPENSE_CATS = [
  { id: 'unterkunft', name: 'Unterkunft', icon: 'home' },
  { id: 'transport',  name: 'Transport',  icon: 'car' },
  { id: 'einkauf',    name: 'Einkäufe',   icon: 'cart' },
  { id: 'essen',      name: 'Essen',      icon: 'food' },
  { id: 'aktivitaet', name: 'Aktivitäten', icon: 'boat' },
  { id: 'nightlife',  name: 'Nightlife',  icon: 'moon' },
  { id: 'sonstiges',  name: 'Sonstiges',  icon: 'dots' },
]

export const SHOP_CATS = [
  { id: 'getraenke', name: 'Getränke',  icon: 'bottle' },
  { id: 'fruehstueck', name: 'Frühstück', icon: 'food' },
  { id: 'snacks',    name: 'Snacks',    icon: 'snack' },
  { id: 'grillen',   name: 'Grillen',   icon: 'flame' },
  { id: 'haushalt',  name: 'Haushalt',  icon: 'home' },
  { id: 'strand',    name: 'Strand',    icon: 'sun' },
  { id: 'sonstiges', name: 'Sonstiges', icon: 'dots' },
]

export const SHOP_SEED = [
  { id: 's1',  name: 'Wasser', qty: '6 × 1,5 L', cat: 'getraenke', who: 'max',   done: false },
  { id: 's2',  name: 'Bier', qty: '2 Kästen', cat: 'getraenke', who: 'lukas', done: false },
  { id: 's3',  name: 'Softdrinks', qty: '', cat: 'getraenke', who: 'tobi', done: false },
  { id: 's4',  name: 'Eiswürfel', qty: '2 Beutel', cat: 'getraenke', who: null, done: false },
  { id: 's5',  name: 'Chips & Salzstangen', qty: '', cat: 'snacks', who: 'nik', done: false },
  { id: 's6',  name: 'Nüsse', qty: '', cat: 'snacks', who: 'paul', done: false },
  { id: 's7',  name: 'Brot', qty: '2 Stück', cat: 'fruehstueck', who: 'nik', done: false },
  { id: 's8',  name: 'Eier', qty: '10er-Pack', cat: 'fruehstueck', who: 'paul', done: false },
  { id: 's9',  name: 'Käse & Aufschnitt', qty: '', cat: 'fruehstueck', who: 'flo', done: false },
  { id: 's10', name: 'Sonnencreme', qty: 'LSF 50', cat: 'strand', who: 'lukas', done: false },
  { id: 's11', name: 'Müllbeutel', qty: '1 Rolle', cat: 'haushalt', who: 'tobi', done: false },
  { id: 's12', name: 'Küchenrolle', qty: '', cat: 'haushalt', who: null, done: false },
  { id: 's13', name: 'Toilettenpapier', qty: '1 Pack', cat: 'haushalt', who: null, done: false },
  { id: 's14', name: 'Elektrolyte', qty: '', cat: 'sonstiges', who: 'jonas', done: false },
]

export const EXPENSE_SEED = [
  { id: 'e1', title: 'Unterkunft (Anzahlung)', amount: 1260, cat: 'unterkunft', paidBy: 'jonas',
    parts: MEMBERS.map(m => m.id), date: '2026-06-15' },
  { id: 'e2', title: 'Bootstour Blue Lagoon', amount: 630, cat: 'aktivitaet', paidBy: 'jonas',
    parts: MEMBERS.map(m => m.id), date: '2026-07-28' },
  { id: 'e3', title: 'Van-Transfer Flughafen', amount: 420, cat: 'transport', paidBy: 'max',
    parts: MEMBERS.map(m => m.id), date: '2026-07-20' },
]

// Reiseplan 13.–20.08. – items je Tag, Teilnahme wird separat gespeichert.
export const PLAN_SEED = [
  { date: '2026-08-13', title: 'Anreise & Check-in', icon: 'plane', vibe: 'day',
    sub: 'Ankommen, Großeinkauf, erster Abend',
    items: [
      { id: 'p13a', time: '09:40', title: 'Abflug', place: 'Flughafen', note: 'Spätestens 07:40 am Gate sein!' },
      { id: 'p13b', time: '13:30', title: 'Check-in Airbnb', place: 'Kaštel Sućurac', note: 'Schlüsselübergabe mit Host' },
      { id: 'p13c', time: '16:00', title: 'Großeinkauf', place: 'Lidl Kaštel Sućurac', note: 'Einkaufsliste checken' },
      { id: 'p13d', time: '20:00', title: 'Entspannter Abend', place: 'Unterkunft', note: 'Grill anwerfen, ankommen' },
    ] },
  { date: '2026-08-14', title: 'Split-Tag & Clubnacht', icon: 'moon', vibe: 'night',
    sub: 'Altstadt, Riva, Marjan – abends Central Club',
    items: [
      { id: 'p14a', time: '10:30', title: 'Altstadt & Riva', place: 'Split', note: 'Diokletianpalast, Gassen, Kaffee an der Riva' },
      { id: 'p14b', time: '15:00', title: 'Marjan oder Strand', place: 'Kašjuni Beach', note: 'Aussichtspunkt oder direkt Strand' },
      { id: 'p14c', time: '23:00', title: 'Clubnacht', place: 'Central Club', note: 'Rückfahrt über „Sicher nach Hause“ organisieren' },
    ] },
  { date: '2026-08-15', title: 'Trogir oder Strandtag', icon: 'sun', vibe: 'day',
    sub: 'UNESCO-Altstadt oder chillen – abends gemeinsames Essen',
    items: [
      { id: 'p15a', time: '11:00', title: 'Trogir Altstadt', place: 'Trogir', note: 'Alternativ: Strandtag Bačvice' },
      { id: 'p15b', time: '19:30', title: 'Gemeinsames Abendessen', place: 'Konoba in Trogir', note: 'Tisch für 7 reservieren' },
    ] },
  { date: '2026-08-16', title: 'Chill- & Pooltag', icon: 'sun', vibe: 'day',
    sub: 'Relaxen, Sonne, abends Grillabend',
    items: [
      { id: 'p16a', time: '12:00', title: 'Pool & Sonne', place: 'Unterkunft', note: 'Sonnencreme!' },
      { id: 'p16b', time: '20:30', title: 'Grillabend', place: 'Unterkunft', note: 'Grillzeug auf der Einkaufsliste' },
    ] },
  { date: '2026-08-17', title: 'Bootstour Blue Lagoon', icon: 'boat', vibe: 'day',
    sub: 'Private Bootstour – Blue Lagoon & Inseln',
    items: [
      { id: 'p17a', time: '11:30', title: 'Bootstour Blue Lagoon', place: 'Trogir Marina', note: 'Treffpunkt 11:15 an der Marina. Handtücher + Sonnencreme!' },
    ] },
  { date: '2026-08-18', title: 'Roller-/E-Bike-Tour', icon: 'bike', vibe: 'day',
    sub: 'Küste von Kaštela erkunden',
    items: [
      { id: 'p18a', time: '10:00', title: 'Roller / E-Bikes leihen', place: 'Kaštela', note: 'Führerschein mitnehmen' },
    ] },
  { date: '2026-08-19', title: 'Split-Abend & Sunset', icon: 'moon', vibe: 'night',
    sub: 'Sunset, Bars oder Vanilla Club',
    items: [
      { id: 'p19a', time: '18:30', title: 'Sunset am Marjan', place: 'Marjan, Split', note: 'Danach Bars an der Riva' },
      { id: 'p19b', time: '23:00', title: 'Bars oder Club', place: 'Vanilla Club', note: 'Letzte Nacht – Rückfahrt planen' },
    ] },
  { date: '2026-08-20', title: 'Check-out & Heimreise', icon: 'plane', vibe: 'day',
    sub: 'Aufräumen, auschecken, safe travels!',
    items: [
      { id: 'p20a', time: '10:00', title: 'Check-out', place: 'Unterkunft', note: 'Müll raus, Schlüssel an Host' },
      { id: 'p20b', time: '17:55', title: 'Rückflug', place: 'Flughafen Split', note: 'Check-in-Deadline beachten!' },
    ] },
]

export const PLACE_CATS = [
  { id: 'unterkunft', name: 'Unterkunft', icon: 'home',  color: '#0797A5' },
  { id: 'einkaufen',  name: 'Einkaufen',  icon: 'cart',  color: '#F5A623' },
  { id: 'strand',     name: 'Strand',     icon: 'sun',   color: '#3B6FD4' },
  { id: 'sehen',      name: 'Sightseeing', icon: 'pin',  color: '#1B9E6B' },
  { id: 'nightlife',  name: 'Nightlife',  icon: 'moon',  color: '#5E3AAE' },
  { id: 'ausflug',    name: 'Ausflug',    icon: 'boat',  color: '#0797A5' },
  { id: 'transport',  name: 'Transport',  icon: 'bus',   color: '#C2571B' },
]

export const PLACES = [
  { id: 'airbnb', name: 'Airbnb Kaštel Sućurac', cat: 'unterkunft', lat: 43.5510, lng: 16.4310,
    desc: 'Unsere Unterkunft – Adresse im „Sicher nach Hause“-Bereich.', query: 'Kaštel Sućurac' },
  { id: 'lidl', name: 'Lidl Kaštel Sućurac', cat: 'einkaufen', lat: 43.5484, lng: 16.4249,
    desc: 'Großeinkauf am Anreisetag. Achtung: Alkoholverkauf in Läden nur 6–21 Uhr.', query: 'Lidl Kaštel Sućurac' },
  { id: 'altstadt', name: 'Split Altstadt', cat: 'sehen', lat: 43.5081, lng: 16.4402,
    desc: 'Diokletianpalast, enge Gassen, Bars – Pflichtprogramm.', query: 'Diokletianpalast Split' },
  { id: 'riva', name: 'Riva Promenade', cat: 'sehen', lat: 43.5074, lng: 16.4384,
    desc: 'Uferpromenade – perfekt für Kaffee und Sunset-Drinks.', query: 'Riva Split' },
  { id: 'marjan', name: 'Marjan', cat: 'sehen', lat: 43.5093, lng: 16.4152,
    desc: 'Stadtberg mit bestem Ausblick über Split.', query: 'Marjan Split' },
  { id: 'kasjuni', name: 'Kašjuni Beach', cat: 'strand', lat: 43.5040, lng: 16.4116,
    desc: 'Schönster Strand von Split, unterhalb des Marjan.', query: 'Kasjuni Beach Split' },
  { id: 'bacvice', name: 'Bačvice', cat: 'strand', lat: 43.5027, lng: 16.4479,
    desc: 'Stadtstrand – Heimat des Picigin. Abends viele Bars.', query: 'Bacvice Beach Split' },
  { id: 'trogir', name: 'Trogir Altstadt', cat: 'sehen', lat: 43.5170, lng: 16.2514,
    desc: 'UNESCO-Weltkulturerbe auf einer kleinen Insel.', query: 'Trogir Altstadt' },
  { id: 'marina', name: 'Trogir Marina', cat: 'ausflug', lat: 43.5145, lng: 16.2503,
    desc: 'Treffpunkt für die Bootstour am 17.08., 11:15 Uhr.', query: 'Trogir Marina' },
  { id: 'lagoon', name: 'Blue Lagoon', cat: 'ausflug', lat: 43.4416, lng: 16.1522,
    desc: 'Türkisblaues Wasser bei Drvenik Veli – Ziel der Bootstour.', query: 'Blue Lagoon Drvenik Croatia' },
  { id: 'central', name: 'Central Club', cat: 'nightlife', lat: 43.5089, lng: 16.4416,
    desc: 'Größter Club in Split – Clubnacht am 14.08.', query: 'Central Club Split' },
  { id: 'vanilla', name: 'Vanilla Club', cat: 'nightlife', lat: 43.5116, lng: 16.4665,
    desc: 'Open-Air-Club – Option für den 19.08.', query: 'Vanilla Club Split' },
  { id: 'bus37', name: 'Bus 37 (Haltestelle)', cat: 'transport', lat: 43.5493, lng: 16.4286,
    desc: 'Linie 37 Split ↔ Trogir hält in Kaštel Sućurac – günstigste Verbindung.', query: 'Kaštel Sućurac bus stop' },
]

export const SAFEHOME_DEFAULT = {
  address: 'Adresse noch eintragen – Put Sv. Jurja XX, 21212 Kaštel Sućurac',
  addressHr: 'Molim vas do ove adrese: Kaštel Sućurac (adresa slijedi)',
  cars: { 1: [], 2: [] },
  status: {},
  note: 'Für 7 Personen braucht ihr meist zwei Fahrzeuge.',
}
