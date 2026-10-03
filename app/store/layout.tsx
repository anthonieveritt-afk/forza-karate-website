import StoreFooter from '@/components/store/StoreFooter'

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white">
      {children}
      <StoreFooter />
    </div>
  )
}
