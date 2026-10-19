// Forza Karate Club stances, for the public syllabus page (/syllabus/stances).
// Names and English labels: Anthoni, 19 Oct 2026 (final). Key points come from the Dojo Dash
// stance trainer (/home/box/shared/dojo-dash/preview/training/stance.html) with Club Operations'
// syllabus review applied. Items listed in `toCheck` are still to be confirmed by Club Operations.
// Figures are the same drawings as the Dojo Dash stance trainer, in Forza colours.

type Pt = [number, number]
/** Top-view footprint: [x, y, angleDeg, tiptoe?] */
type Foot = [number, number, number, number?]

export type Stance = {
  id: string
  japanese: string
  english: string
  /** One-line summary shown under the name. */
  summary: string
  group: 'beginner' | 'next' | 'yellow'
  /** Kid-friendly "how to stand" steps: feet, width/length, toes, knees, weight. */
  howTo: string[]
  mistake: string
  /** Details not yet confirmed by Club Operations (kept out of the public text). */
  toCheck?: string
  // Figure data (same as the Dojo Dash trainer)
  view: 'front' | 'side'
  arms?: 'down' | 'fists'
  hip: Pt
  legs: [Pt, Pt, Pt][]
  feet: Foot[]
  toeOut?: number
  tiptoe?: boolean
}

