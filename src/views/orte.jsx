import { Icon } from '../icons.jsx'
import { PLACES, PLACE_CATS } from '../data.js'
import { mapsUrl, mapsDirUrl, uberUrl, boltUrl } from '../util.js'
import { toast, sheet } from '../store.js'
import { Sheet, closeSheet } from '../components.jsx'
import { Scene, sceneForPlaceCat } from '../scenes.jsx'
import { useState } from 'preact/hooks'
import { HeadButtons } from './heute.jsx'

const catOf = (id) => PLACE_CATS.find(c => c.id === id) || PLACE_CATS[0]
const open = (url) => window.open(url, '_blank', 'noopener')

export function Orte() {
  const [filter, setFilter] = useState('alle')
  const list = PLACES.filter(p => filter === 'alle' || p.cat === filter)

  return (
    <div class="screen">
      <div class="pagehead">
        <div>
          <h1>Orte</h1>
          <div class="sub">Die besten Spots rund um Split</div>
        </div>
        <HeadButtons />
      </div>

      <div class="chiprow">
        <button class={`chip ${filter === 'alle' ? 'on' : ''}`} onClick={() => setFilter('alle')}>Alle</button>
        {PLACE_CATS.map(c => (
          <button key={c.id} class={`chip ${filter === c.id ? 'on' : ''}`} onClick={() => setFilter(c.id)}>
            <Icon name={c.icon} size={15} />{c.name}
          </button>
        ))}
      </div>

      {list.map(p => {
        const c = catOf(p.cat)
        return (
          <div key={p.id} class="row" style={{ alignItems: 'flex-start' }}>
            <span class="thumb sm" style={{ marginTop: 2 }}><Scene kind={sceneForPlaceCat[p.cat] || 'beach'} /></span>
            <button class="grow" style={{ textAlign: 'left' }} onClick={() => (sheet.value = { type: 'place', id: p.id })}>
              <span class="title">{p.name}</span>
              <span class="sub" style={{ display: 'block' }}>{p.desc}</span>
            </button>
            <button class="iconbtn" style={{ width: 38, height: 38 }} aria-label={`Route zu ${p.name}`}
              onClick={() => open(mapsDirUrl(p.query))}>
              <Icon name="nav" size={17} />
            </button>
          </div>
        )
      })}
    </div>
  )
}

export function PlaceSheet({ id }) {
  const p = PLACES.find(x => x.id === id)
  if (!p) return null
  const c = catOf(p.cat)
  return (
    <Sheet title={p.name} onClose={closeSheet}>
      <div class="sheetbanner">
        <Scene kind={sceneForPlaceCat[p.cat] || 'beach'} />
        <div class="shade" />
        <div class="bannertext">{p.name}</div>
      </div>
      <span class="tag" style={{ background: c.color + '1E', color: c.color }}>
        <Icon name={c.icon} size={13} />{c.name}
      </span>
      <p style={{ margin: '12px 0 16px', color: 'var(--ink-2)', fontSize: '.94rem' }}>{p.desc}</p>
      <div class="statgrid">
        <button class="btn primary" onClick={() => open(mapsDirUrl(p.query))}><Icon name="nav" size={17} />Route</button>
        <button class="btn navy" onClick={() => open(mapsUrl(p.query))}><Icon name="pin" size={17} />Auf Karte</button>
        <button class="btn ghost" onClick={() => open(uberUrl(p.lat, p.lng, p.name))}><Icon name="car" size={17} />Uber</button>
        <button class="btn ghost" onClick={() => open(boltUrl())}><Icon name="car" size={17} />Bolt</button>
      </div>
      <button class="btn block" style={{ marginTop: 10, background: 'var(--card)', boxShadow: 'var(--shadow)' }}
        onClick={() => { navigator.clipboard?.writeText(p.query); toast('Ort kopiert') }}>
        <Icon name="copy" size={16} />„{p.query}" kopieren
      </button>
    </Sheet>
  )
}
