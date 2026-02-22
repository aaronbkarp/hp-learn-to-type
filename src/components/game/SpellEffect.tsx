import { SpellEffect as SpellEffectType } from '../../lib/gameEngine'

interface SpellEffectProps {
  effect: SpellEffectType
}

// Particle positions for success burst (8 particles radiating outward)
const PARTICLE_ANGLES = [0, 45, 90, 135, 180, 225, 270, 315]

export function SpellEffectOverlay({ effect }: SpellEffectProps) {
  if (effect.type === 'success') {
    return (
      <div
        className="absolute pointer-events-none"
        style={{
          left:      `${effect.xPercent}%`,
          top:       `${effect.yPercent}%`,
          transform: 'translate(-50%, -50%)',
          zIndex:    50,
        }}
        aria-hidden
      >
        {/* Spell name that floats upward */}
        <div
          className="absolute text-hp-gold font-hp-heading text-sm font-bold text-glow-gold whitespace-nowrap animate-slide-up"
          style={{ top: '-24px', left: '50%', transform: 'translateX(-50%)' }}
        >
          {effect.description}
        </div>

        {/* Radiating star particles */}
        {PARTICLE_ANGLES.map((angle, i) => {
          const rad  = (angle * Math.PI) / 180
          const dist = 30 + Math.random() * 20
          const tx   = Math.cos(rad) * dist
          const ty   = Math.sin(rad) * dist
          return (
            <div
              key={i}
              className="absolute text-hp-gold animate-star-fall"
              style={{
                '--tx':           `${tx}px`,
                '--ty':           `${ty}px`,
                animationDelay:   `${i * 30}ms`,
                fontSize:         `${8 + Math.random() * 8}px`,
              } as React.CSSProperties}
            >
              ✦
            </div>
          )
        })}

        {/* Central burst ring */}
        <div
          className="absolute rounded-full border-2 border-hp-gold animate-firework"
          style={{
            width:     '40px',
            height:    '40px',
            top:       '-20px',
            left:      '-20px',
          }}
        />
      </div>
    )
  }

  // Miss effect — smoke puff at the bottom
  return (
    <div
      className="absolute pointer-events-none"
      style={{
        left:      `${effect.xPercent}%`,
        top:       `${effect.yPercent}%`,
        transform: 'translate(-50%, -50%)',
        zIndex:    50,
      }}
      aria-hidden
    >
      <div
        className="absolute rounded-full animate-smoke-out"
        style={{
          width:      '30px',
          height:     '30px',
          top:        '-15px',
          left:       '-15px',
          background: 'radial-gradient(circle, rgba(139,0,0,0.7), rgba(80,0,0,0.2))',
        }}
      />
      <div
        className="absolute text-red-400 font-hp-score text-xs animate-slide-up whitespace-nowrap"
        style={{ top: '-30px', left: '50%', transform: 'translateX(-50%)' }}
      >
        MISSED!
      </div>
    </div>
  )
}
