import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import { Shield, Users, Calendar, BarChart2, ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Club Management — Forza Karate Club',
  robots: { index: false, follow: false },
}

const features = [
  { icon: Users,     label: 'Members',     desc: 'Manage students, grades and licences' },
  { icon: Calendar,  label: 'Attendance',  desc: 'Track sessions and class registers' },
  { icon: Shield,    label: 'Gradings',    desc: 'Schedule and record belt assessments' },
  { icon: BarChart2, label: 'Reports',     desc: 'Insights on retention and growth' },
]

const ADMIN_URL = process.env.NEXT_PUBLIC_FORZA_ADMIN_URL ?? 'https://club-honbu-production.up.railway.app'

export default function AdminGatewayPage() {
  return (
    <div className="min-h-screen bg-[#111111] flex flex-col">

      {/* Top bar */}
      <div className="border-b border-white/8 px-6 py-4 flex items-center justify-between">
        <Image src="/forza-logo.webp" alt="Forza Karate Club" width={100} height={40} className="h-9 w-auto brightness-0 invert" />
        <span className="text-xs text-white/30 font-medium uppercase tracking-widest">Club Management</span>
      </div>

      {/* Hero */}
      <div className="flex-1 flex items-center justify-center px-6 py-20">
        <div className="max-w-lg w-full text-center">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-[#dc2626]/10 border border-[#dc2626]/20 rounded-full px-4 py-1.5 mb-8">
            <div className="w-2 h-2 rounded-full bg-[#dc2626] animate-pulse" />
            <span className="text-xs font-semibold text-[#dc2626] uppercase tracking-wider">Forza Karate Club</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight mb-4">
            Club Management<br />
            <span className="text-[#dc2626]">System</span>
          </h1>

          <p className="text-white/50 text-base leading-relaxed mb-10">
            Your members, grades, attendance and reports — all in one place.
          </p>

          {/* Feature pills */}
          <div className="grid grid-cols-2 gap-3 mb-10">
            {features.map((f) => (
              <div key={f.label} className="flex items-start gap-3 bg-white/5 border border-white/8 rounded-2xl p-4 text-left">
                <div className="w-8 h-8 rounded-xl bg-[#dc2626]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <f.icon className="h-4 w-4 text-[#dc2626]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{f.label}</p>
                  <p className="text-xs text-white/40 leading-snug mt-0.5">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <Link
            href={`${ADMIN_URL}/login`}
            className="inline-flex items-center gap-3 bg-[#dc2626] hover:bg-[#b91c1c] text-white font-semibold px-8 py-4 rounded-2xl transition-colors text-sm group w-full justify-center"
          >
            Login to Admin Dashboard
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>

          <p className="text-xs text-white/20 mt-4">Authorised personnel only</p>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-white/8 px-6 py-4 text-center">
        <p className="text-xs text-white/20">Powered by <span className="text-white/40">Club Honbu</span></p>
      </div>

    </div>
  )
}
