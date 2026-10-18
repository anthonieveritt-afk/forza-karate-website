import MembersSidebar from '@/components/members/MembersSidebar'

/**
 * Layout for logged-in members pages: content on the left, the Members sidebar on the right.
 * On mobile the sidebar stacks above the content.
 */
export default function MembersArea({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
        <div className="min-w-0 flex-1 order-2 lg:order-1">{children}</div>
        <aside className="w-full lg:w-72 shrink-0 order-1 lg:order-2">
          <MembersSidebar />
        </aside>
      </div>
    </div>
  )
}