export const STANCES: Stance[] = [
  {
    id: 'heisoku', japanese: 'Heisoku dachi', english: 'Informal stance', summary: 'Feet together', group: 'beginner',
    howTo: [
      'Put your feet together, so your heels and toes touch.',
      'Legs straight but not locked. Stand tall.',
      'Arms down by your sides.',
      'Weight even on both feet.',
    ],
    mistake: 'Leaving a gap between your feet, or slouching. Heels and toes should touch, and you should stand up tall.',
    view: 'front', arms: 'down', hip: [120, 166],
    legs: [[[114, 166], [116, 216], [116, 266]], [[126, 166], [124, 216], [124, 266]]],
    feet: [[111, 58, 0], [129, 58, 0]],
  },
  {
    id: 'musubi', japanese: 'Musubi dachi', english: 'Attention stance', summary: 'Heels together, toes apart', group: 'beginner',
    howTo: [
      'Keep your heels together.',
      'Open your toes apart, so your feet make a V shape.',
      'Stand tall, arms down by your sides.',
      'Weight even on both feet.',
    ],
    mistake: 'Letting your heels drift apart. Only your toes open; your heels stay touching.',
    view: 'front', arms: 'down', hip: [120, 166], toeOut: 28,
    legs: [[[112, 166], [114, 216], [116, 266]], [[128, 166], [126, 216], [124, 266]]],
    feet: [[110, 58, -28], [130, 58, 28]],
  },
  {
    id: 'fudo', japanese: 'Fudo dachi', english: 'Ready stance', summary: 'Feet apart, fists by your sides', group: 'beginner',
    howTo: [
      'Step your feet apart, about shoulder-width.',
      'Make fists and rest them by your sides.',
      'Knees soft, back straight, eyes forward.',
      'Weight even on both feet.',
    ],
    mistake: 'Feet too wide or too close together. Aim for about the width of your shoulders, ready to move.',
    toCheck: 'Toe angle not specified by Anthoni (figure drawn with toes forwards).',
    view: 'front', arms: 'fists', hip: [120, 168],
    legs: [[[108, 168], [104, 218], [100, 266]], [[132, 168], [136, 218], [140, 266]]],
    feet: [[95, 55, 0], [145, 55, 0]],
  },
  {
    id: 'shiko', japanese: 'Shiko dachi', english: 'Sumo stance', summary: 'Squat with your feet wide', group: 'beginner',
    howTo: [
      'Step your feet wide apart.',
      'Turn your toes out at 45°.',
      'Squat down: knees bent and pushed out over your toes.',
      'Keep your heels flat and your back straight.',
      'Weight even on both feet.',
    ],
    mistake: 'Letting your knees fall inwards or your heels lift. Push your knees out over your toes and keep your heels flat.',
    view: 'front', arms: 'fists', hip: [120, 204], toeOut: 45,
    legs: [[[106, 204], [60, 226], [58, 266]], [[134, 204], [180, 226], [182, 266]]],
    feet: [[55, 55, -45], [185, 55, 45]],
  },
  {
    id: 'kiba', japanese: 'Kiba dachi', english: 'Horse riding stance', summary: 'As wide as shiko dachi, toes pointing forwards', group: 'beginner',
    howTo: [
      'Feet as wide as shiko dachi (sumo stance).',
      'Point your toes forwards, so the outside edges of your feet are parallel.',
      'Bend your knees and push them out, as if you are riding a horse.',
      'Back straight. Weight even on both feet.',
    ],
    mistake: 'Letting your toes turn out. That makes it sumo stance. In horse riding stance your toes point forwards.',
    view: 'front', arms: 'fists', hip: [120, 200],
    legs: [[[106, 200], [62, 226], [58, 266]], [[134, 200], [178, 226], [182, 266]]],
    feet: [[55, 55, 0], [185, 55, 0]],
  },
  {
    id: 'neko', japanese: 'Shomen neko ashi dachi', english: 'Cat stance', summary: 'Front-facing cat stance', group: 'next',
    howTo: [
      'Hips facing the front.',
      'A short stance with both knees bent.',
      'Back foot turned out at about 45°.',
      'Lift your front heel so only the ball of your foot touches the floor, light like a cat’s paw.',
      'Most of your weight is on your back leg, so your front leg can lift or turn easily.',
    ],
    mistake: 'Putting weight on the front foot or letting the front heel drop. Sit back on your back leg and keep the front foot light.',
    toCheck: 'Exact weight split pending Anthoni (2/3–1/3, 70/30 or 80/20); the page only says "most of your weight on your back leg".',
    view: 'side', hip: [100, 182], tiptoe: true,
    legs: [[[96, 182], [124, 224], [94, 266]], [[104, 182], [142, 222], [150, 262]]],
    feet: [[100, 75, -45], [112, 30, 0, 1]],
  },
  {
    id: 'zenkutsu', japanese: 'Zenkutsu dachi', english: 'Forward leaning stance', summary: 'Front knee bent, back leg nearly straight', group: 'next',
    howTo: [
      'Step one foot forwards.',
      'Bend your front knee so it is over your toes.',
      'Back leg nearly straight, back heel down.',
      'Front foot points forwards, back foot points diagonally forwards.',
      'A little more weight on your front leg.',
    ],
    mistake: 'Lifting the back heel, or bending the front knee so far it goes past your toes. Keep the back heel down and the knee over the toes.',
    toCheck: 'Length and weight split not specified by Anthoni (trainer uses about 60 front / 40 back; page says "a little more weight on your front leg").',
    view: 'side', hip: [118, 190],
    legs: [[[112, 190], [80, 228], [50, 266]], [[124, 190], [188, 222], [190, 266]]],
    feet: [[95, 88, -25], [140, 22, 0]],
  },
  {
    id: 'junzuki', japanese: 'Junzuki dachi', english: 'Lead-hand punch stance', summary: 'A variation of zenkutsu dachi', group: 'yellow',
    howTo: [
      'This is the stance for a lead-hand (same-side) punch: you punch with the hand on the same side as your front leg.',
      'About as long as zenkutsu dachi, but natural, not as long and low as some other styles.',
      'Front knee bent over the toes, back leg nearly straight.',
      'Hips more square to the front.',
    ],
    mistake: 'Making the stance so long and low that you can’t move quickly. Keep it natural so you can step and punch.',
    toCheck: 'Weight split (about 60/40) and foot angles; the common mistake was written by Web Developer and is not in the source files.',
    view: 'side', hip: [122, 184],
    legs: [[[116, 184], [86, 224], [62, 266]], [[128, 184], [176, 222], [180, 266]]],
    feet: [[100, 84, -25], [140, 26, 0]],
  },
  {
    id: 'gyakuzuki', japanese: 'Gyakuzuki dachi', english: 'Reverse punch stance', summary: 'A variation of zenkutsu dachi', group: 'yellow',
    howTo: [
      'This is the stance for a reverse punch: you punch with the hand on the opposite side to your front leg.',
      'A little shorter and wider than junzuki dachi.',
      'Hips turned, half-facing the front.',
      'Front knee bent over the toes.',
    ],
    mistake: 'Standing with your feet on one line, like on a tightrope. Keep a little width between your feet so you stay balanced when your hips turn.',
    toCheck: 'Exact length, width and weight split; the common mistake was written by Web Developer and is not in the source files.',
    view: 'side', hip: [120, 188],
    legs: [[[114, 188], [90, 226], [70, 266]], [[126, 188], [168, 222], [172, 266]]],
    feet: [[88, 80, -30], [150, 28, 0]],
  },
]

// ---- Figure drawing (ported from the Dojo Dash stance trainer) ----
const INK = '#1a1a1a'
const SKIN = '#ffcc80'
const GI = '#fdfdfd'
const RED = '#dc2626'
const GREEN = '#15803d'

