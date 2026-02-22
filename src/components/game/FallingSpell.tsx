import { useEffect, useRef } from 'react'
import { FallingSpellState, getSpellYPercent } from '../../lib/gameEngine'

interface FallingSpellProps {
  spell: FallingSpellState
  now: number
}

export default function FallingSpell({ spell, now }: FallingSpellProps) {
  const divRef = useRef<HTMLDivElement>(null)

  const yPercent = getSpellYPercent(spell, now)
  const isHit    = spell.status === 'hit'
  const isMissed = spell.status === 'missed'

  // Trigger exit animation class then let parent clean up via status
  useEffect(() => {
    const el = divRef.current
    if (!el) return
    if (isHit) {
      el.style.animation = 'spellHitPop 0.4s ease-out forwards'
    } else if (isMissed) {
      el.style.animation = 'spellMissFade 0.5s ease-out forwards'
    }
  }, [isHit, isMissed])

  // Split display name: first letter gold, rest white/silver
  const firstLetter = spell.spell.displayName[0]
  const rest        = spell.spell.displayName.slice(1)

  return (
    <>
      <style>{`
        @keyframes spellHitPop {
          0%   { transform: scale(1);   opacity: 1; }
          50%  { transform: scale(1.4); opacity: 0.8; }
          100% { transform: scale(0);   opacity: 0; }
        }
        @keyframes spellMissFade {
          0%   { transform: translateY(0)    scale(1);   opacity: 0.9; }
          100% { transform: translateY(20px) scale(0.6); opacity: 0; }
        }
        @keyframes spellEntrance {
          0%   { opacity: 0; transform: scale(0.7); }
          100% { opacity: 1; transform: scale(1);   }
        }
      `}</style>

      <div
        ref={divRef}
        className={`spell-card ${spell.isTargeted ? 'targeted' : ''}`}
        style={{
          position:  'absolute',
          top:       `${yPercent}%`,
          left:      `${spell.xPercent}%`,
          transform: 'translateX(-50%)',
          animation: 'spellEntrance 0.25s ease-out',
          zIndex:    spell.isTargeted ? 15 : 10,
          transition: 'top 0ms',   // position updates are driven by RAF, no CSS transition
        }}
        aria-hidden
      >
        {/* Magical ✦ prefix */}
        <span className="text-hp-gold/60 mr-1 text-xs">✦</span>

        {/* First letter highlighted in gold */}
        <span
          className="text-hp-gold font-bold text-base"
          style={{
            textShadow: spell.isTargeted
              ? '0 0 12px #c9a84c, 0 0 24px #c9a84c88'
              : '0 0 6px #c9a84c66',
            fontSize: spell.isTargeted ? '1.15rem' : '1rem',
          }}
        >
          {firstLetter}
        </span>

        {/* Rest of spell name */}
        <span
          className="text-white/80 text-sm font-normal"
          style={{ fontSize: spell.isTargeted ? '0.9rem' : '0.8rem' }}
        >
          {rest}
        </span>

        {/* Targeting arrow/indicator for the active target */}
        {spell.isTargeted && (
          <span
            className="absolute -bottom-3 left-1/2 text-hp-gold text-xs animate-bounce"
            style={{ transform: 'translateX(-50%)' }}
          >
            ▼
          </span>
        )}
      </div>
    </>
  )
}
