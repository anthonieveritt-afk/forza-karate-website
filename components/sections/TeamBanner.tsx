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

const track = [...photos, ...photos]

export default function TeamBanner() {
  return (
    <div style={{ width: '100%', overflow: 'hidden', background: '#111111', padding: '16px 0' }}>
      <div className="team-scroll-track" style={{ display: 'flex', gap: '12px', width: 'max-content' }}>
        {track.map((src, i) => (
          <img
            key={i}
            src={src}
            alt={`Forza Karate Team ${(i % photos.length) + 1}`}
            style={{
              width: '280px',
              height: '210px',
              objectFit: 'cover',
              borderRadius: '12px',
              flexShrink: 0,
              display: 'block',
            }}
          />
        ))}
      </div>
    </div>
  )
}
