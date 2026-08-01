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

// IDs bleiben stabil (auch bei Umbenennung) – daran hängen Kasse, Liste & Co.
export const MEMBERS = [
  { id: 'jonas', name: 'Jonas',          color: '#0797A5' },
  { id: 'max',   name: 'Luis Weide',     color: '#F5A623' },
  { id: 'lukas', name: 'Luis Wurstmann', color: '#5E3AAE' },
  { id: 'tobi',  name: 'Ben',            color: '#D64545' },
  { id: 'nik',   name: 'Niklas',         color: '#1B9E6B' },
  { id: 'paul',  name: 'Jan',            color: '#3B6FD4' },
  { id: 'flo',   name: 'Jens',           color: '#C2571B' },
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

// Einkaufsliste und Kasse starten leer – echte Einträge kommen von der Crew.
export const SHOP_SEED = []
export const EXPENSE_SEED = []

// Die 8 Reisetage als leeres Gerüst – Programmpunkte legt die Crew selbst an.
export const DAYS = [
  '2026-08-13', '2026-08-14', '2026-08-15', '2026-08-16',
  '2026-08-17', '2026-08-18', '2026-08-19', '2026-08-20',
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
    desc: 'Ablegepunkt für Bootstouren Richtung Blue Lagoon & Inseln.', query: 'Trogir Marina' },
  { id: 'lagoon', name: 'Blue Lagoon', cat: 'ausflug', lat: 43.4416, lng: 16.1522,
    desc: 'Türkisblaues Wasser bei Drvenik Veli – perfekt für eine Bootstour.', query: 'Blue Lagoon Drvenik Croatia' },
  { id: 'central', name: 'Central Club', cat: 'nightlife', lat: 43.5089, lng: 16.4416,
    desc: 'Größter Club in Split.', query: 'Central Club Split' },
  { id: 'vanilla', name: 'Vanilla Club', cat: 'nightlife', lat: 43.5116, lng: 16.4665,
    desc: 'Open-Air-Club über dem Stadtstrand.', query: 'Vanilla Club Split' },
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
