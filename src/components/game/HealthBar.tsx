import { getHealthColor } from '../../lib/gameEngine'

interface HealthBarProps {
  health: number   // 0–100
}

export default function HealthBar({ health }: HealthBarProps) {
  const color    = getHealthColor(health)
  const isCrit   = health <= 30
  const isWarn   = health <= 60 && health > 30

  const gradient = isCrit
    ? `linear-gradient(to right, #7f1d1d, ${color})`
    : isWarn
      ? `linear-gradient(to right, #854d0e, ${color})`
      : `linear-gradient(to right, #14532d, ${color})`

  return (
    <div className="flex items-center gap-2 min-w-[160px]">
      {/* Wand icon */}
      <span className="text-xl select-none" aria-hidden>🪄</span>

      <div className="flex-1 flex flex-col gap-0.5">
        <div className="flex justify-between items-center mb-0.5">
          <span className="text-hp-gold/70 text-[10px] font-hp-score uppercase tracking-wider">
            Health
          </span>
          <span
            className="text-[10px] font-hp-score font-bold"
            style={{ color }}
          >
            {health}%
          </span>
        </div>

        {/* Bar track */}
        <div className="health-bar-track">
          <div
            className="health-bar-fill"
            style={{
              width:            `${health}%`,
              background:       gradient,
              boxShadow:        `0 0 8px ${color}66`,
              animation:        isCrit ? 'pulseRed 0.8s ease-in-out infinite' : undefined,
            }}
          />
          {/* Segment markers every 10% */}
          {Array.from({ length: 9 }, (_, i) => (
            <div
              key={i}
              className="absolute top-0 bottom-0 w-px bg-hp-navy/60"
              style={{ left: `${(i + 1) * 10}%` }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
