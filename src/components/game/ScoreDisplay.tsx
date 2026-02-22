interface ScoreDisplayProps {
  score:       number
  comboStreak: number
  spellsTyped: number
  level:       number
  levelName:   string
}

export default function ScoreDisplay({
  score,
  comboStreak,
  spellsTyped,
  level,
  levelName,
}: ScoreDisplayProps) {
  const showCombo = comboStreak >= 3

  return (
    <div className="flex flex-col gap-0.5">
      {/* Level badge */}
      <div className="flex items-center gap-2">
        <span className="bg-hp-gold/20 border border-hp-gold/40 text-hp-gold text-[10px] font-hp-score px-2 py-0.5 rounded-full">
          LVL {level}
        </span>
        <span className="text-white/50 font-hp-body text-sm italic">{levelName}</span>
      </div>

      {/* Score */}
      <div className="text-hp-gold font-hp-score text-xl text-glow-gold tracking-wider">
        {score.toLocaleString()}
      </div>

      {/* Spells typed count */}
      <div className="text-white/50 text-xs font-hp-body">
        {spellsTyped} spell{spellsTyped !== 1 ? 's' : ''} cast
      </div>

      {/* Combo streak */}
      {showCombo && (
        <div
          className="text-hp-teal text-xs font-hp-score text-glow-teal animate-pulse"
          aria-live="polite"
        >
          ⚡ {comboStreak}× COMBO!
        </div>
      )}
    </div>
  )
}
