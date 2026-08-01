// Illustrations-System: Adria-Szenen im Travel-Poster-Stil.
// Jede Szene ist ein selbstständiges SVG (offline, 0 KB Netzwerk) und wird
// als Hintergrund von Hero-Karten, Tages-Thumbnails und Bannern benutzt.

const W = 440, H = 240

const wave = (y, amp = 9) => {
  let d = `M0 ${y}`
  for (let x = 0; x < W + 40; x += 50) d += ` Q ${x + 12.5} ${y - amp} ${x + 25} ${y} T ${x + 50} ${y}`
  return d + ` V${H} H0 Z`
}

const Sky = ({ id, stops }) => (
  <>
    <defs>
      <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
        {stops.map(([o, c]) => <stop offset={o} stop-color={c} />)}
      </linearGradient>
    </defs>
    <rect width={W} height={H} fill={`url(#${id})`} />
  </>
)

const Sun = ({ x = 330, y = 70, r = 30, color = '#FFC857' }) => (
  <g class="sun">
    <circle cx={x} cy={y} r={r * 2.1} fill={color} opacity=".14" />
    <circle cx={x} cy={y} r={r * 1.45} fill={color} opacity=".22" />
    <circle cx={x} cy={y} r={r} fill={color} />
  </g>
)

const Moon = ({ x = 330, y = 62 }) => (
  <g>
    <circle cx={x} cy={y} r="46" fill="#FFF6D8" opacity=".1" />
    <circle cx={x} cy={y} r="24" fill="#FFF6D8" />
    <circle cx={x - 10} cy={y - 6} r="21" fill="#221A4E" opacity=".92" />
  </g>
)

const Stars = () => (
  <g fill="#FFF6D8">
    {[[30, 34, 1.6], [80, 70, 1.1], [140, 30, 1.4], [200, 58, 1], [255, 26, 1.7], [300, 96, 1], [385, 40, 1.3], [55, 108, 1], [165, 92, 1.2], [412, 90, 1.1]]
      .map(([x, y, r]) => <circle cx={x} cy={y} r={r} opacity=".9" />)}
  </g>
)

const Clouds = ({ tint = '#FFFFFF', op = .5 }) => (
  <g fill={tint} opacity={op}>
    <ellipse cx="90" cy="52" rx="42" ry="11" />
    <ellipse cx="120" cy="44" rx="26" ry="9" />
    <ellipse cx="250" cy="88" rx="34" ry="8" opacity=".7" />
  </g>
)

// Split-Silhouette: Glockenturm des Diokletianpalasts + Altstadt-Blöcke
const Skyline = ({ y = 148, color = '#0A3D5C', op = .55 }) => (
  <g fill={color} opacity={op}>
    <path d={`M0 ${y + 22} h28 v-14 h16 v14 h22 v-24 h20 v24 h26 v-12 h18 v12 h30 v-18 h24 v18 h22 v-10 h20 v10 h26 v-26 h22 v26 h30 v-14 h20 v14 h26 v-20 h20 v20 h34 v-12 h18 v12 h18 V${H} H0 Z`} />
    <path d={`M196 ${y + 10} v-52 h4 l3 -12 3 12 h4 v52 Z`} />
    <rect x="199" y={y - 34} width="8" height="5" fill="#FFC857" opacity=".8" />
  </g>
)

const Hills = ({ y = 150, color = '#0A5E77', op = .5 }) => (
  <path d={`M0 ${y + 30} Q 90 ${y - 26} 190 ${y + 16} T 440 ${y + 4} V${H} H0 Z`} fill={color} opacity={op} />
)

const Sea = ({ y = 158, colors = ['#0E86A0', '#0A6B86', '#07566F'] }) => (
  <g class="sea">
    <path d={wave(y)} fill={colors[0]} />
    <path d={wave(y + 22, 7)} fill={colors[1]} />
    <path d={wave(y + 46, 6)} fill={colors[2]} />
  </g>
)

const Glitter = ({ y = 170, color = '#FFC857' }) => (
  <g stroke={color} stroke-width="2.5" stroke-linecap="round" opacity=".55">
    <path d={`M300 ${y} h26 M318 ${y + 14} h34 M290 ${y + 27} h22 M330 ${y + 40} h26`} />
  </g>
)

