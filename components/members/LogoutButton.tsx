import { Button } from '@/components/ui/Button'

/**
 * Members "Log out" button. A native form POST (not a server action or <Link>), so the browser
 * does a full navigation to the login page after the cookie is cleared, and it works without JS.
 */
export default function LogoutButton({ className }: { className?: string }) {
  return (
    <form action="/api/members/logout" method="post" className={className}>
      <Button type="submit" variant="outline" size="sm">Log out</Button>
    </form>
  )
}
