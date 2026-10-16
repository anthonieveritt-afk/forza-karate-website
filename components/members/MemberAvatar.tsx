/* eslint-disable @next/next/no-img-element */
// Member photo from Club Honbu (profile.photoUrl, may be an https URL or a data: URL
// saved by staff in Club Honbu), with an initials fallback.
export function MemberAvatar({ firstName, surname, photoUrl }: { firstName?: string | null; surname?: string | null; photoUrl?: string | null }) {
  const initials = `${(firstName ?? '').trim().charAt(0)}${(surname ?? '').trim().charAt(0)}`.toUpperCase() || '?'
  const safe = typeof photoUrl === 'string' && /^(https:\/\/|data:image\/)/i.test(photoUrl) ? photoUrl : null
  return safe ? (
    <img src={safe} alt="Your profile photo" className="h-16 w-16 sm:h-20 sm:w-20 rounded-full object-cover border-2 border-white shadow ring-1 ring-black/10 flex-shrink-0" />
  ) : (
    <div aria-hidden="true" className="h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-[#111111] text-white flex items-center justify-center text-xl sm:text-2xl font-bold ring-2 ring-[#dc2626]/30 flex-shrink-0">
      {initials}
    </div>
  )
}
