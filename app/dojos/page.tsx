import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, MapPin } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/Card'

export const metadata: Metadata = {
  title: 'Our Dojos',
  description: 'Forza Karate Club trains at two locations — Rayleigh and Upminster. Find your nearest dojo.',
}

const dojos = [
  {
    name: 'Rayleigh',
    subtitle: 'Rayleigh Primary School',
    description: 'Our Rayleigh dojo serves the Rayleigh and surrounding areas in Essex. Classes for all age groups.',
    href: '/dojos/rayleigh',
  },
  {
    name: 'Upminster',
    subtitle: 'Upminster',
    description: 'Our Upminster dojo serves East London and the surrounding areas. Classes for all age groups.',
    href: '/dojos/upminster',
  },
]

export default function DojosPage() {
  return (
    <div className="bg-white">
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8 border-b border-black/5">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-0.5 bg-[#dc2626]" />
            <span className="text-sm font-medium text-[#dc2626] uppercase tracking-wider">Dojos</span>
          </div>
          <h1 className="text-5xl font-bold text-[#111111] mb-4">Two dojos. One club.</h1>
          <p className="text-xl text-gray-500 max-w-2xl">
            We train at two locations across Essex and East London. Same standard, same instructors, same Forza.
          </p>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl">
            {dojos.map((dojo) => (
              <Card key={dojo.name} className="group hover:border-black/15 transition-all">
                <CardContent className="p-8">
                  <MapPin className="h-5 w-5 text-[#dc2626] mb-4" />
                  <h2 className="text-2xl font-bold text-[#111111] mb-1">{dojo.name}</h2>
                  <p className="text-sm text-gray-400 mb-4">{dojo.subtitle}</p>
                  <p className="text-gray-500 text-sm leading-relaxed mb-6">{dojo.description}</p>
                  <Link
                    href={dojo.href}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-[#111111] hover:text-[#dc2626] transition-colors"
                  >
                    View dojo details
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
