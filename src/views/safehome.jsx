import { Icon } from '../icons.jsx'
import { MEMBERS, PLACES } from '../data.js'
import { mapsDirUrl, uberUrl, boltUrl } from '../util.js'
import { safehome, me, update, toast } from '../store.js'
import { Avatar, memberById, closeSheet } from '../components.jsx'
import { useState } from 'preact/hooks'

const STATI = [
  ['club', 'Noch im Club', 'moon'],
  ['wartet', 'Wartet', 'clock'],
  ['auto', 'Im Auto', 'car'],
  ['home', 'Angekommen', 'home'],
]

const open = (url) => window.open(url, '_blank', 'noopener')

export function SafeHome() {
  const sh = safehome.value
  const [editing, setEditing] = useState(false)
  const [addr, setAddr] = useState(sh.address)
  const airbnb = PLACES.find(p => p.id === 'airbnb')
  const myId = me.value?.id
  const myCar = sh.cars[1].includes(myId) ? 1 : sh.cars[2].includes(myId) ? 2 : null
  const myStatus = sh.status[myId] || 'club'
  const allHome = MEMBERS.every(m => sh.status[m.id] === 'home')

  const setCar = (car) => update(safehome, 'safehome', s => {
    s.cars[1] = s.cars[1].filter(x => x !== myId)
    s.cars[2] = s.cars[2].filter(x => x !== myId)
    if (car) s.cars[car].push(myId)
    return s
  })
  const setStatus = (st) => {
    update(safehome, 'safehome', s => { s.status[myId] = st; return s })
    toast(st === 'home' ? 'Gut angekommen ✓' : 'Status aktualisiert')
  }

  return (
    <div class="fullscreen">
      <div class="inner">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ width: 44, height: 44, borderRadius: 15, background: 'rgba(255,255,255,.15)', display: 'grid', placeItems: 'center' }}>
              <Icon name="shield" size={24} />
            </span>
            <div>
              <h1 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Sicher nach Hause</h1>
              <div style={{ fontSize: '.8rem', opacity: .8 }}>Gemeinsam ankommen</div>
            </div>
          </div>
          <button class="iconbtn" style={{ background: 'rgba(255,255,255,.15)', color: '#fff', boxShadow: 'none' }}
            onClick={closeSheet} aria-label="Schließen"><Icon name="x" /></button>
        </div>

        <div class="card" style={{ background: 'rgba(255,255,255,.1)', backdropFilter: 'blur(6px)', color: '#fff', boxShadow: 'none' }}>
          <div class="eyebrow" style={{ color: 'var(--orange)', fontSize: '.7rem', fontWeight: 800, letterSpacing: '.14em', textTransform: 'uppercase' }}>Unser Airbnb</div>
          {editing ? (
            <>
              <textarea class="input" rows={2} value={addr} onInput={e => setAddr(e.target.value)}
                style={{ marginTop: 8, color: 'var(--ink)' }} />
              <button class="btn orange sm" style={{ marginTop: 8 }} onClick={() => {
                update(safehome, 'safehome', s => { s.address = addr.trim(); return s })
                setEditing(false); toast('Adresse gespeichert')
              }}>Speichern</button>
            </>
          ) : (
            <>
              <p style={{ fontSize: '1.15rem', fontWeight: 800, margin: '6px 0 2px' }}>{sh.address}</p>
              <p style={{ fontSize: '.84rem', opacity: .85, fontStyle: 'italic' }}>„{sh.addressHr}"</p>
              <button class="more" style={{ color: 'var(--orange)', fontSize: '.8rem', marginTop: 6, fontWeight: 700 }}
                onClick={() => { setAddr(sh.address); setEditing(true) }}>Adresse bearbeiten</button>
            </>
          )}
        </div>

        <div class="statgrid" style={{ marginBottom: 14 }}>
          <button class="btn orange" onClick={() => { navigator.clipboard?.writeText(sh.address); toast('Adresse kopiert') }}>
            <Icon name="copy" size={17} />Kopieren
          </button>
          <button class="btn white" style={{ background: 'rgba(255,255,255,.16)' }} onClick={() => open(mapsDirUrl(sh.address))}>
            <Icon name="nav" size={17} />Maps
          </button>
          <button class="btn white" style={{ background: 'rgba(255,255,255,.16)' }} onClick={() => open(uberUrl(airbnb.lat, airbnb.lng, 'Airbnb Kaštel Sućurac'))}>
            <Icon name="car" size={17} />Uber
          </button>
          <button class="btn white" style={{ background: 'rgba(255,255,255,.16)' }} onClick={() => open(boltUrl())}>
            <Icon name="car" size={17} />Bolt
          </button>
        </div>
        <p class="hint" style={{ color: 'rgba(255,255,255,.75)', textAlign: 'center', marginBottom: 20 }}>
          <Icon name="users" size={13} /> {sh.note}
        </p>

        <h3 style={{ fontWeight: 800, marginBottom: 10 }}>Autoaufteilung</h3>
        <div class="statgrid" style={{ marginBottom: 6 }}>
          {[1, 2].map(car => (
            <div key={car} class="card" style={{ background: 'rgba(255,255,255,.1)', color: '#fff', boxShadow: 'none', marginBottom: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong>Auto {car}</strong>
                <span class="hint" style={{ color: 'rgba(255,255,255,.7)' }}>{sh.cars[car].length}/4</span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, margin: '10px 0', minHeight: 32 }}>
                {sh.cars[car].length === 0 && <span class="hint" style={{ color: 'rgba(255,255,255,.55)' }}>Noch leer</span>}
                {sh.cars[car].map(id => <Avatar key={id} id={id} />)}
              </div>
              <button class={`btn sm block ${myCar === car ? 'orange' : 'white'}`}
                style={myCar !== car ? { background: 'rgba(255,255,255,.16)' } : {}}
                disabled={myCar !== car && sh.cars[car].length >= 4}
                onClick={() => { setCar(myCar === car ? null : car); toast(myCar === car ? 'Aus Auto raus' : `Du sitzt in Auto ${car}`) }}>
                {myCar === car ? 'Aussteigen' : 'Ich fahre mit'}
              </button>
            </div>
          ))}
        </div>

        <h3 style={{ fontWeight: 800, margin: '14px 0 10px' }}>Dein Status</h3>
        <div class="statgrid">
          {STATI.map(([val, label, icon]) => (
            <button key={val} class={`btn ${myStatus === val ? 'orange' : 'white'}`}
              style={myStatus !== val ? { background: 'rgba(255,255,255,.13)' } : {}}
              onClick={() => setStatus(val)}>
              <Icon name={icon} size={17} />{label}
            </button>
          ))}
        </div>

        <h3 style={{ fontWeight: 800, margin: '20px 0 10px' }}>Die Crew</h3>
        <div class="card" style={{ background: 'rgba(255,255,255,.1)', color: '#fff', boxShadow: 'none' }}>
          {MEMBERS.map(m => {
            const st = STATI.find(s => s[0] === (sh.status[m.id] || 'club'))
            return (
              <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '7px 0' }}>
                <Avatar id={m.id} />
                <span style={{ flex: 1, fontWeight: 700, fontSize: '.92rem' }}>{m.name}</span>
                <span class={`tag ${st[0] === 'home' ? 'green' : st[0] === 'club' ? 'violet' : 'orange'}`}>
                  <Icon name={st[2]} size={12} />{st[1]}
                </span>
              </div>
            )
          })}
        </div>

        <div class="card" style={{
          marginTop: 14, textAlign: 'center', fontWeight: 800, boxShadow: 'none',
          background: allHome ? 'var(--green)' : 'rgba(255,255,255,.08)',
          color: allHome ? '#fff' : 'rgba(255,255,255,.6)',
        }}>
          <Icon name={allHome ? 'check' : 'clock'} size={20} />
          <div style={{ marginTop: 4 }}>{allHome ? 'Alle sicher angekommen! 🏠' : `${MEMBERS.filter(m => sh.status[m.id] === 'home').length}/7 angekommen`}</div>
          {allHome && (
            <button class="btn white sm" style={{ marginTop: 10, background: 'rgba(255,255,255,.2)' }} onClick={() => {
              update(safehome, 'safehome', s => { s.status = {}; s.cars = { 1: [], 2: [] }; return s })
              toast('Für die nächste Nacht zurückgesetzt')
            }}>Für nächste Nacht zurücksetzen</button>
          )}
        </div>
        <p class="hint" style={{ color: 'rgba(255,255,255,.6)', textAlign: 'center', marginTop: 14 }}>
          Nur zur Koordination der Gruppe – ersetzt keine echte Notfallhilfe. Notruf in Kroatien: 112.
        </p>
      </div>
    </div>
  )
}
