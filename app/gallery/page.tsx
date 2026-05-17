import type { Metadata } from 'next'
import { ImageIcon } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Gallery',
  description: 'Photos from Forza Karate Club — competitions, dojos, black belt ceremonies, and training.',
}

const categories = ['All', 'Competition', 'Dojos', 'Black Belts', 'Training']

export default function GalleryPage() {
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

      {/* Categories */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 border-b border-black/5">
        <div className="max-w-7xl mx-auto">
          <div className="flex gap-2 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                  cat === 'All'
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

      {/* Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className={`rounded-2xl bg-[#fafaf9] border border-black/5 flex items-center justify-center ${
                  i === 0 ? 'col-span-2 row-span-2 h-64' : 'h-40'
                }`}
              >
                <div className="text-center text-gray-300">
                  <ImageIcon className="h-8 w-8 mx-auto mb-1" />
                  <p className="text-xs">Photo</p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-400 mt-8 text-center">
            Real photos coming soon. If you have photos from events, contact us to share them.
          </p>
        </div>
      </section>
    </div>
  )
}
