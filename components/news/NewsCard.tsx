import Link from 'next/link'
import Image from 'next/image'
import { formatNewsDate, type NewsPost } from '@/lib/news'

export default function NewsCard({ post, priority = false }: { post: NewsPost; priority?: boolean }) {
  return (
    <Link
      href={`/news/${post.slug}`}
      className="group flex flex-col rounded-2xl overflow-hidden border border-black/5 hover:border-black/15 transition-all hover:shadow-md bg-white"
    >
      <div className="relative aspect-video bg-gray-100 overflow-hidden">
        {post.image ? (
          <Image
            src={post.image.src}
            alt={post.image.alt}
            fill
            priority={priority}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-2xl font-bold text-gray-300">FORZA</span>
          </div>
        )}
      </div>
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center gap-2 mb-2 text-xs">
          <time dateTime={post.date} className="text-gray-400">{formatNewsDate(post.date)}</time>
          {post.category && (
            <span className="px-2 py-0.5 rounded-full bg-red-50 text-[#dc2626] font-medium">{post.category}</span>
          )}
        </div>
        <h2 className="font-semibold text-[#111111] leading-snug group-hover:text-[#dc2626] transition-colors">{post.title}</h2>
        {post.excerpt && <p className="text-sm text-gray-500 mt-2 line-clamp-3">{post.excerpt}</p>}
      </div>
    </Link>
  )
}
