import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/Card'

interface ClassCardProps {
  title: string
  subtitle: string
  ageRange: string
  description: string
  href: string
  accent?: string
}

export default function ClassCard({
  title,
  subtitle,
  ageRange,
  description,
  href,
}: ClassCardProps) {
  return (
    <Card className="group hover:border-black/15 transition-all">
      <CardContent className="p-8">
        {/* Age badge */}
        <div className="inline-flex items-center rounded-full bg-red-50 text-[#dc2626] text-xs font-semibold px-3 py-1 mb-5">
          {ageRange}
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-[#111111] mb-1">{title}</h3>
        <p className="text-sm text-[#dc2626] font-medium mb-4">{subtitle}</p>

        {/* Description */}
        <p className="text-gray-500 text-sm leading-relaxed mb-6">{description}</p>

        {/* Link */}
        <Link
          href={href}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-[#111111] hover:text-[#dc2626] transition-colors group-hover:gap-2.5"
        >
          Learn more
          <ArrowRight className="h-4 w-4" />
        </Link>
      </CardContent>
    </Card>
  )
}
