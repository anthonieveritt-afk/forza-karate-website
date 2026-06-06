'use client'

import { useState } from 'react'
import Image from 'next/image'
import { X } from 'lucide-react'

interface Instructor {
  name: string
  grade: string
  role: string
  dojo: string
  photo: string
  bio: string
}

function BioText({ bio }: { bio: string }) {
  const [expanded, setExpanded] = useState(false)
  const paragraphs = bio.split('\n\n').filter(Boolean)
  const firstPara = paragraphs[0] ?? bio
  const rest = paragraphs.slice(1).join('\n\n')
  const hasMore = rest.trim().length > 0

  return (
    <div className="text-sm text-gray-500">
      <p>{firstPara}</p>
      {hasMore && (
        <>
          {expanded && (
            <p className="mt-3 whitespace-pre-line">{rest}</p>
          )}
          <button
            onClick={() => setExpanded(v => !v)}
            className="mt-2 text-[#dc2626] font-medium text-xs hover:underline focus:outline-none"
          >
            {expanded ? 'Read less ↑' : 'Read more…'}
          </button>
        </>
      )}
    </div>
  )
}

export default function InstructorsClient({ instructors }: { instructors: Instructor[] }) {
  const [lightbox, setLightbox] = useState<Instructor | null>(null)

  return (
    <>
      {/* Instructor cards */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {instructors.map((instructor, i) => (
              <div key={i} className="rounded-2xl border border-black/8 overflow-hidden">
                <div
                  className="w-full aspect-[4/3] bg-[#fafaf9] relative overflow-hidden cursor-zoom-in"
                  onClick={() => instructor.photo && setLightbox(instructor)}
                >
                  {instructor.photo ? (
                    <Image
                      src={instructor.photo}
                      alt={instructor.name}
                      fill
                      className="object-cover object-top transition-transform duration-300 hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-4xl font-bold text-gray-400">{instructor.name.charAt(0)}</span>
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <div className="flex items-baseline gap-3 mb-0.5">
                    <h3 className="font-bold text-[#111111] text-lg">{instructor.name}</h3>
                    <span className="text-base font-bold text-[#dc2626]">{instructor.grade}</span>
                  </div>
                  <p className="text-sm text-[#dc2626] font-medium mb-1">{instructor.role}</p>
                  <p className="text-xs text-gray-400 mb-4">{instructor.dojo}</p>
                  <BioText bio={instructor.bio} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors p-2"
            onClick={() => setLightbox(null)}
            aria-label="Close"
          >
            <X className="w-7 h-7" />
          </button>
          <div
            className="relative max-w-2xl w-full max-h-[90vh] rounded-2xl overflow-hidden shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <Image
              src={lightbox.photo}
              alt={lightbox.name}
              width={800}
              height={1000}
              className="w-full h-auto object-cover object-top"
              priority
            />
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent px-6 py-5">
              <p className="text-white font-bold text-lg leading-tight">{lightbox.name}</p>
              <p className="text-white/70 text-sm">{lightbox.role} · {lightbox.grade}</p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
