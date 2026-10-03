// Collection points for store orders: every class in the shared timetable.
// Orders are collected at class; nothing is posted.

import { DOJO_NAMES, TIMETABLE, type DojoKey } from '@/lib/timetable'

export interface CollectionOption {
  id: string
  dojo: DojoKey
  dojoName: string
  /** e.g. "Rayleigh: Tuesday 6:15 – 7:00pm (Ages 4–10)" */
  label: string
}

export const COLLECTION_OPTIONS: CollectionOption[] = TIMETABLE.map(s => ({
  id: s.id,
  dojo: s.dojo,
  dojoName: DOJO_NAMES[s.dojo],
  label: `${DOJO_NAMES[s.dojo]}: ${s.day} ${s.time} (${s.desc})`,
}))

export function getCollectionOption(id: unknown): CollectionOption | undefined {
  return typeof id === 'string' ? COLLECTION_OPTIONS.find(o => o.id === id) : undefined
}
