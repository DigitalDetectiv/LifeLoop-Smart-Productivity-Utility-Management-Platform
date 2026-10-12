import './Panda.css';

/*
  A single source of truth for the panda character so its look stays
  consistent everywhere. `pose` changes posture/expression:
    - "welcome"  : waving, used on the login/register page
    - "today"    : neutral sitting pose, used in the dashboard widget
    - "sleepy"   : eyes closed, used once all of today's tasks are done
  `size` is the pixel width/height of the rendered SVG (viewBox stays fixed).
*/
export default function Panda({ pose = 'today', size = 96, animated = true }) {
  const armUp = pose === 'welcome';
  const asleep = pose === 'sleepy';

  return (
    <svg
      className={animated ? 'panda-svg panda-animated' : 'panda-svg'}
      width={size}
      height={size}
      viewBox="0 0 120 120"
      role="img"
      aria-label={`Panda companion, ${pose} pose`}
    >
      {/* seat shadow */}
      <ellipse cx="60" cy="100" rx="30" ry="14" fill="var(--sage-soft)" />

      {/* ears */}
      <circle cx="30" cy="34" r="17" fill="#2B2733" />
      <circle cx="90" cy="34" r="17" fill="#2B2733" />
      <circle cx="30" cy="34" r="9" fill="#F4B6C6" />
      <circle cx="90" cy="34" r="9" fill="#F4B6C6" />

      {/* head */}
      <circle cx="60" cy="58" r="42" fill="#FFFFFF" stroke="#EAE6F5" strokeWidth="1.5" />

      {/* eye patches */}
      <ellipse cx="41" cy="55" rx="13" ry="15" fill="#2B2733" />
      <ellipse cx="79" cy="55" rx="13" ry="15" fill="#2B2733" />

      {/* eyes */}
      {asleep ? (
        <>
          <path d="M35 56 Q41 61 47 56" stroke="#FFFFFF" strokeWidth="2.2" fill="none" strokeLinecap="round" />
          <path d="M73 56 Q79 61 85 56" stroke="#FFFFFF" strokeWidth="2.2" fill="none" strokeLinecap="round" />
        </>
      ) : (
        <g className="panda-eyes">
          <g className="panda-eye" style={{ transformOrigin: '41px 56px' }}>
            <circle cx="41" cy="56" r="6.4" fill="#FFFFFF" />
            <circle cx="42.5" cy="57.5" r="3.6" fill="#26212F" />
            <circle cx="40.5" cy="55" r="1.4" fill="#FFFFFF" />
          </g>
          <g className="panda-eye" style={{ transformOrigin: '79px 56px' }}>
            <circle cx="79" cy="56" r="6.4" fill="#FFFFFF" />
            <circle cx="80.5" cy="57.5" r="3.6" fill="#26212F" />
            <circle cx="78.5" cy="55" r="1.4" fill="#FFFFFF" />
          </g>
        </g>
      )}

      {/* blush */}
      <circle cx="26" cy="70" r="6.5" fill="#F7C9D6" opacity="0.8" />
      <circle cx="94" cy="70" r="6.5" fill="#F7C9D6" opacity="0.8" />

      {/* nose + mouth */}
      <ellipse cx="60" cy="72" rx="4" ry="3" fill="#2B2733" />
      {asleep ? (
        <path d="M54 80 Q60 82 66 80" stroke="#2B2733" strokeWidth="2" fill="none" strokeLinecap="round" />
      ) : (
        <>
          <path d="M52 78 Q60 86 68 78" stroke="#2B2733" strokeWidth="2.4" fill="none" strokeLinecap="round" />
          <path d="M58 80 Q60 85 62 80 Z" fill="#F0728B" />
        </>
      )}

      {/* paws */}
      <ellipse cx="34" cy="98" rx="11" ry="9" fill="#2B2733" />
      <ellipse
        cx="86"
        cy="98"
        rx="11"
        ry="9"
        fill="#2B2733"
        className={armUp ? 'panda-wave-arm' : undefined}
        style={armUp ? { transformOrigin: '86px 98px' } : undefined}
      />

      {/* held leaf (skipped in welcome pose so the raised paw reads as a wave) */}
      {!armUp && (
        <path d="M52 92 Q60 84 68 92 L66 100 Q60 96 54 100 Z" fill="#7FBE8F" />
      )}
    </svg>
  );
}
