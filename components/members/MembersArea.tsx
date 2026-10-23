import MembersSidebar from '@/components/members/MembersSidebar'

/**
 * Layout for logged-in members pages: content on the left, the Members sidebar on the right.
 * Optional asideExtra sits below the sidebar (e.g. licence slip preview).
 * On mobile the sidebar (and asideExtra) stacks above the content.
 */
export default function MembersArea({
  children,
  asideExtra,
}: {
  children: React.ReactNode
  asideExtra?: React.ReactNode
}) {
  const wideAside = !!asideExtra
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
        <div className="min-w-0 flex-1 order-2 lg:order-1">{children}</div>
        <aside
          className={`w-full shrink-0 order-1 lg:order-2 space-y-6 ${
            wideAside ? 'lg:w-80' : 'lg:w-72'
          }`}
        >
          <MembersSidebar />
          {asideExtra}
        </aside>
      </div>
    </div>
  )
}
