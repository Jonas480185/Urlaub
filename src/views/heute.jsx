import { Icon } from '../icons.jsx'
import { TRIP, PLAN_SEED, PLACES } from '../data.js'
import { tripDay, daysUntil, fmtDay, fmtDayLong, todayISO, mapsDirUrl, uberUrl, boltUrl, fmtEUR } from '../util.js'
import { me, tab, sheet, shopping, kasse, plan, toast, safehome } from '../store.js'
import { AvStack, memberById } from '../components.jsx'
import { Scene, sceneForIcon } from '../scenes.jsx'
import { visibleItems, participantsOf } from './plan.jsx'
import { openSettlements } from './ausgaben.jsx'

function nextEvent() {
  const now = new Date()
  const today = todayISO()
  for (const day of PLAN_SEED) {
    if (day.date < today) continue
    for (const it of visibleItems(day)) {
      const dt = new Date(`${day.date}T${it.time || '23:59'}:00`)
      if (dt >= now) return { day, item: it }
    }
  }
  return null
}

const open = (url) => window.open(url, '_blank', 'noopener')

export function Heute() {
  const day = tripDay(TRIP.start, TRIP.end)
  const until = daysUntil(TRIP.start)
  const next = nextEvent()
  const myOpenShopping = shopping.value.items.filter(i => !i.done && i.who === me.value?.id)
  const openShopping = shopping.value.items.filter(i => !i.done)
  const mySettle = openSettlements(kasse.value).filter(s => s.from === me.value?.id)
  const airbnb = PLACES.find(p => p.id === 'airbnb')
  const yes = next ? participantsOf(next.item.id) : []

  return (
    <div class="screen">
      <div class="pagehead">
        <div>
          <h1>Hoi {me.value?.name || ''}! <span aria-hidden="true">☀</span></h1>
          <div class="sub">{fmtDayLong(todayISO())} · {TRIP.destination.split(' & ')[0]}</div>
          <span class="daybadge">
            <Icon name="sun" size={14} />
            {day ? `Tag ${day} von 8` : until > 0 ? `Noch ${until} Tage bis Split` : 'Safe travels!'}
          </span>
        </div>
        <HeadButtons />
      </div>

      {next ? (
        <div class="hero">
          <Scene kind={sceneForIcon[next.day.icon] || 'beach'} />
          <div class="shade" />
          <div class="hero-in">
            <div class="eyebrow">Als Nächstes · {fmtDay(next.day.date)}</div>
            <h2>{next.item.title}</h2>
            <div class="meta">
              <span><Icon name="clock" size={16} />{next.item.time} Uhr</span>
              <span><Icon name="pin" size={16} />{next.item.place}</span>
            </div>
            <div class="meta" style={{ alignItems: 'center' }}>
              <AvStack ids={yes} />
              <span style={{ fontSize: '.84rem' }}>{yes.length}/7 zugesagt</span>
            </div>
            <div style={{ display: 'flex', gap: '8px', marginTop: '14px' }}>
              <button class="btn white sm" onClick={() => open(mapsDirUrl(next.item.place))}><Icon name="nav" size={16} />Route</button>
              <button class="btn orange sm" onClick={() => (tab.value = 'plan')}><Icon name="calendar" size={16} />Zum Plan</button>
            </div>
          </div>
        </div>
      ) : (
        <div class="hero">
          <Scene kind="sunset" />
          <div class="shade" />
          <div class="hero-in">
            <div class="eyebrow">Heute</div>
            <h2>Noch alles offen</h2>
            <div class="meta"><span>Plant spontan etwas oder genießt einfach die Adria.</span></div>
            <button class="btn white sm" style={{ marginTop: '12px' }} onClick={() => (tab.value = 'plan')}>Aktivität planen</button>
          </div>
        </div>
      )}

      <div class="sectionhead"><h3>Schnellaktionen</h3></div>
      <div class="quickgrid">
        <button class="quick safe" onClick={() => (sheet.value = { type: 'safehome' })}>
          <span class="qicon"><Icon name="shield" /></span>Sicher heim
        </button>
        <button class="quick" onClick={() => open(mapsDirUrl(safehome.value.address))}>
          <span class="qicon"><Icon name="nav" /></span>Route
        </button>
        <button class="quick" onClick={() => open(uberUrl(airbnb.lat, airbnb.lng, 'Airbnb'))}>
          <span class="qicon"><Icon name="car" /></span>Uber
        </button>
        <button class="quick" onClick={() => open(boltUrl())}>
          <span class="qicon"><Icon name="car" /></span>Bolt
        </button>
        <button class="quick warm" onClick={() => (sheet.value = { type: 'expense' })}>
          <span class="qicon"><Icon name="euro" /></span>Ausgabe
        </button>
        <button class="quick warm" onClick={() => (tab.value = 'einkaufen')}>
          <span class="qicon"><Icon name="cart" /></span>Einkauf
        </button>
        <button class="quick" onClick={() => { navigator.clipboard?.writeText(safehome.value.address); toast('Adresse kopiert') }}>
          <span class="qicon"><Icon name="copy" /></span>Adresse
        </button>
        <button class="quick night" onClick={() => (tab.value = 'orte')}>
          <span class="qicon"><Icon name="pin" /></span>Orte
        </button>
      </div>

      {(mySettle.length > 0 || myOpenShopping.length > 0 || openShopping.length > 0) && (
        <div class="sectionhead"><h3>Für dich offen</h3></div>
      )}
      {mySettle.map(s => (
        <button key={s.to} class="row" style={{ width: '100%', textAlign: 'left' }} onClick={() => (tab.value = 'ausgaben')}>
          <span class="qicon" style={{ width: 38, height: 38, borderRadius: 12, background: 'var(--orange-soft)', color: '#A66A00', display: 'grid', placeItems: 'center' }}><Icon name="wallet" size={18} /></span>
          <span class="grow">
            <span class="title">Du schuldest {memberById(s.to)?.name} {fmtEUR(s.amount)}</span>
            <span class="sub" style={{ display: 'block' }}>Tippen zum Ausgleichen</span>
          </span>
          <Icon name="chevR" class="" size={18} />
        </button>
      ))}
      {(myOpenShopping.length > 0 || openShopping.length > 0) && (
        <button class="row" style={{ width: '100%', textAlign: 'left' }} onClick={() => (tab.value = 'einkaufen')}>
          <span style={{ width: 38, height: 38, borderRadius: 12, background: 'var(--teal-soft)', color: 'var(--teal-deep)', display: 'grid', placeItems: 'center' }}><Icon name="cart" size={18} /></span>
          <span class="grow">
            <span class="title">{openShopping.length} Artikel auf der Einkaufsliste</span>
            <span class="sub" style={{ display: 'block' }}>{myOpenShopping.length ? `Davon ${myOpenShopping.length} bei dir` : 'Nichts davon bei dir'}</span>
          </span>
          <Icon name="chevR" size={18} />
        </button>
      )}
    </div>
  )
}

export function HeadButtons() {
  return (
    <div class="headbtns">
      <SyncButton />
      <button class="iconbtn" onClick={() => (sheet.value = { type: 'profile' })} aria-label="Profil & Gruppe">
        {me.value
          ? <span class="avatar" style={{ background: me.value.color }}>{me.value.name.slice(0, 2).toUpperCase()}</span>
          : <Icon name="users" />}
      </button>
    </div>
  )
}

import { syncState, pullAll } from '../store.js'
function SyncButton() {
  const st = syncState.value
  return (
    <button class={`iconbtn ${st === 'loading' || st === 'saving' ? 'spin' : ''}`}
      onClick={() => pullAll(true)} aria-label="Synchronisieren"
      style={st === 'error' ? { color: 'var(--red)' } : {}}>
      <Icon name="refresh" />
    </button>
  )
}

