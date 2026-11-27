const VOTE_URL = 'https://forzakarate.co.uk/members/vote'
const VOTE_URL_LABEL = 'forzakarate.co.uk/members/vote'

/**
 * Full-viewport 16:9 poster for the Awards Evening projector.
 * Letterboxed with #111 bars when the screen is not 16:9. No site chrome.
 */
export default function VotePoster() {
  return (
    <div
      className="vote-poster-stage"
      style={{ colorScheme: 'light only' }}
    >
      <div className="vote-poster-frame">
        <div className="vote-poster-copy">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/awards/forza-karate-logo.png"
            alt="Forza Karate"
            className="vote-poster-logo"
          />
          <div className="vote-poster-rule" aria-hidden />
          <h1 className="vote-poster-title">
            Karate-ka&apos;s
            <br />
            Karate-ka
          </h1>
          <p className="vote-poster-award">
            Student of the Year
            <br />
            Award
          </p>
        </div>
        <div className="vote-poster-scan-block">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/awards/karateka-vote-qr.svg"
            alt={`Scan to vote at ${VOTE_URL_LABEL}`}
            className="vote-poster-qr"
          />
          <p className="vote-poster-scan">Scan to vote</p>
          <p className="vote-poster-url">{VOTE_URL_LABEL}</p>
        </div>
      </div>
      <style>{`
        .vote-poster-stage {
          position: fixed;
          inset: 0;
          z-index: 200;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          background: #111;
        }
        .vote-poster-frame {
          box-sizing: border-box;
          width: min(100vw, calc(100dvh * 16 / 9));
          height: min(100dvh, calc(100vw * 9 / 16));
          display: grid;
          grid-template-columns: minmax(0, 0.92fr) minmax(0, 1.08fr);
          align-items: center;
          gap: 5%;
          padding: 5% 6%;
          background: #ffffff;
          color: #111;
          container-type: size;
        }
        .vote-poster-copy {
          display: flex;
          flex-direction: column;
          justify-content: center;
          min-width: 0;
        }
        .vote-poster-logo {
          display: block;
          width: min(100%, 42cqi);
          height: auto;
        }
        .vote-poster-rule {
          width: 18cqi;
          max-width: 7rem;
          height: 0.35cqi;
          min-height: 3px;
          background: #C41230;
          margin: 1.6cqi 0 2cqi;
        }
        .vote-poster-title {
          margin: 0;
          font-weight: 800;
          font-size: clamp(1.35rem, 6.2cqi, 4.4rem);
          letter-spacing: 0.04em;
          line-height: 1.12;
          text-transform: uppercase;
          color: #111;
        }
        .vote-poster-award {
          margin: 1cqi 0 0;
          font-weight: 800;
          font-size: clamp(1rem, 3.8cqi, 2.6rem);
          letter-spacing: 0.08em;
          line-height: 1.2;
          text-transform: uppercase;
          color: #C41230;
        }
        .vote-poster-scan-block {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-width: 0;
          min-height: 0;
        }
        .vote-poster-qr {
          display: block;
          width: min(100%, 78cqh);
          height: auto;
          aspect-ratio: 1;
        }
        .vote-poster-scan {
          margin: 1.4cqi 0 0;
          font-weight: 800;
          font-size: clamp(1rem, 3.2cqi, 2.2rem);
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #C41230;
          text-align: center;
        }
        .vote-poster-url {
          margin: 0.5cqi 0 0;
          font-weight: 600;
          font-size: clamp(0.8rem, 2.1cqi, 1.45rem);
          letter-spacing: 0.01em;
          color: #111;
          text-align: center;
        }
        @media (orientation: portrait) {
          .vote-poster-frame {
            width: min(100vw, calc(100dvh * 3 / 4));
            height: min(100dvh, calc(100vw * 4 / 3));
            grid-template-columns: 1fr;
            grid-template-rows: auto 1fr;
            justify-items: center;
            text-align: center;
            gap: 2%;
            padding: 6% 8%;
          }
          .vote-poster-copy {
            align-items: center;
          }
          .vote-poster-logo {
            width: min(70%, 55cqi);
            margin-inline: auto;
          }
          .vote-poster-rule {
            margin-inline: auto;
          }
          .vote-poster-qr {
            width: min(100%, 62cqh);
          }
        }
      `}</style>
    </div>
  )
}

// Keep the encoded vote URL in this module so tests can check it.
export const VOTE_POSTER_URL = VOTE_URL
