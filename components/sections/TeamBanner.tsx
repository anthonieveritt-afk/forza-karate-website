import Image from 'next/image'

const photos = [
  '/team/team-01.jpg',
  '/team/team-02.jpg',
  '/team/team-03.jpg',
  '/team/team-04.jpg',
  '/team/team-05.jpg',
  '/team/team-06.jpg',
  '/team/team-07.jpg',
  '/team/team-08.jpg',
  '/team/team-09.jpg',
  '/team/team-10.jpg',
]

// Duplicate for seamless infinite loop
const track = [...photos, ...photos]

export default function TeamBanner() {
  return (
    <div className="w-full overflow-hidden bg-[#111111] py-4">
      <div
        className="flex gap-3 w-max"
        style={{
          animation: 'team-scroll 40s linear infinite',
        }}
      >
        {track.map((src, i) => (
          <div
            key={i}
            className="relative flex-shrink-0 rounded-xl overflow-hidden"
            style={{ width: 280, height: 210 }}
          >
            <Image
              src={src}
              alt={`Forza Karate Team photo ${(i % photos.length) + 1}`}
              fill
              className="object-cover"
              sizes="280px"
            />
          </div>
        ))}
      </div>
      <style>{`
        @keyframes team-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @media (prefers-reduced-motion: reduce) {
          .team-banner-track { animation: none; }
        }
      `}</style>
    </div>
  )
}
