'use client'

import Image from 'next/image'
import { useState, useEffect } from 'react'

interface Album {
  id: number
  name: string
  category: string
  description: string | null
  coverPhotoUrl: string | null
  photoCount: number
  active: boolean
  createdAt: string
}

interface Photo {
  id: number
  albumId: number
  filename: string
  url: string
  caption: string | null
}

const API_BASE = 'https://forza-club-honbu-production.up.railway.app'

const CATEGORY_LABELS: Record<string, string> = {
  club:        'Club',
  competition: 'Competition',
  grading:     'Grading',
  course:      'Course',
  event:       'Event',
  other:       'Other',
}

const CATEGORY_COLOURS: Record<string, string> = {
  club:        'bg-blue-100 text-blue-700',
  competition: 'bg-red-100 text-red-700',
  grading:     'bg-amber-100 text-amber-700',
  course:      'bg-indigo-100 text-indigo-700',
  event:       'bg-purple-100 text-purple-700',
  other:       'bg-gray-100 text-gray-600',
}

export default function GalleryPage() {
  const [albums, setAlbums] = useState<Album[]>([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('All')
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null)
  const [albumPhotos, setAlbumPhotos] = useState<Photo[]>([])
  const [photosLoading, setPhotosLoading] = useState(false)
  const [lightbox, setLightbox] = useState<Photo | null>(null)

  useEffect(() => {
    fetch(`${API_BASE}/api/public/gallery`, { next: { revalidate: 300 } } as any)
      .then((r) => r.json())
      .then((data: Album[]) => {
        setAlbums(Array.isArray(data) ? data : [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  async function openAlbum(album: Album) {
    setSelectedAlbum(album)
    setPhotosLoading(true)
    try {
      const res = await fetch(`${API_BASE}/api/public/gallery/${album.id}`)
      const data = await res.json()
      setAlbumPhotos(data.photos ?? [])
    } catch {
      setAlbumPhotos([])
    }
    setPhotosLoading(false)
  }

  const categories = ['All', ...Array.from(new Set(albums.map((a) => a.category)))]
  const filtered =
    activeCategory === 'All' ? albums : albums.filter((a) => a.category === activeCategory)

  return (
    <div className="bg-white min-h-screen">
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

      {/* Category filter */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 border-b border-black/5">
        <div className="max-w-7xl mx-auto">
          <div className="flex gap-2 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                  activeCategory === cat
                    ? 'bg-[#111111] text-white border-[#111111]'
                    : 'bg-white text-gray-600 border-black/12 hover:border-black/25'
                }`}
              >
                {cat === 'All' ? 'All' : (CATEGORY_LABELS[cat] ?? cat)}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Albums grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="text-center py-24">
              <p className="text-gray-400 text-sm">Loading gallery…</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-24">
              <p className="text-gray-400 text-sm">No albums in this category yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((album) => (
                <button
                  key={album.id}
                  onClick={() => openAlbum(album)}
                  className="group text-left rounded-2xl overflow-hidden border border-black/5 hover:border-black/15 transition-all hover:shadow-md bg-white"
                >
                  {/* Cover photo */}
                  <div className="relative aspect-video bg-gray-100 overflow-hidden">
                    {album.coverPhotoUrl ? (
                      <Image
                        src={album.coverPhotoUrl}
                        alt={album.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        unoptimized
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <svg className="w-12 h-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="font-semibold text-[#111111] text-sm leading-tight">{album.name}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${CATEGORY_COLOURS[album.category] ?? 'bg-gray-100 text-gray-600'}`}>
                        {CATEGORY_LABELS[album.category] ?? album.category}
                      </span>
                    </div>
                    {album.description && (
                      <p className="text-xs text-gray-500 mb-2 line-clamp-2">{album.description}</p>
                    )}
                    <p className="text-xs text-gray-400">{album.photoCount} photo{album.photoCount !== 1 ? 's' : ''}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Album lightbox modal */}
      {selectedAlbum && (
        <div
          className="fixed inset-0 z-40 bg-black/60 flex items-start justify-center p-4 pt-16 overflow-y-auto"
          onClick={() => { setSelectedAlbum(null); setAlbumPhotos([]); }}
        >
          <div
            className="bg-white rounded-3xl w-full max-w-5xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 border-b border-black/5">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-xl font-bold text-[#111111]">{selectedAlbum.name}</h2>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${CATEGORY_COLOURS[selectedAlbum.category] ?? 'bg-gray-100 text-gray-600'}`}>
                    {CATEGORY_LABELS[selectedAlbum.category] ?? selectedAlbum.category}
                  </span>
                </div>
                {selectedAlbum.description && (
                  <p className="text-sm text-gray-500">{selectedAlbum.description}</p>
                )}
              </div>
              <button
                onClick={() => { setSelectedAlbum(null); setAlbumPhotos([]); }}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors text-lg leading-none"
              >
                ×
              </button>
            </div>

            <div className="p-6">
              {photosLoading ? (
                <div className="text-center py-12">
                  <p className="text-gray-400 text-sm">Loading photos…</p>
                </div>
              ) : albumPhotos.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-400 text-sm">No photos in this album yet.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {albumPhotos.map((photo, i) => (
                    <div
                      key={photo.id}
                      className={`relative overflow-hidden rounded-xl cursor-pointer group bg-gray-100 ${
                        i === 0 ? 'col-span-2 row-span-2' : ''
                      }`}
                      style={{ aspectRatio: i === 0 ? '4/3' : '1/1' }}
                      onClick={() => setLightbox(photo)}
                    >
                      <Image
                        src={photo.url}
                        alt={photo.caption ?? photo.filename}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 640px) 50vw, 25vw"
                        unoptimized
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                      {photo.caption && (
                        <div className="absolute bottom-0 left-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <p className="text-white text-xs font-medium drop-shadow">{photo.caption}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Full-size lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute top-4 right-4 text-white text-3xl leading-none hover:text-gray-300 z-10"
            onClick={() => setLightbox(null)}
          >
            ×
          </button>
          {lightbox.caption && (
            <p className="absolute bottom-8 left-0 right-0 text-center text-white text-sm drop-shadow">
              {lightbox.caption}
            </p>
          )}
          <div className="relative max-w-5xl max-h-[90vh] w-full h-full">
            <Image
              src={lightbox.url}
              alt={lightbox.caption ?? lightbox.filename}
              fill
              className="object-contain"
              sizes="100vw"
              unoptimized
            />
          </div>
        </div>
      )}
    </div>
  )
}
