// Shared club facts used across pages. Keep these in one place so pages can't drift apart.

/** The single call to action used across the site. */
export const TRIAL_HREF = '/trial-class'

/** Official social accounts, as linked in the old site's footer. */
export const SOCIAL_LINKS = {
  facebook: 'https://www.facebook.com/Forzakarateuk/',
  instagram: 'https://www.instagram.com/forzakarateclub',
  x: 'https://www.twitter.com/forzakarateclub',
  youtube: 'https://www.youtube.com/c/Forzakarate',
} as const

/** Monthly membership fees, as shown on /join. */
export const MEMBERSHIP_FEES = [
  { key: 'single',      label: 'Single',      price: '£45', period: 'per month', note: '1 student · or £540 a year paid annually' },
  { key: 'family2',     label: 'Family of 2', price: '£75', period: 'per month', note: '2 students · immediate family only' },
  { key: 'family3plus', label: 'Family of 3+', price: '£100', period: 'per month', note: '3 or more students · immediate family only' },
] as const