// Äußeres g trägt die Position (Attribut), inneres g die CSS-Animation –
// sonst überschreibt die animierte CSS-Transform das transform-Attribut.
const Boat = ({ x = 120, y = 158, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <g class="boat">
      <path d="M2 0 L2 -62 L-42 0 Z" fill="#FFFFFF" opacity=".95" />
      <path d="M10 0 L10 -46 L40 0 Z" fill="#F2E8D8" opacity=".9" />
      <path d="M2 -62 L2 0" stroke="#0A3D5C" stroke-width="3" />
      <path d="M-52 8 Q0 24 52 8 L42 22 Q0 32 -42 22 Z" fill="#0A3D5C" />
    </g>
  </g>
)

const Palm = ({ x = 52, y = 190, s = 1, color = '#08425C' }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} fill="none" stroke={color} stroke-linecap="round">
    <path d="M0 0 C 4 -28 2 -46 8 -62" stroke-width="7" />
    <g stroke-width="5">
      <path d="M8 -62 C 26 -74 44 -74 56 -64" />
      <path d="M8 -62 C 24 -58 40 -50 46 -38" />
      <path d="M8 -62 C -8 -76 -28 -78 -42 -70" />
      <path d="M8 -62 C -10 -60 -26 -52 -32 -40" />
      <path d="M8 -62 C 10 -78 20 -88 34 -90" />
    </g>
  </g>
)

