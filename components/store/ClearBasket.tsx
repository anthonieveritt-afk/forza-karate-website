'use client'

import { useEffect } from 'react'
import { clearBasket } from '@/lib/store/basket'

/** Empties the basket once an order has been paid. */
export default function ClearBasket() {
  useEffect(() => {
    clearBasket()
  }, [])
  return null
}
