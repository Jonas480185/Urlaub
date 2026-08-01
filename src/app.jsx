import { Icon } from './icons.jsx'
import { tab, sheet, toastMsg, profile } from './store.js'
import { Heute } from './views/heute.jsx'
import { Plan, DaySheet } from './views/plan.jsx'
import { Einkaufen, ShopItemSheet } from './views/einkaufen.jsx'
import { Ausgaben, ExpenseSheet } from './views/ausgaben.jsx'
import { Orte, PlaceSheet } from './views/orte.jsx'
import { SafeHome } from './views/safehome.jsx'
import { Onboarding } from './views/onboarding.jsx'
import { ProfileSheet } from './views/profil.jsx'

const TABS = [
  ['heute', 'Heute', 'sun'],
  ['plan', 'Plan', 'calendar'],
  ['einkaufen', 'Einkaufen', 'cart'],
  ['ausgaben', 'Ausgaben', 'euro'],
  ['orte', 'Orte', 'pin'],
]

export function App() {
  if (!profile.value.memberId) return <Onboarding />
  const t = tab.value
  const s = sheet.value

  return (
    <>
      {t === 'heute' && <Heute />}
      {t === 'plan' && <Plan />}
      {t === 'einkaufen' && <Einkaufen />}
      {t === 'ausgaben' && <Ausgaben />}
      {t === 'orte' && <Orte />}

      <nav class="bottomnav" aria-label="Hauptnavigation">
        {TABS.map(([id, label, icon]) => (
          <button key={id} class={`navitem ${t === id ? 'on' : ''}`} onClick={() => { tab.value = id; window.scrollTo(0, 0) }}
            aria-current={t === id ? 'page' : undefined}>
            <span class="navdot"><Icon name={icon} size={21} /></span>
            {label}
          </button>
        ))}
      </nav>

      {s?.type === 'profile' && <ProfileSheet />}
      {s?.type === 'expense' && <ExpenseSheet />}
      {s?.type === 'day' && <DaySheet date={s.date} />}
      {s?.type === 'shopitem' && <ShopItemSheet id={s.id} />}
      {s?.type === 'place' && <PlaceSheet id={s.id} />}
      {s?.type === 'safehome' && <SafeHome />}

      {toastMsg.value && <div class="toast" role="status">{toastMsg.value}</div>}
    </>
  )
}
