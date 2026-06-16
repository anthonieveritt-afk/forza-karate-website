import { redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/Button'
import { getMemberPortalData } from '@/app/actions/portal'
import { logoutMembers } from '@/app/actions/members-auth'

function beltBadgeClass(belt: string | null): string {
  if (!belt) return 'bg-gray-100 text-gray-600'
  const b = belt.toLowerCase()
  if (b.includes('black')) return 'bg-gray-900 text-white'
  if (b.includes('brown')) return 'bg-amber-100 text-amber-800'
  if (b.includes('purple')) return 'bg-purple-100 text-purple-700'
  if (b.includes('blue')) return 'bg-blue-100 text-blue-700'
  if (b.includes('green')) return 'bg-green-100 text-green-700'
  if (b.includes('yellow')) return 'bg-yellow-100 text-yellow-700'
  if (b.includes('red')) return 'bg-red-100 text-red-700'
  if (b.includes('orange')) return 'bg-orange-100 text-orange-700'
  return 'bg-gray-100 text-gray-600'
}

function medalEmoji(medal: string | null): string {
  if (!medal) return ''
  const m = medal.toLowerCase()
  if (m.includes('gold')) return '🥇 '
  if (m.includes('silver')) return '🥈 '
  if (m.includes('bronze')) return '🥉 '
  return '🏅 '
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return '—'
  try {
    return new Date(dateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
  } catch {
    return dateStr
  }
}

export default async function MembersPortalPage() {
  const data = await getMemberPortalData()
  if (!data) redirect('/members')

  const { profile, gradings, attendance, competitions, courses } = data

  return (
    <div className="min-h-screen bg-[#fafaf9]">
      {/* Header */}
      <header className="bg-white border-b border-black/8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto h-16 flex items-center justify-between">
          <Link href="/">
            <Image src="/forza-logo.webp" alt="Forza Karate Club" width={120} height={48} className="h-10 w-auto" />
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/members/grading" className="text-sm text-[#dc2626] hover:underline font-medium">Grading</Link>
            <span className="text-gray-300">|</span>
            <span className="text-sm text-gray-500">Members area</span>
            <form action={logoutMembers}>
              <Button type="submit" variant="outline" size="sm">Log out</Button>
            </form>
          </div>
        </div>
      </header>

      <main className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto space-y-8">

          {/* Profile card */}
          <div className="bg-white rounded-2xl border border-black/8 p-8 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-[#111111]">
                  {profile.firstName} {profile.surname}
                </h1>
                <div className="flex items-center gap-3 mt-2 flex-wrap">
                  {profile.currentBelt && (
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${beltBadgeClass(profile.currentBelt)}`}>
                      {profile.currentBelt}
                    </span>
                  )}
                  {profile.clubName && (
                    <span className="text-sm text-gray-500">{profile.clubName}</span>
                  )}
                </div>
              </div>
              <div className="text-sm text-gray-500 space-y-1 sm:text-right">
                {profile.licenceNumber && (
                  <p>Licence: <span className="font-medium text-[#111111]">{profile.licenceNumber}</span></p>
                )}
                {profile.licenceExpiryDate && (
                  <p>Expires: <span className="font-medium text-[#111111]">{formatDate(profile.licenceExpiryDate)}</span></p>
                )}
                {profile.joinedDate && (
                  <p>Joined: <span className="font-medium text-[#111111]">{formatDate(profile.joinedDate)}</span></p>
                )}
              </div>
            </div>
          </div>

          {/* Belt journey */}
          <div className="bg-white rounded-2xl border border-black/8 p-8 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-6 h-0.5 bg-[#dc2626]" />
              <h2 className="text-lg font-bold text-[#111111]">Belt journey</h2>
            </div>
            {gradings.length === 0 ? (
              <p className="text-sm text-gray-400">No gradings recorded yet.</p>
            ) : (
              <div className="space-y-3">
                {gradings.map((g: { id: number; gradingDate: string; fromBelt: string | null; toBelt: string | null; result: string | null; examiner: string | null }) => (
                  <div key={g.id} className="flex items-center gap-3 flex-wrap">
                    <span className="text-sm text-gray-400 w-28 shrink-0">{formatDate(g.gradingDate)}</span>
                    {g.fromBelt && (
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${beltBadgeClass(g.fromBelt)}`}>
                        {g.fromBelt}
                      </span>
                    )}
                    {g.fromBelt && g.toBelt && <span className="text-gray-300 text-xs">→</span>}
                    {g.toBelt && (
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${beltBadgeClass(g.toBelt)}`}>
                        {g.toBelt}
                      </span>
                    )}
                    {g.result && (
                      <span className={`text-xs font-medium ${g.result.toLowerCase() === 'pass' ? 'text-green-600' : 'text-red-500'}`}>
                        {g.result}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Attendance */}
            <div className="bg-white rounded-2xl border border-black/8 p-6 shadow-sm">
              <p className="text-sm text-gray-500 mb-1">Sessions attended</p>
              <p className="text-3xl font-bold text-[#111111]">{attendance.length}</p>
            </div>

            {/* Competitions */}
            <div className="bg-white rounded-2xl border border-black/8 p-6 shadow-sm">
              <p className="text-sm text-gray-500 mb-1">Competitions entered</p>
              <p className="text-3xl font-bold text-[#111111]">{competitions.length}</p>
            </div>

            {/* Courses */}
            <div className="bg-white rounded-2xl border border-black/8 p-6 shadow-sm">
              <p className="text-sm text-gray-500 mb-1">Courses enrolled</p>
              <p className="text-3xl font-bold text-[#111111]">{courses.length}</p>
            </div>
          </div>

          {/* Competitions detail */}
          {competitions.length > 0 && (
            <div className="bg-white rounded-2xl border border-black/8 p-8 shadow-sm">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-6 h-0.5 bg-[#dc2626]" />
                <h2 className="text-lg font-bold text-[#111111]">Competitions</h2>
              </div>
              <div className="space-y-3">
                {competitions.map((c: { id: number; competitionName: string; competitionDate: string; category: string | null; result: string | null; medal: string | null }) => (
                  <div key={c.id} className="flex items-start justify-between gap-4 py-3 border-b border-black/5 last:border-0">
                    <div>
                      <p className="text-sm font-medium text-[#111111]">
                        {medalEmoji(c.medal)}{c.competitionName}
                      </p>
                      {c.category && <p className="text-xs text-gray-400 mt-0.5">{c.category}</p>}
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs text-gray-400">{formatDate(c.competitionDate)}</p>
                      {c.result && <p className="text-xs font-medium text-[#111111] mt-0.5">{c.result}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  )
}
