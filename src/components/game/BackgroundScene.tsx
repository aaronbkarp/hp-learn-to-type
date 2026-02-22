import { useMemo } from 'react'

interface Star {
  id: number
  top: number
  left: number
  size: number
  delay: number
  duration: number
}

function useStars(count: number): Star[] {
  return useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id:       i,
        top:      Math.random() * 85,   // Keep stars above the castle
        left:     Math.random() * 100,
        size:     Math.random() * 2.5 + 0.5,
        delay:    Math.random() * 5,
        duration: Math.random() * 2.5 + 1.5,
      })),
    [count],
  )
}

// Shooting star that occasionally streaks across the sky
function ShootingStar({ index }: { index: number }) {
  const top  = 10 + (index * 23) % 50
  const delay = index * 7 + 3
  return (
    <div
      className="absolute pointer-events-none"
      style={{
        top:  `${top}%`,
        left: '-5%',
        animation: `shootingStar 2s linear ${delay}s infinite`,
        animationFillMode: 'both',
      }}
      aria-hidden
    >
      <div
        style={{
          width:  '80px',
          height: '1.5px',
          background: 'linear-gradient(to right, transparent, white, transparent)',
          transform: 'rotate(-15deg)',
          opacity: 0.7,
        }}
      />
    </div>
  )
}

export default function BackgroundScene() {
  const stars = useStars(130)

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      {/* Deep space gradient background */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at top, #2d1b69 0%, #1a0a2e 50%, #0d0720 100%)',
        }}
      />

      {/* Nebula / magical glow overlay */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          background:
            'radial-gradient(ellipse at 30% 40%, rgba(201,168,76,0.15) 0%, transparent 60%),' +
            'radial-gradient(ellipse at 70% 20%, rgba(0,245,212,0.1) 0%, transparent 50%)',
        }}
      />

      {/* Twinkling stars */}
      {stars.map(star => (
        <div
          key={star.id}
          className="absolute rounded-full bg-white animate-twinkle"
          style={{
            top:              `${star.top}%`,
            left:             `${star.left}%`,
            width:            `${star.size}px`,
            height:           `${star.size}px`,
            animationDelay:   `${star.delay}s`,
            animationDuration:`${star.duration}s`,
          }}
        />
      ))}

      {/* Occasional shooting stars */}
      {[0, 1, 2].map(i => <ShootingStar key={i} index={i} />)}

      {/* Hogwarts castle silhouette */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1440 180"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full"
          preserveAspectRatio="xMidYMax meet"
        >
          {/* Ground / hill */}
          <ellipse cx="720" cy="220" rx="900" ry="100" fill="#0d0720" />

          {/* Main castle body */}
          <rect x="220"  y="100" width="1000" height="80" fill="#0d0720" />

          {/* Towers — varying heights for silhouette interest */}
          <rect x="220"  y="55"  width="70"  height="125" fill="#0d0720" />
          <rect x="340"  y="30"  width="55"  height="150" fill="#0d0720" />
          <rect x="450"  y="65"  width="50"  height="115" fill="#0d0720" />
          <rect x="560"  y="42"  width="60"  height="138" fill="#0d0720" />
          <rect x="680"  y="15"  width="80"  height="165" fill="#0d0720" />
          <rect x="810"  y="38"  width="55"  height="142" fill="#0d0720" />
          <rect x="920"  y="58"  width="50"  height="122" fill="#0d0720" />
          <rect x="1030" y="32"  width="60"  height="148" fill="#0d0720" />
          <rect x="1150" y="60"  width="70"  height="120" fill="#0d0720" />

          {/* Tower peaks (triangular crenellations) */}
          <polygon points="220,55  255,18  290,55"   fill="#0d0720" />
          <polygon points="340,30  367,2   395,30"   fill="#0d0720" />
          <polygon points="450,65  475,38  500,65"   fill="#0d0720" />
          <polygon points="560,42  590,12  620,42"   fill="#0d0720" />
          <polygon points="680,15  720,0   760,15"   fill="#0d0720" />
          <polygon points="810,38  837,10  865,38"   fill="#0d0720" />
          <polygon points="920,58  945,30  970,58"   fill="#0d0720" />
          <polygon points="1030,32 1060,5  1090,32"  fill="#0d0720" />
          <polygon points="1150,60 1185,30 1220,60"  fill="#0d0720" />

          {/* Glowing amber windows — like candlelight inside */}
          <rect x="357" y="70"  width="12" height="16" fill="#f0d080" opacity="0.55" rx="2" />
          <rect x="470" y="100" width="12" height="16" fill="#f0d080" opacity="0.45" rx="2" />
          <rect x="595" y="80"  width="12" height="16" fill="#f0d080" opacity="0.60" rx="2" />
          <rect x="700" y="50"  width="12" height="16" fill="#f0d080" opacity="0.50" rx="2" />
          <rect x="825" y="75"  width="12" height="16" fill="#f0d080" opacity="0.55" rx="2" />
          <rect x="940" y="95"  width="12" height="16" fill="#f0d080" opacity="0.40" rx="2" />
          <rect x="1048" y="70" width="12" height="16" fill="#f0d080" opacity="0.50" rx="2" />
          <rect x="1165" y="95" width="12" height="16" fill="#f0d080" opacity="0.45" rx="2" />
        </svg>
      </div>

      {/* Shooting star keyframe — injected inline */}
      <style>{`
        @keyframes shootingStar {
          0%   { transform: translateX(0) translateY(0); opacity: 0; }
          5%   { opacity: 0.8; }
          95%  { opacity: 0.5; }
          100% { transform: translateX(110vw) translateY(30px); opacity: 0; }
        }
      `}</style>
    </div>
  )
}
