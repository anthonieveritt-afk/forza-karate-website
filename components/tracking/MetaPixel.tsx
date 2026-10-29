'use client'
import Script from 'next/script'
import { usePathname } from 'next/navigation'
import { useEffect, useRef } from 'react'
import { captureUtm, track } from '@/lib/tracking'

// Set NEXT_PUBLIC_META_PIXEL_ID on Vercel to switch the pixel on. Unset = no Meta code loads.
const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID?.trim()

export default function MetaPixel() {
  const pathname = usePathname()
  const first = useRef(true)
  useEffect(() => {
    captureUtm()
    if (first.current) { first.current = false; return } // initial PageView is fired by the base code
    track('PageView')
  }, [pathname])
  if (!PIXEL_ID || !/^\d{6,20}$/.test(PIXEL_ID)) return null
  return (
    <Script id="meta-pixel" strategy="afterInteractive">{`
!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
fbq('init','${PIXEL_ID}');fbq('track','PageView');`}</Script>
  )
}
