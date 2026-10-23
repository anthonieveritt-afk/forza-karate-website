import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'

interface ClassCardProps {
  title: string
  subtitle: string
  ageRange: string
  description: string
  href: string
  imageSrc?: string
  imageAlt?: string
  /** Playful styling for Ninjas only */
  playful?: boolean
}

export default function ClassCard({
  title,
  subtitle,
  ageRange,
  description,
  href,
  imageSrc,
  imageAlt,
  playful = false,
}: ClassCardProps) {
  return (
    <article
      className={`group overflow-hidden rounded-2xl border bg-white border-black/8 transition-all hover:shadow-lg hover:border-black/15 focus-within:border-black/25 ${
        playful ? 'shadow-sm' : ''
      }`}
    >
      {imageSrc && (
        <div className="relative aspect-[16/10] overflow-hidden bg-[#f5f5f4]">
          <Image
            src={imageSrc}
            alt={imageAlt || title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-500 motion-safe:group-hover:scale-[1.03]"
            loading="lazy"
          />
          {playful && (
            <div
              className="absolute -bottom-1 -right-1 w-16 h-16 bg-[#dc2626] opacity-90"
              style={{ clipPath: 'polygon(100% 0, 0 100%, 100% 100%)' }}
              aria-hidden
            />
          )}
        </div>
      )}
      <div className="p-6 sm:p-7">
        <div
          className={`inline-flex items-center rounded-full text-xs font-semibold px-3 py-1 mb-4 ${
            playful
              ? 'bg-[#dc2626] text-white'
              : 'bg-red-50 text-[#dc2626]'
          }`}
        >
          {ageRange}
        </div>
        <h3 className="text-xl font-bold text-[#111111] mb-1">{title}</h3>
        <p className="text-sm text-[#dc2626] font-medium mb-3">{subtitle}</p>
        <p className="text-gray-700 text-sm leading-relaxed mb-5">{description}</p>
        <Link
          href={href}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-[#111111] hover:text-[#dc2626] transition-colors group-hover:gap-2.5 min-h-11"
        >
          Learn more
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </article>
  )
}