const Plane = ({ x = 150, y = 84, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-52 6 h30" stroke="#FFFFFF" stroke-width="4" stroke-linecap="round" opacity=".65" />
    <path d="M-70 6 h10" stroke="#FFFFFF" stroke-width="4" stroke-linecap="round" opacity=".4" />
    <path d="M0 0 l46 6 -8 8 -38 -4 -22 16 -10 -2 14 -16 -14 -6 6 -6 20 4 12 -10 8 2 -6 8 Z" fill="#0A3D5C" opacity=".9" />
  </g>
)

const Scooter = ({ x = 300, y = 196 }) => (
  <g transform={`translate(${x} ${y})`} fill="none" stroke="#08425C" stroke-width="5" stroke-linecap="round">
    <circle cx="-26" cy="0" r="13" />
    <circle cx="26" cy="0" r="13" />
    <path d="M-26 0 L-8 -2 L2 -22 L18 -22 M14 -22 L26 0 M-8 -2 L-2 -26 L-14 -30" />
  </g>
)

const Awning = () => (
  <g>
    <rect x="120" y="96" width="200" height="12" fill="#0A3D5C" />
    <g>
      {Array.from({ length: 8 }, (_, i) => (
        <path d={`M${120 + i * 25} 108 a12.5 12 0 0 0 25 0 Z`} fill={i % 2 ? '#FF6B4A' : '#F7EDDD'} />
      ))}
    </g>
    <rect x="132" y="120" width="176" height="52" fill="#0A3D5C" opacity=".8" rx="4" />
    <g fill="#F5A623"><circle cx="160" cy="146" r="7" /><circle cx="176" cy="150" r="7" /><circle cx="167" cy="158" r="7" /></g>
    <g fill="#FF6B4A"><circle cx="230" cy="148" r="7" /><circle cx="246" cy="152" r="7" /><circle cx="238" cy="160" r="7" /></g>
    <g fill="#7FC479"><circle cx="292" cy="146" r="6" /><circle cx="304" cy="152" r="6" /><circle cx="296" cy="158" r="6" /></g>
  </g>
)

const House = ({ x = 210, y = 168 }) => (
  <g transform={`translate(${x} ${y})`}>
    <rect x="-52" y="-44" width="104" height="44" fill="#F7EDDD" />
    <path d="M-62 -44 L0 -86 L62 -44 Z" fill="#C2571B" />
    <rect x="-14" y="-26" width="28" height="26" fill="#0A3D5C" />
    <rect x="-40" y="-32" width="16" height="14" fill="#7FC4D4" />
    <rect x="24" y="-32" width="16" height="14" fill="#7FC4D4" />
  </g>
)

const SCENES = {
  beach: () => (
    <>
      <Sky id="g-beach" stops={[[0, '#8FD8E8'], [.6, '#D9F2F6'], [1, '#F6EEDC']]} />
      <Sun x={330} y={64} />
      <Clouds />
      <Hills y={140} color="#0A6B86" op={.35} />
      <Sea y={156} colors={['#12A0B5', '#0E86A0', '#0A6B86']} />
      <Palm />
    </>
  ),
  boat: () => (
    <>
      <Sky id="g-boat" stops={[[0, '#6FCBE0'], [.55, '#C8ECF2'], [1, '#E9F6F4']]} />
      <Sun x={352} y={58} r={26} />
      <Clouds />
      <Hills y={126} color="#0A6B86" op={.3} />
      <Sea y={148} colors={['#12A0B5', '#0E86A0', '#07566F']} />
      <Boat x={150} y={166} />
      <Boat x={330} y={182} s={.5} />
    </>
  ),
  city: () => (
    <>
      <Sky id="g-city" stops={[[0, '#FFD9A0'], [.5, '#FFB377'], [1, '#FF8F66']]} />
      <Sun x={310} y={92} r={34} color="#FFE3A3" />
      <Skyline y={130} />
      <Sea y={172} colors={['#0E86A0', '#0A5E77', '#083D54']} />
      <Glitter y={182} color="#FFE3A3" />
    </>
  ),
  night: () => (
    <>
      <Sky id="g-night" stops={[[0, '#191243'], [.6, '#2A1B5E'], [1, '#4A2B85']]} />
      <Stars />
      <Moon />
      <Skyline y={140} color="#120C33" op={.9} />
      <g fill="#FFC857">{[[52, 152], [96, 158], [150, 148], [246, 154], [300, 150], [352, 158], [390, 150]].map(([x, y]) => <rect x={x} y={y} width="6" height="5" opacity=".85" />)}</g>
      <Sea y={176} colors={['#3A2478', '#2C1B60', '#221448']} />
      <path d={`M318 178 h24 M310 192 h40 M320 206 h22`} stroke="#FFF6D8" stroke-width="3" stroke-linecap="round" opacity=".4" />
    </>
  ),
  sunset: () => (
    <>
      <Sky id="g-sunset" stops={[[0, '#FFC77D'], [.45, '#FF9A5C'], [.8, '#F0685C'], [1, '#B84A6E']]} />
      <Sun x={220} y={128} r={40} color="#FFE3A3" />
      <Hills y={132} color="#5B2E5C" op={.55} />
      <Sea y={158} colors={['#8A3E6E', '#5B2E5C', '#3A2050']} />
      <Boat x={340} y={176} s={.55} />
    </>
  ),
  plane: () => (
    <>
      <Sky id="g-plane" stops={[[0, '#5FB9D6'], [.6, '#A8DEEA'], [1, '#DFF2F4']]} />
      <Sun x={392} y={42} r={22} />
      <g fill="#FFFFFF" opacity=".75">
        <ellipse cx="300" cy="34" rx="30" ry="8" />
        <ellipse cx="340" cy="88" rx="22" ry="6" opacity=".6" />
      </g>
      <Plane x={302} y={58} s={.85} />
      <Hills y={168} color="#0A6B86" op={.35} />
      <Sea y={188} colors={['#12A0B5', '#0E86A0', '#0A6B86']} />
    </>
  ),
  coast: () => (
    <>
      <Sky id="g-coast" stops={[[0, '#8FD8E8'], [.6, '#DDF3F6'], [1, '#F6EEDC']]} />
      <Sun x={92} y={58} r={26} />
      <Hills y={120} color="#0A6B86" op={.3} />
      <Sea y={142} colors={['#12A0B5', '#0E86A0', '#0A6B86']} />
      <path d={`M0 214 Q 120 186 250 200 T 440 190 V${H} H0 Z`} fill="#E8D9BC" />
      <Scooter x={290} y={198} />
      <Palm x={70} y={206} s={.8} />
    </>
  ),
  market: () => (
    <>
      <Sky id="g-market" stops={[[0, '#8FD8E8'], [.7, '#E4F4F0'], [1, '#F6EEDC']]} />
      <Sun x={64} y={54} r={24} />
      <Awning />
      <path d={`M0 196 H440 V${H} H0 Z`} fill="#E8D9BC" />
    </>
  ),
  home: () => (
    <>
      <Sky id="g-home" stops={[[0, '#FFD9A0'], [.55, '#FFB377'], [1, '#FF9A6B']]} />
      <Sun x={80} y={66} r={28} color="#FFE3A3" />
      <Hills y={128} color="#5B2E5C" op={.4} />
      <House />
      <path d={`M0 196 H440 V${H} H0 Z`} fill="#B87A4B" opacity=".55" />
      <Palm x={330} y={200} s={.9} color="#5B2E5C" />
    </>
  ),
}

export function Scene({ kind = 'beach', class: cls = '' }) {
  const S = SCENES[kind] || SCENES.beach
  return (
    <svg class={`scene ${cls}`} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <S />
    </svg>
  )
}

// Mapping von Plan-Icons und Orts-Kategorien auf Szenen
export const sceneForIcon = { plane: 'plane', moon: 'night', sun: 'beach', boat: 'boat', bike: 'coast' }
export const sceneForPlaceCat = {
  unterkunft: 'home', einkaufen: 'market', strand: 'beach', sehen: 'city',
  nightlife: 'night', ausflug: 'boat', transport: 'coast',
}
