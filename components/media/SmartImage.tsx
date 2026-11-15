import Image, { type ImageProps } from 'next/image'
import { heicProxySrc, isHeicUrl } from '@/lib/opt-image'

/**
 * next/image with a HEIC fallback. iPhone camera photos on the gallery
 * still arrive as .HEIC; those go through /api/opt-image so the page
 * never downloads the raw multi-megabyte file.
 */
export default function SmartImage({ src, alt, className, style, ...rest }: ImageProps) {
  if (typeof src === 'string' && isHeicUrl(src)) {
    const requested =
      typeof rest.width === 'number'
        ? rest.width
        : rest.sizes?.includes('100vw')
          ? 1920
          : 1200
    const proxy = heicProxySrc(src, requested)
    const fillStyle = rest.fill
      ? { position: 'absolute' as const, inset: 0, width: '100%', height: '100%' }
      : undefined
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        src={proxy}
        alt={alt}
        className={className}
        style={{ ...fillStyle, ...style }}
        loading={rest.priority ? 'eager' : 'lazy'}
      />
    )
  }
  return <Image src={src} alt={alt} className={className} style={style} {...rest} />
}
