'use client'

import Image from 'next/image'
import { useState } from 'react'

const albums = [
  {
    category: 'Competition',
    title: 'BKF Four Nations',
    photos: [
      '/gallery/competitions/bkf-four-nations/bkf-01.jpg',
      '/gallery/competitions/bkf-four-nations/bkf-02.jpg',
      '/gallery/competitions/bkf-four-nations/bkf-03.jpg',
      '/gallery/competitions/bkf-four-nations/bkf-04.jpg',
      '/gallery/competitions/bkf-four-nations/bkf-05.jpg',
      '/gallery/competitions/bkf-four-nations/bkf-06.jpg',
      '/gallery/competitions/bkf-four-nations/bkf-07.jpg',
      '/gallery/competitions/bkf-four-nations/bkf-08.jpg',
    ],
  },
  {
    category: 'Competition',
    title: 'English Kyu Grade Championships 2025',
    photos: [
      '/gallery/competitions/english-kyu-grade-champs-2025/ekgc-01.jpg',
      '/gallery/competitions/english-kyu-grade-champs-2025/ekgc-02.jpg',
    ],
  },
  {
    category: 'Training',
    title: 'Club Training',
    photos: [
      '/gallery/training/club-training/training-01.jpg',
    ],
  },
]

// Flatten all photos with their metadata for the grid
const allPhotos = albums.flatMap((album) =>
  album.photos.map((src) => ({ src, category: album.category, album: album.title }))
)

const categories = ['All', 'Competition', 'Dojos', 'Black Belts', 'Training']

export default function GalleryPage() {
  const [active, setActive] = useState('All')
  const [lightbox, setLightbox] = useState<string | null>(null)

  const filtered = active === 'All' ? allPhotos : allPhotos.filter((p) => p.category === active)

  return (
    <div className="bg-white">
      {/* Header */}
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8 border-b border-black/5">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-0.5 bg-[#dc2626]" />
            <span className="text-sm font-medium text-[#dc2626] uppercase tracking-wider">Gallery</span>
          </div>
          <h1 className="text-5xl font-bold text-[#111111] mb-4">Gallery</h1>
          <p className="text-xl text-gray-500 max-w-2xl">
            Moments from the mat — competitions, gradings, and everything in between.
          </p>
        </div>
      </section>

      {/* Category tabs */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 border-b border-black/5">
        <div className="max-w-7xl mx-auto">
          <div className="flex gap-2 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                  active === cat
                    ? 'bg-[#111111] text-white border-[#111111]'
                    : 'bg-white text-gray-600 border-black/12 hover:border-black/25'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Photo grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {filtered.length > 0 ? (
            <>
              {/* Album label */}
              {active !== 'All' && (
                <div className="mb-8">
                  <p className="text-xs font-medium text-[#dc2626] uppercase tracking-wider mb-1">{active}</p>
                  <h2 className="text-2xl font-bold text-[#111111]">
                    {albums.find((a) => a.category === active)?.title}
                  </h2>
                </div>
              )}

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {filtered.map((photo, i) => (
                  <div
                    key={photo.src}
                    className={`relative overflow-hidden rounded-2xl cursor-pointer group bg-[#fafaf9] ${
                      i === 0 ? 'col-span-2 row-span-2' : ''
                    }`}
                    style={{ aspectRatio: i === 0 ? '4/3' : '1/1' }}
                    onClick={() => setLightbox(photo.src)}
                  >
                    <Image
                      src={photo.src}
                      alt={`${photo.album} — photo ${i + 1}`}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                    <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <p className="text-white text-xs font-medium drop-shadow">{photo.album}</p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-24">
              <p className="text-gray-400 text-sm">No photos in this category yet.</p>
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute top-4 right-4 text-white text-3xl leading-none hover:text-gray-300"
            onClick={() => setLightbox(null)}
          >
            ×
          </button>
          <div className="relative max-w-5xl max-h-[90vh] w-full h-full">
            <Image
              src={lightbox}
              alt="Gallery photo"
              fill
              className="object-contain"
              sizes="100vw"
            />
          </div>
        </div>
      )}
    </div>
  )
}
