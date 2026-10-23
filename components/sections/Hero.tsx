import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/Button'
import { ArrowRight } from 'lucide-react'

/** Single composed club photo — joyful young student, clear face/action, space for text on the right. */
const HERO_PHOTO = {
  src: '/hero18.jpg',
  alt: 'Young Forza Karate student smiling in class with blue sparring gloves',
}

export default function Hero() {
  return (
    <section className="relative bg-[#111111] overflow-hidden">
      {/* Single responsive block: photo on top (mobile) / left (md+), text below / beside. One h1 in DOM. */}
      <div className="relative md:grid md:grid-cols-2 md:min-h-[min(88vh,720px)]">
        <div className="relative h-72 sm:h-80 md:h-auto">
          <Image
            src={HERO_PHOTO.src}
            alt={HERO_PHOTO.alt}
            fill
            priority
            sizes="(max-width: 767px) 100vw, 50vw"
            className="object-cover object-[35%_18%] md:object-[30%_20%]"
          />
          {/* Soft edge into text column — not a heavy white wash over faces */}
          <div
            className="hidden md:block absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#111111] to-transparent pointer-events-none"
            aria-hidden
          />
        </div>

        <div className="relative flex items-center bg-[#111111] px-5 py-10 md:px-8 lg:px-12 xl:px-16 md:py-20">
          <div className="max-w-xl w-full">
            <div className="flex items-center gap-2 mb-4 md:mb-6">
              <div className="w-8 h-0.5 bg-[#dc2626]" />
              <span className="text-sm font-medium text-[#dc2626] uppercase tracking-wider">
                Forza Karate Club
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-[1.1] md:leading-[1.08] tracking-tight mb-4 md:mb-5">
              Big confidence starts with a first class.
            </h1>
            <p className="text-base md:text-lg text-white/75 leading-relaxed mb-7 md:mb-8">
              Help your child build confidence, focus and friendships through karate in Rayleigh
              and Upminster. Beginners welcome.
            </p>
            <div className="flex flex-col md:flex-row md:flex-wrap gap-3 mb-6 md:mb-8">
              <Button asChild size="lg" className="w-full md:w-auto justify-center">
                <Link href="/trial-class">
                  Book a £10 Trial
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="w-full md:w-auto justify-center border-white/25 bg-transparent text-white hover:bg-white/10"
              >
                <Link href="#find-class">Find Your Child&apos;s Class</Link>
              </Button>
            </div>
            <p className="text-sm text-white/55">
              Classes from age 4 · Rayleigh &amp; Upminster · Beginners welcome
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