function limb(p: Pt[], w: number) {
  const d = 'M' + p.map((q) => q.join(',')).join(' L')
  return `<path d="${d}" stroke="${INK}" stroke-width="${w + 6}" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" stroke="${GI}" stroke-width="${w}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`
}

function sideFoot(a: Pt, tip: boolean) {
  const [x, y] = a
  if (tip)
    return `<path d="M${x - 4},${y + 2} L${x + 18},${y + 10}" stroke="${INK}" stroke-width="12" stroke-linecap="round"/><path d="M${x - 4},${y + 2} L${x + 18},${y + 10}" stroke="${SKIN}" stroke-width="7" stroke-linecap="round"/>`
  return `<path d="M${x - 8},${y + 6} L${x + 20},${y + 6}" stroke="${INK}" stroke-width="13" stroke-linecap="round"/><path d="M${x - 8},${y + 6} L${x + 20},${y + 6}" stroke="${SKIN}" stroke-width="8" stroke-linecap="round"/>`
}

function frontFoot(a: Pt, ang: number) {
  const [x, y] = a
  const off = 16 * Math.sin((ang * Math.PI) / 180)
  return `<ellipse cx="${x + off / 2}" cy="${y + 6}" rx="${9 + Math.abs(off) / 2}" ry="7" fill="${SKIN}" stroke="${INK}" stroke-width="3"/>`
}

