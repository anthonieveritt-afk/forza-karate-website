'use client'

// The store basket, kept in localStorage so it survives page loads.
// It holds what was chosen plus a display price; the server re-prices
// everything at checkout, so the stored price is never charged.

import { useSyncExternalStore } from 'react'
import { MAX_LINES, MAX_QTY_PER_LINE, type Selections } from './pricing'

export interface BasketLine {
  /** lineKey(slug, options, personalisation) */
  id: string
  slug: string
  options: Selections
  personalisation?: string
  quantity: number
  // Display only:
  name: string
  optionSummary: string
  unitPrice: number
  image?: string
}

const STORAGE_KEY = 'forza_store_basket'
const EMPTY: BasketLine[] = []
const listeners = new Set<() => void>()
let cache: BasketLine[] | null = null

function read(): BasketLine[] {
  if (cache) return cache
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
    cache = Array.isArray(parsed) ? parsed : []
  } catch {
    cache = []
  }
  return cache!
}

function write(lines: BasketLine[]) {
  cache = lines
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lines))
  } catch {}
  listeners.forEach(l => l())
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) {
      cache = null
      listener()
    }
  }
  window.addEventListener('storage', onStorage)
  return () => {
    listeners.delete(listener)
    window.removeEventListener('storage', onStorage)
  }
}

export function addToBasket(line: Omit<BasketLine, 'quantity'>, quantity = 1) {
  const lines = read()
  const existing = lines.find(l => l.id === line.id)
  if (existing) {
    write(lines.map(l => (l.id === line.id ? { ...l, quantity: Math.min(MAX_QTY_PER_LINE, l.quantity + quantity) } : l)))
  } else if (lines.length < MAX_LINES) {
    write([...lines, { ...line, quantity: Math.min(MAX_QTY_PER_LINE, quantity) }])
  }
}

export function setQuantity(id: string, quantity: number) {
  if (quantity < 1) return removeFromBasket(id)
  write(read().map(l => (l.id === id ? { ...l, quantity: Math.min(MAX_QTY_PER_LINE, quantity) } : l)))
}

export function removeFromBasket(id: string) {
  write(read().filter(l => l.id !== id))
}

export function clearBasket() {
  write([])
}

export function useBasket() {
  const lines = useSyncExternalStore(subscribe, read, () => EMPTY)
  const count = lines.reduce((n, l) => n + l.quantity, 0)
  const total = lines.reduce((n, l) => n + l.unitPrice * l.quantity, 0)
  return { lines, count, total }
}
