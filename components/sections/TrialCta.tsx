import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { TRIAL_HREF } from '@/lib/site'

export default function TrialCta({
  title = 'Ready to try a class?',
  text = 'First class is free. No kit required.',
}: { title?: string; text?: string }) {
  return (
    <section className="bg-[#111111] py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-white mb-4">{title}</h2>
        <p className="text-gray-400 mb-8">{text}</p>
        <Button asChild size="lg">
          <Link href={TRIAL_HREF}>
            Book a free trial
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </section>
  )
}
