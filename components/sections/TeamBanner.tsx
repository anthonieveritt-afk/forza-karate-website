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
      <div className="team-scroll-track flex gap-3 w-max">
        {track.map((src, i) => (
          <div
            key={i}
            className="relative flex-shrink-0 rounded-xl overflow-hidden"
            style={{ width: '280px', height: '210px' }}
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
    </div>
  )
}