/** SVG markup for one stance figure with its top-view footprint panel. Static data only. */
export function stanceFigureSvg(s: Stance): string {
  const BELT = s.group === 'beginner' ? '#ffffff' : s.group === 'yellow' ? '#facc15' : '#f97316'
  const h = s.hip
  const side = s.view === 'side'
  const sh: Pt = [h[0] + (side ? 6 : 0), h[1] - 78]
  let o = ''
  o += `<rect x="0" y="0" width="240" height="300" fill="#fafaf9"/><path d="M0,272 H240" stroke="#a8a29e" stroke-width="4"/>`
  o += `<text x="120" y="22" text-anchor="middle" font-size="11" fill="${RED}" font-weight="bold" font-family="system-ui,sans-serif">FORZA KARATE CLUB</text>`
  const fistY = sh[1] - 4
  if (side) o += limb([[sh[0] - 2, sh[1] + 6], [sh[0] + 16, sh[1] + 40], [sh[0] + 30, fistY + 4]], 13)
  s.legs.forEach((L) => { o += limb(L, 17) })
  s.legs.forEach((L, i) => {
    const a = L[2]
    if (side) o += sideFoot(a, !!s.tiptoe && i === 1)
    else o += frontFoot(a, (s.toeOut || 0) * (i ? 1 : -1))
  })
  const tw = side ? 30 : 46
  o += `<path d="M${sh[0] - tw / 2},${sh[1]} L${sh[0] + tw / 2},${sh[1]} L${h[0] + tw / 2 + 2},${h[1] + 8} L${h[0] - tw / 2 - 2},${h[1] + 8} Z" fill="${GI}" stroke="${INK}" stroke-width="3.5" stroke-linejoin="round"/>`
  o += `<path d="M${sh[0] - 8},${sh[1]} L${sh[0] + (side ? 8 : 0)},${sh[1] + 34}${side ? '' : ` L${sh[0] + 8},${sh[1]}`}" stroke="${INK}" stroke-width="2.5" fill="none"/>`
  o += `<rect x="${h[0] - tw / 2 - 3}" y="${h[1] - 10}" width="${tw + 6}" height="9" fill="${BELT}" stroke="${INK}" stroke-width="2.5"/>`
  const kx = side ? h[0] + tw / 2 - 2 : h[0]
  o += `<rect x="${kx - 5}" y="${h[1] - 12}" width="10" height="12" rx="2" fill="${BELT}" stroke="${INK}" stroke-width="2.5"/><path d="M${kx - 2},${h[1]} l-6,20 M${kx + 2},${h[1]} l6,19" stroke="${INK}" stroke-width="7" stroke-linecap="round"/><path d="M${kx - 2},${h[1]} l-6,20 M${kx + 2},${h[1]} l6,19" stroke="${BELT}" stroke-width="3.5" stroke-linecap="round"/>`
  if (side) {
    o += limb([[sh[0] + 2, sh[1] + 6], [sh[0] + 20, sh[1] + 42], [sh[0] + 40, fistY]], 13)
    o += `<circle cx="${sh[0] + 42}" cy="${fistY}" r="8" fill="${SKIN}" stroke="${INK}" stroke-width="3"/><circle cx="${sh[0] + 32}" cy="${fistY + 5}" r="7" fill="${SKIN}" stroke="${INK}" stroke-width="3"/>`
  } else if (s.arms) {
    for (const d of [-1, 1]) {
      const sx = sh[0] + d * 22
      const fx = sx + d * (s.arms === 'down' ? 4 : 6)
      const fy = sh[1] + 80
      o += limb([[sx, sh[1] + 6], [sx + d * 4, sh[1] + 42], [fx, fy - 6]], 13)
      o += s.arms === 'fists'
        ? `<circle cx="${fx}" cy="${fy}" r="8" fill="${SKIN}" stroke="${INK}" stroke-width="3"/>`
        : `<ellipse cx="${fx}" cy="${fy + 2}" rx="6" ry="10" fill="${SKIN}" stroke="${INK}" stroke-width="3"/>`
    }
  }
  const hx = sh[0] + (side ? 4 : 0)
  const hy = sh[1] - 24
  o += `<circle cx="${hx}" cy="${hy}" r="19" fill="${SKIN}" stroke="${INK}" stroke-width="3.5"/>`
  o += `<path d="M${hx - 20},${hy - 2} Q${hx - 14},${hy - 30} ${hx},${hy - 22} Q${hx + 16},${hy - 32} ${hx + 20},${hy - 2} L${hx + 12},${hy - 12} L${hx + 4},${hy - 6} L${hx - 4},${hy - 12} L${hx - 12},${hy - 6} Z" fill="${INK}"/>`
  o += `<rect x="${hx - 19}" y="${hy - 12}" width="38" height="5" fill="${RED}"/>`
  if (side) o += `<circle cx="${hx + 10}" cy="${hy + 2}" r="2.6" fill="${INK}"/><path d="M${hx + 6},${hy + 11} h7" stroke="${INK}" stroke-width="2"/>`
  else o += `<circle cx="${hx - 7}" cy="${hy + 2}" r="2.6" fill="${INK}"/><circle cx="${hx + 7}" cy="${hy + 2}" r="2.6" fill="${INK}"/><path d="M${hx - 5},${hy + 11} q5,4 10,0" stroke="${INK}" stroke-width="2" fill="none"/>`
  // Key-point marks
  const label = (x: number, y: number, t: string, anchor = 'middle') =>
    `<text x="${x}" y="${y}" font-size="11" fill="${GREEN}" text-anchor="${anchor}" font-weight="bold" font-family="system-ui,sans-serif">${t}</text>`
  if (s.id === 'zenkutsu' || s.id === 'junzuki') {
    const k = s.legs[1][1]
    o += `<path d="M${k[0]},${k[1] - 16} V270" stroke="${GREEN}" stroke-width="2.5" stroke-dasharray="5 4"/>` + label(Math.min(k[0], 200), 288, 'knee over toes')
  }
  if (s.id === 'neko') o += label(168, 250, 'heel up', 'start')
  if (s.id === 'kiba' || s.id === 'shiko')
    o += `<path d="M20,${h[1] + 4} H220" stroke="${GREEN}" stroke-width="2" stroke-dasharray="5 4"/>` + label(120, h[1] + 60, 'hips low · knees out')
  if (s.id === 'shiko') o += label(120, 290, 'heels flat')
  // Footprint panel (top view, forwards = up)
  o += `<g transform="translate(0,300)"><rect x="4" y="4" width="232" height="108" rx="12" fill="#f5f5f4" stroke="${INK}" stroke-width="3"/><path d="M120,12 V104" stroke="#a8a29e" stroke-dasharray="4 4"/><text x="226" y="22" font-size="10" text-anchor="end" fill="#57534e" font-family="system-ui,sans-serif">▲ front</text>`
  s.feet.forEach((f, i) => {
    const left = f[0] < 120 || i === 0
    o += `<g transform="translate(${f[0]},${f[1]}) rotate(${f[2]})"><ellipse cx="0" cy="0" rx="10" ry="20" fill="${f[3] ? '#fff' : SKIN}" stroke="${INK}" stroke-width="2.5"${f[3] ? ' stroke-dasharray="4 3"' : ''}/><circle cx="${left ? 5 : -5}" cy="-24" r="4.5" fill="${SKIN}" stroke="${INK}" stroke-width="2"/></g>`
  })
  o += '</g>'
  return `<svg viewBox="0 0 240 416" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${s.japanese} (${s.english}): figure and footprints">${o}</svg>`
}
