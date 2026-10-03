// Store catalogue (static, server-side source of truth for prices).
//
// Sources:
//   NEW  = the new site's /shop page (app/shop/page.tsx before the store was built)
//   OLD  = the old WordPress/Ecwid shop at forzakarate.co.uk/shop (checked 3 Oct 2026)
//
// Where NEW and OLD disagree, the NEW price is used and the line is marked
// "PRICE CONFLICT" so Anthoni can review it. Search this file for
// "PRICE CONFLICT" to find them all.
//
// All prices are in pence (£35.00 = 3500) and include any VAT.

import { BELTS } from '@/lib/belts'
import type { OptionValue, StoreProduct } from './types'

const ORDER_IN = 'Usually ready to collect within 3–4 weeks' // OLD site: "It can take up to 3-4 weeks."

const sizes = (list: string[]): OptionValue[] => list.map(value => ({ value }))
const XS_XL = sizes(['XS', 'S', 'M', 'L', 'XL'])
const HEIGHT_SIZE_HELP = 'Sized by height. If between sizes, go up.'

export const STORE_PRODUCTS: StoreProduct[] = [
  // ─── Uniforms ──────────────────────────────────────────────────────────────
  {
    slug: 'forza-club-gi',
    name: 'Forza Karate Club Gi',
    category: 'uniforms',
    summary: 'The official Forza club uniform, required for all students.',
    description: [
      'Every student must wear the official Forza Karate Club uniform.',
      'Our club gi is sized by height. If you are between sizes, go up.',
    ],
    image: '/store-products/forza-gi-student.jpg',
    // PRICE CONFLICT: NEW £35.00 flat ("Forza Karate Student Gi").
    // OLD "2020ForzaKarateGi" was £40.00 for 100–140cm, +£5 for 150–170cm,
    // +£6 for 180cm and +£7 for 190–210cm, and went up to 210cm.
    // Using NEW (£35, 100–190cm, no size uplift).
    price: 3500,
    options: [
      { key: 'size', label: 'Size', help: HEIGHT_SIZE_HELP,
        values: sizes(['100cm', '110cm', '120cm', '130cm', '140cm', '150cm', '160cm', '170cm', '180cm', '190cm']) },
    ],
    availability: 'order-in',
    leadTime: ORDER_IN,
    availableOnline: true,
    sizeGuide: HEIGHT_SIZE_HELP,
  },
  {
    slug: 'blitz-gi',
    name: 'Blitz Karate Gi',
    category: 'uniforms',
    summary: 'Blitz student karate suit.',
    description: [
      'A comfortable student karate suit from Blitz.',
      'Sized by height. If you are between sizes, go up.',
    ],
    image: '/store-products/blitz-gi.jpg',
    // NEW £40.00. The enrolment form (/join/enrol) also sells this gi at £40
    // but offers 90cm and 200cm as well; NEW shop sizes (100–190cm) used here.
    price: 4000,
    options: [
      { key: 'size', label: 'Size', help: HEIGHT_SIZE_HELP,
        values: sizes(['100cm', '110cm', '120cm', '130cm', '140cm', '150cm', '160cm', '170cm', '180cm', '190cm']) },
    ],
    availability: 'order-in',
    leadTime: ORDER_IN,
    availableOnline: true,
    sizeGuide: HEIGHT_SIZE_HELP,
  },
  {
    slug: 'wkf-sport-kumite-gi',
    name: 'WKF Approved Sport Kumite Gi',
    category: 'uniforms',
    summary: 'Lightweight WKF approved competition kumite gi.',
    description: [
      'As used by sport karate athletes, embroidered with the Forza Karate logo.',
      'Ventilated areas, three-section gusset and trousers with an elastic and tie waist. 100% polyester.',
    ],
    image: '/store-products/sport-kumite-gi.jpg',
    badge: 'WKF Approved',
    // PRICE CONFLICT: NEW £136.00 (170–200cm, all sizes the same price).
    // OLD "Sport Karate Gi" was £78.50 for 110–150cm and £92.50 (+£14) for 160–200cm.
    // Using NEW.
    price: 13600,
    options: [
      { key: 'size', label: 'Size', help: HEIGHT_SIZE_HELP, values: sizes(['170cm', '180cm', '190cm', '200cm']) },
    ],
    availability: 'order-in',
    leadTime: ORDER_IN,
    availableOnline: true,
    sizeGuide: HEIGHT_SIZE_HELP,
  },
  {
    slug: 'wkf-sport-kumite-gi-red-blue',
    name: 'WKF Approved Sport Kumite Gi: Red or Blue',
    category: 'uniforms',
    summary: 'Competition kumite gi with red or blue shoulders. Price varies by size.',
    description: [
      'WKF approved competition kumite gi with red or blue shoulders.',
      'Sized by height. Price varies by size.',
    ],
    image: '/store-products/sport-kumite-gi.jpg',
    badge: 'WKF Approved',
    // PRICE CONFLICT: NEW £135.00 for 120–150cm and £156.00 for 160–200cm.
    // OLD "Sport Karate Gi, Red or Blue Shoulder" was £115.00 (130–150cm) and
    // £129.00 (160–190cm). Using NEW.
    price: 13500,
    options: [
      { key: 'colour', label: 'Colour', values: sizes(['Red', 'Blue']) },
      { key: 'size', label: 'Size', help: HEIGHT_SIZE_HELP,
        values: [
          ...['120cm', '130cm', '140cm', '150cm'].map(value => ({ value, price: 13500 })),
          ...['160cm', '170cm', '180cm', '190cm', '200cm'].map(value => ({ value, price: 15600 })),
        ] },
    ],
    availability: 'order-in',
    leadTime: ORDER_IN,
    availableOnline: true,
    sizeGuide: HEIGHT_SIZE_HELP,
  },
  {
    slug: 'wkf-sport-kumite-gi-embroidered',
    name: 'WKF Approved Sport Kumite Gi: Embroidered Shoulders',
    category: 'uniforms',
    summary: 'Made to order with embroidered shoulders. Not available online.',
    description: [
      'Made to order with embroidered shoulders. Sized by height.',
      'This gi is not available to buy online. Please ask your instructor at class or send us a message.',
    ],
    image: '/store-products/sport-kumite-gi.jpg',
    badge: 'WKF Approved',
    price: 0, // NEW: "price on request". Not sold online.
    options: [
      { key: 'size', label: 'Size', values: sizes(['170cm', '180cm', '190cm', '200cm']) },
    ],
    availability: 'order-in',
    availableOnline: false,
    noCancellation: 'personalised',
  },
  {
    slug: 'kata-gi',
    name: 'Kata Gi (K Brand, Forza logo)',
    category: 'uniforms',
    summary: 'Heavyweight competition kata suit with the Forza Karate logo.',
    description: [
      'Heavyweight karate suit with the Forza Karate logo, designed by K Brand for a comfortable champion fit.',
      'Suitable for training and competition.',
    ],
    image: '/store-products/kata-gi.jpg',
    // OLD only (not on NEW): £90.00 for 130–150cm, +£5 for 160–190cm, +£8 for 200–210cm.
    // No conflict; please confirm this is still sold at these prices.
    price: 9000,
    options: [
      { key: 'size', label: 'Size', help: HEIGHT_SIZE_HELP,
        values: [
          ...['130cm', '140cm', '150cm'].map(value => ({ value })),
          ...['160cm', '170cm', '180cm', '190cm'].map(value => ({ value, extra: 500 })),
          ...['200cm', '210cm'].map(value => ({ value, extra: 800 })),
        ] },
    ],
    availability: 'order-in',
    leadTime: ORDER_IN,
    availableOnline: true,
    sizeGuide: HEIGHT_SIZE_HELP,
  },

  // ─── Sparring kit ──────────────────────────────────────────────────────────
  {
    slug: 'smai-wkf-shin-instep',
    name: 'SMAI WKF Shin & Instep Guards',
    category: 'sparring',
    summary: 'WKF approved shin and instep guards for kumite.',
    description: [
      'World Karate Federation approved shin and instep guards that absorb the knocks associated with kumite.',
      'Adjustable Velcro strap at the heel, with elastic straps on the sole and toes.',
    ],
    image: '/store-products/smai-shin-red.jpg',
    badge: 'WKF Approved',
    // PRICE CONFLICT: NEW £65.00 (red only). OLD £70.00 (red or blue).
    // Using NEW price; blue added from OLD. Please confirm both colours are stocked.
    price: 6500,
    options: [
      { key: 'colour', label: 'Colour', values: sizes(['Red', 'Blue']) },
      { key: 'size', label: 'Size', values: XS_XL },
    ],
    availability: 'order-in',
    leadTime: ORDER_IN,
    availableOnline: true,
  },
  {
    slug: 'blitz-shin-instep',
    name: 'Blitz Shin & Instep Guards',
    category: 'sparring',
    summary: 'Club shin and instep pads for training and club competitions.',
    description: [
      'Blitz shin and instep pads, suitable for club training and club competitions.',
    ],
    image: '/store-products/blitz-shin-blue.jpg',
    // PRICE CONFLICT: NEW £45.00 (blue, XS–XL). OLD £43.99 (red or blue, S–XL).
    // Using NEW price and sizes; red added from OLD. Please confirm.
    price: 4500,
    options: [
      { key: 'colour', label: 'Colour', values: sizes(['Blue', 'Red']) },
      { key: 'size', label: 'Size', values: XS_XL },
    ],
    availability: 'order-in',
    leadTime: ORDER_IN,
    availableOnline: true,
  },
  {
    slug: 'smai-wkf-mitts',
    name: 'SMAI WKF Kumite Mitts',
    category: 'sparring',
    summary: 'WKF approved kumite mitts, red and blue pair.',
    description: [
      'Approved by the World Karate Federation. Lightweight and comfortable, with a wide wrist strap to keep them in place.',
      'Premium synthetic leather.',
    ],
    image: '/store-products/smai-mitts.jpg',
    badge: 'WKF Approved',
    // NEW £45.00 for a red & blue pair (XS–XL). OLD also £45.00, but sold one
    // colour at a time (S–XL). Same price; NEW description kept. Please
    // confirm whether £45 buys a pair or a single colour.
    price: 4500,
    options: [
      { key: 'size', label: 'Size', values: XS_XL },
    ],
    availability: 'order-in',
    leadTime: ORDER_IN,
    availableOnline: true,
  },
  {
    slug: 'body-protector',
    name: 'Body Protector / Chest Guard',
    category: 'sparring',
    summary: 'Club body protector, or the WKF approved version for WKF events.',
    description: [
      'The club body protector is suitable for club training and sparring, club competitions, preparation training, inter-club training, the Forza Invitational, karate opens and association squad training. It is not suitable for WKF events.',
      'Choose the WKF approved version for WKF events.',
    ],
    image: '/store-products/chest-guard-white.jpg',
    price: 3500,
    options: [
      { key: 'type', label: 'Type',
        values: [
          // PRICE CONFLICT: NEW £35.00 "Chest Guard". OLD "Forza Official Body Protector" £45.00. Using NEW.
          { value: 'club', label: 'Club body protector', price: 3500 },
          // OLD only: the WKF version was £45 + £30 = £75.00. NEW has no WKF version. Please confirm.
          { value: 'wkf', label: 'WKF approved', price: 7500 },
        ] },
      { key: 'size', label: 'Size', values: XS_XL },
    ],
    availability: 'order-in',
    leadTime: ORDER_IN,
    availableOnline: true,
  },
  {
    slug: 'mouthguard',
    name: 'Mouthguard',
    category: 'sparring',
    summary: 'Club gum shield for training and competition.',
    description: [
      'Club gum shields, suitable for training and competition. Assorted colours.',
      'For hygiene reasons, mouthguards can’t be returned once unsealed (unless faulty).',
    ],
    image: '/store-products/mouthguards.jpg',
    price: 500, // NEW £5.00 = OLD £5.00
    options: [
      { key: 'size', label: 'Size', values: sizes(['Junior', 'Senior']) },
    ],
    availability: 'order-in',
    leadTime: ORDER_IN,
    availableOnline: true,
    noCancellation: 'hygiene',
  },

  // ─── Clothing ──────────────────────────────────────────────────────────────
  {
    slug: 'forza-t-shirt',
    name: 'Forza Karate T-Shirt',
    category: 'clothing',
    summary: 'Official club T-shirt in the club colours.',
    description: [
      'The official club T-shirt in the black and red colours of our club logo. Great for summer training, squad training or everyday wear.',
    ],
    image: '/store-products/forza-tshirt.jpg',
    // PRICE CONFLICT: NEW £20.00. OLD £12.99. Using NEW.
    // Colours are from OLD (NEW had no colour choice). OLD also had XS, XXL,
    // 9–11 and 12–13 years; NEW sizes kept.
    price: 2000,
    options: [
      { key: 'colour', label: 'Colour', values: sizes(['Black & Red', 'White & Red']) },
      { key: 'size', label: 'Size',
        values: sizes(['Age 3–4', 'Age 5–6', 'Age 7–8', 'Age 9–10', 'Age 11–12', 'S', 'M', 'L', 'XL']) },
    ],
    availability: 'order-in',
    leadTime: ORDER_IN,
    availableOnline: true,
  },

  // ─── Belts ─────────────────────────────────────────────────────────────────
  {
    slug: 'personalised-belt',
    name: 'Personalised Embroidered Belt',
    category: 'belts',
    summary: 'A Forza belt embroidered with your name.',
    description: [
      'Order an embroidered Forza belt with your name on it.',
      'Choose a new belt, or hand your current belt to your instructor to be embroidered.',
      'Personalised belts are made to order, so they can’t be cancelled or returned once ordered unless they are faulty.',
    ],
    // Prices from the belt order form (/belt-order, from the old site's form). No conflict.
    price: 1700,
    options: [
      { key: 'embroidery', label: 'Embroidery',
        values: [
          { value: 'name', label: 'Name only, 1 side', price: 1700 },
          { value: 'club-name', label: 'Club and your name', price: 1800 },
          { value: 'name-nickname', label: 'Your name and nickname', price: 1800 },
        ] },
      { key: 'newBelt', label: 'New belt',
        values: [
          { value: 'yes', label: 'Yes, supply a new belt (+£9.99)', extra: 999 },
          { value: 'no', label: 'No, I’ll hand my belt to my instructor' },
        ] },
      { key: 'beltColour', label: 'Belt colour', values: BELTS.map(b => ({ value: b.kyu ? `${b.kyu} – ${b.name}` : b.name })) },
      { key: 'timing', label: 'When',
        values: [
          { value: 'now', label: 'Order now' },
          { value: 'after-grading', label: 'Pre-order: I’ve passed my grading' },
        ] },
    ],
    personalisation: {
      key: 'nameOnBelt',
      label: 'Name on belt',
      maxLength: 30,
      help: 'Exactly as it should be embroidered (letters, spaces, hyphens and apostrophes).',
    },
    availability: 'order-in',
    leadTime: ORDER_IN,
    availableOnline: true,
    noCancellation: 'personalised',
  },

  // ─── Bundles ───────────────────────────────────────────────────────────────
  {
    slug: 'kumite-kit-bundle',
    name: 'Kumite Kit Bundle (Forza students only)',
    category: 'bundles',
    summary: 'Red and blue SMAI WKF mitts plus red and blue shin & instep guards.',
    description: [
      'Everything you need to train and compete: 1 × red mitts, 1 × blue mitts, 1 × red shin & instep guards and 1 × blue shin & instep guards. SMAI, WKF approved.',
      'This bundle is only for Forza Karate Club students.',
    ],
    image: '/store-products/smai-mitts.jpg',
    badge: 'WKF Approved',
    // OLD only: "Black Friday Special – Kumite Kit – FORZA STUDENTS ONLY", £200.00
    // (its Black Friday graphic said £185). No sizes were offered on OLD; size
    // choices added here. Please confirm whether this bundle is still offered.
    price: 20000,
    options: [
      { key: 'mittSize', label: 'Mitts size', values: XS_XL },
      { key: 'shinSize', label: 'Shin & instep size', values: XS_XL },
    ],
    availability: 'order-in',
    leadTime: ORDER_IN,
    availableOnline: true,
  },
]
