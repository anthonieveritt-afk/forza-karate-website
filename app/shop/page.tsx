import type { Metadata } from 'next'
import Image from 'next/image'
import { ShoppingBag, ExternalLink } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Shop',
  description: 'Forza Karate Club shop — uniforms, equipment, and club merchandise.',
}

const CDN = 'https://d2j6dbq0eux0bg.cloudfront.net/images/2954177'

const products = [
  {
    name: 'Gum Shields',
    price: '£5.00',
    category: 'Equipment',
    img: `${CDN}/3068968095.jpg`,
    href: 'https://forzakarate.co.uk/shop/Gum-Shields-p464933372',
  },
  {
    name: 'Official Forza Karate T-Shirt',
    price: '£12.99',
    category: 'Clothing',
    img: `${CDN}/1634264290.jpg`,
    href: 'https://forzakarate.co.uk/shop/Official-Forza-Karate-T-Shirt-p227803516',
  },
  {
    name: '2020 Forza Karate Gi',
    price: '£40.00',
    category: 'Clothing',
    img: `${CDN}/1568437559.jpg`,
    href: 'https://forzakarate.co.uk/shop/2020ForzaKarateGi-p223518731',
  },
  {
    name: 'Shin and Instep Pads',
    price: '£43.99',
    category: 'Equipment',
    img: `${CDN}/988805234.jpg`,
    href: 'https://forzakarate.co.uk/shop/Shin-and-instep-p129874570',
  },
  {
    name: 'WKF Red / Blue Hand Mitts',
    price: '£45.00',
    category: 'Equipment',
    img: `${CDN}/1663394279.jpg`,
    href: 'https://forzakarate.co.uk/shop/WKF-Red-Blue-Hand-Mitts-p236709705',
  },
  {
    name: 'Forza Official Body Protectors',
    price: '£45.00',
    category: 'Equipment',
    desc: 'Suitable for club training, sparring, competitions and inter-club events. Sizes XS–XL.',
    img: `${CDN}/2344431624.jpg`,
    href: 'https://forzakarate.co.uk/shop/Forza-Official-Body-Protectors-p366351609',
  },
  {
    name: 'WKF Shin and Instep Pads',
    price: '£70.00',
    category: 'Equipment',
    img: `${CDN}/2196702763.jpg`,
    href: 'https://forzakarate.co.uk/shop/WKF-Shin-and-Instep-Pads-p342012815',
  },
  {
    name: 'Sport Karate Gi',
    price: '£78.50',
    category: 'Clothing',
    desc: 'As used by sport karate athletes. Embroidered Forza logo, ventilated, 100% polyester. Sized by height.',
    img: `${CDN}/1843227498.jpg`,
    href: 'https://forzakarate.co.uk/shop/Sport-Karate-Gi-p246086337',
  },
  {
    name: 'Kata Gi for Karate Competition',
    price: '£90.00',
    category: 'Clothing',
    img: `${CDN}/1603974826.jpg`,
    href: 'https://forzakarate.co.uk/shop/Kata-Gi-for-Karate-competition-p228909436',
  },
  {
    name: 'Kumite Kit Bundle',
    price: '£200.00',
    category: 'Bundle',
    desc: 'Forza students only. Full kumite kit in one bundle.',
    img: `${CDN}/4654068206.jpg`,
    href: 'https://forzakarate.co.uk/shop/Black-Friday-Special-Kumite-Kit-FORZA-STUDENTS-ONLY-p711117093',
    badge: 'Members only',
  },
]

const categories = ['All', 'Clothing', 'Equipment', 'Bundle']

export default function ShopPage() {
  return (
    <div className="bg-white">
      {/* Header */}
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8 border-b border-black/5">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-0.5 bg-[#dc2626]" />
            <span className="text-sm font-medium text-[#dc2626] uppercase tracking-wider">Shop</span>
          </div>
          <h1 className="text-5xl font-bold text-[#111111] mb-4">Shop</h1>
          <p className="text-xl text-gray-500 max-w-2xl">
            Official Forza Karate kit, uniforms, and equipment.
          </p>
        </div>
      </section>

      {/* Category tabs */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 border-b border-black/5">
        <div className="max-w-7xl mx-auto flex gap-2 flex-wrap">
          {categories.map((cat) => (
            <span
              key={cat}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border ${
                cat === 'All'
                  ? 'bg-[#111111] text-white border-[#111111]'
                  : 'bg-white text-gray-600 border-black/12'
              }`}
            >
              {cat}
            </span>
          ))}
        </div>
      </section>

      {/* Product grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {products.map((product) => (
              <a
                key={product.href}
                href={product.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col rounded-2xl border border-black/8 overflow-hidden hover:border-black/20 hover:shadow-md transition-all"
              >
                {/* Image */}
                <div className="relative aspect-square bg-[#fafaf9]">
                  <Image
                    src={product.img}
                    alt={product.name}
                    fill
                    className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                  />
                  {product.badge && (
                    <span className="absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#111111] text-white">
                      {product.badge}
                    </span>
                  )}
                  <span className="absolute top-2 right-2 text-[10px] font-medium px-2 py-0.5 rounded-full bg-white border border-black/8 text-gray-500">
                    {product.category}
                  </span>
                </div>

                {/* Info */}
                <div className="p-3 flex flex-col flex-1">
                  <p className="text-sm font-semibold text-[#111111] leading-tight mb-1 group-hover:text-[#dc2626] transition-colors">
                    {product.name}
                  </p>
                  {product.desc && (
                    <p className="text-xs text-gray-400 leading-relaxed mb-2 line-clamp-2">{product.desc}</p>
                  )}
                  <div className="flex items-center justify-between mt-auto pt-2">
                    <span className="text-sm font-bold text-[#111111]">{product.price}</span>
                    <ExternalLink className="h-3.5 w-3.5 text-gray-300 group-hover:text-[#dc2626] transition-colors" />
                  </div>
                </div>
              </a>
            ))}
          </div>

          <div className="mt-12 p-6 rounded-2xl bg-[#fafaf9] border border-black/5 text-center">
            <ShoppingBag className="h-6 w-6 text-[#dc2626] mx-auto mb-3" />
            <p className="text-sm font-semibold text-[#111111] mb-1">More coming in Phase 2</p>
            <p className="text-sm text-gray-500">
              Full integrated checkout launching soon — buy direct without leaving the site.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
