'use client'

import { useEffect, useId, useRef, useState } from 'react'
import Link from 'next/link'
import { ChevronDown } from 'lucide-react'
import { newsCategoryHref, type NewsCategoryGroup } from '@/lib/news-category-groups'

export default function NewsCategoryNav({
  groups,
  allCount,
  activeSlug,
}: {
  groups: NewsCategoryGroup[]
  allCount: number
  activeSlug?: string
}) {
  const activeGroupId = groups.find((g) => g.categories.some((c) => c.slug === activeSlug))?.id ?? null
  const [openId, setOpenId] = useState<string | null>(activeGroupId)
  const rootRef = useRef<HTMLElement>(null)
  const baseId = useId()

  useEffect(() => {
    setOpenId(activeGroupId)
  }, [activeGroupId])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpenId(null)
    }
    function onPointer(e: PointerEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpenId(null)
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('pointerdown', onPointer)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('pointerdown', onPointer)
    }
  }, [])

  function toggle(id: string) {
    setOpenId((cur) => (cur === id ? null : id))
  }

  return (
    <nav ref={rootRef} aria-label="News categories">
      <h2 className="text-xs uppercase tracking-wider text-gray-400 mb-3">Categories</h2>
      <ul className="space-y-1.5">
        <li>
          <Link
            href="/news"
            className={!activeSlug ? 'text-[#111111] font-medium' : 'text-gray-500 hover:text-[#111111]'}
            aria-current={!activeSlug ? 'page' : undefined}
          >
            All <span className="text-gray-400">({allCount})</span>
          </Link>
        </li>
      </ul>
      <div className="mt-3 space-y-0.5">
        {groups.map((g) => {
          const open = openId === g.id
          const panelId = `${baseId}-${g.id}`
          const groupActive = g.categories.some((c) => c.slug === activeSlug)
          return (
            <div key={g.id} className="border-b border-black/5 last:border-b-0">
              <button
                type="button"
                className={`w-full flex items-center justify-between gap-2 py-2 text-left text-sm font-medium transition-colors ${
                  groupActive ? 'text-[#111111]' : 'text-gray-600 hover:text-[#111111]'
                }`}
                aria-expanded={open}
                aria-controls={panelId}
                onClick={() => toggle(g.id)}
              >
                <span>{g.label}</span>
                <ChevronDown
                  className={`h-4 w-4 shrink-0 transition-transform ${open ? 'rotate-180' : ''} ${
                    groupActive ? 'text-[#dc2626]' : 'text-gray-400'
                  }`}
                  aria-hidden
                />
              </button>
              <ul
                id={panelId}
                hidden={!open}
                className="pb-2 pl-3 border-l border-black/8 ml-0.5 space-y-1.5"
              >
                {g.categories.map((c) => {
                  const on = activeSlug === c.slug
                  return (
                    <li key={c.slug}>
                      <Link
                        href={newsCategoryHref(c.slug)}
                        className={`block text-sm ${on ? 'text-[#111111] font-medium' : 'text-gray-500 hover:text-[#111111]'}`}
                        aria-current={on ? 'page' : undefined}
                      >
                        {c.name} <span className="text-gray-400">({c.count})</span>
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>
          )
        })}
      </div>
    </nav>
  )
}
