import { redirect } from 'next/navigation'

export default async function VideoWelcome({ searchParams }: { searchParams: Promise<{ session_id?: string }> }) {
  const { session_id } = await searchParams
  redirect(session_id ? `/api/video-access?session_id=${encodeURIComponent(session_id)}` : '/members/videos')
}
