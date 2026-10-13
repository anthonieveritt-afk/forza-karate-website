'use client'

import { useState } from 'react'
import { PlayCircle } from 'lucide-react'
import type { Video } from '@/lib/paid/catalogue'

const TABS = [
  { key: 'syllabus', label: 'Grading syllabus' },
  { key: 'more', label: 'More videos' },
] as const

export default function VideoTabs({ videos }: { videos: Video[] }) {
  const tabs = TABS.filter((t) => videos.some((v) => (v.group ?? 'syllabus') === t.key))
  const [active, setActive] = useState<string>(tabs[0]?.key ?? 'syllabus')
  const list = videos.filter((v) => (v.group ?? 'syllabus') === active)
  return (
    <div>
      {tabs.length > 1 && (
        <div role="tablist" aria-label="Video categories" className="flex gap-2 mb-8 overflow-x-auto border-b border-black/10">
          {tabs.map((t) => (
            <button key={t.key} role="tab" type="button" aria-selected={active === t.key} onClick={() => setActive(t.key)}
              className={`shrink-0 px-4 py-3 text-sm font-semibold -mb-px border-b-2 transition-colors ${active === t.key ? 'border-[#dc2626] text-[#dc2626]' : 'border-transparent text-gray-500 hover:text-[#111111]'}`}>
              {t.label}
            </button>
          ))}
        </div>
      )}
      <div role="tabpanel" className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {list.map((v) => (
          <div key={v.id} className="rounded-2xl border border-black/8 overflow-hidden">
            {v.youtubeId ? (
              <iframe className="w-full aspect-video" src={`https://www.youtube-nocookie.com/embed/${v.youtubeId}?rel=0`}
                title={v.title} allow="accelerometer; encrypted-media; gyroscope; picture-in-picture" allowFullScreen loading="lazy" />
            ) : (
              <div className="w-full aspect-video bg-[#111111] flex flex-col items-center justify-center text-gray-400">
                <PlayCircle className="h-10 w-10 mb-2" /><span className="text-xs">Video coming soon</span>
              </div>
            )}
            <p className="p-4 text-sm font-medium text-[#111111]">{v.title}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
