import { Spell, getSpellsForLetters } from './spellData'
import { LevelConfig } from './levelConfig'

// ---- Types ----

export type SpellStatus = 'falling' | 'hit' | 'missed'

export interface FallingSpellState {
  id: string
  spell: Spell
  xPercent: number      // Horizontal position as % of game area width (5–92%)
  lane: number          // Which lane column (0–6) prevents horizontal overlap
  startTime: number     // performance.now() when spawned
  fallDurationMs: number
  isTargeted: boolean   // Highlighted as the primary target (lowest spell)
  status: SpellStatus
}

export interface SpellEffect {
  id: string
  type: 'success' | 'miss'
  xPercent: number
  yPercent: number
  spellName: string
  description: string
  timestamp: number
}

export interface GameState {
  isRunning: boolean
  isPaused: boolean
  isGameOver: boolean
  health: number          // 0–100
  score: number
  comboStreak: number
  spellsTyped: number
  spellsMissed: number
  fallingSpells: FallingSpellState[]
  effects: SpellEffect[]
  lastSpawnTime: number
  sessionStartTime: number
}

// ---- Constants ----

export const HEALTH_LOSS_PER_MISS = 10
export const EFFECT_DURATION_MS = 1000
export const NUM_LANES = 7

// ---- Initial state ----

export function createInitialGameState(level: number): GameState {
  void level // used by callers to set up config
  return {
    isRunning:        false,
    isPaused:         false,
    isGameOver:       false,
    health:           100,
    score:            0,
    comboStreak:      0,
    spellsTyped:      0,
    spellsMissed:     0,
    fallingSpells:    [],
    effects:          [],
    lastSpawnTime:    0,
    sessionStartTime: 0,
  }
}

// ---- Progress calculation ----

// Returns 0.0 (just spawned at top) → 1.0 (hit the ground)
export function getSpellProgress(spell: FallingSpellState, now: number): number {
  return Math.min((now - spell.startTime) / spell.fallDurationMs, 1.0)
}

// Returns the y-position as a percentage of game height (0–90%)
export function getSpellYPercent(spell: FallingSpellState, now: number): number {
  return getSpellProgress(spell, now) * 88
}

// ---- Targeting ----

// Returns the falling spell that is furthest down (most dangerous)
export function findLowestSpell(
  spells: FallingSpellState[],
  now: number,
): FallingSpellState | null {
  const falling = spells.filter(s => s.status === 'falling')
  if (falling.length === 0) return null
  return falling.reduce((lowest, s) =>
    getSpellProgress(s, now) > getSpellProgress(lowest, now) ? s : lowest,
  )
}

// ---- Spawning ----

// Lane-to-x-position mapping: spreads spells across 8%–92% of width
function laneToX(lane: number): number {
  return 8 + (lane / (NUM_LANES - 1)) * 82
}

export function spawnSpell(
  config: LevelConfig,
  existingSpells: FallingSpellState[],
  now: number,
): FallingSpellState | null {
  const pool = getSpellsForLetters(config.allLetters)
  if (pool.length === 0) return null

  const activeSpells = existingSpells.filter(s => s.status === 'falling')
  if (activeSpells.length >= config.spellsOnScreen) return null

  // Avoid lanes occupied near the top (progress < 15%) to prevent overlap
  const occupiedLanes = new Set(
    activeSpells
      .filter(s => getSpellProgress(s, now) < 0.15)
      .map(s => s.lane),
  )

  const freeLanes = Array.from({ length: NUM_LANES }, (_, i) => i).filter(
    l => !occupiedLanes.has(l),
  )
  if (freeLanes.length === 0) return null

  const lane = freeLanes[Math.floor(Math.random() * freeLanes.length)]
  const spell = pool[Math.floor(Math.random() * pool.length)]

  return {
    id:            `spell-${now}-${Math.random().toString(36).slice(2, 9)}`,
    spell,
    xPercent:      laneToX(lane),
    lane,
    startTime:     now,
    fallDurationMs: config.fallDurationMs,
    isTargeted:    false,
    status:        'falling',
  }
}

// ---- Key handling ----

export interface KeyPressResult {
  matchedId: string | null
  matchedSpell: Spell | null
}

// Checks a pressed key against falling spells.
// Prioritizes the targeted (lowest) spell; falls back to any match.
export function handleKeyPress(
  key: string,
  spells: FallingSpellState[],
): KeyPressResult {
  const pressed = key.toUpperCase()
  const falling = spells.filter(s => s.status === 'falling')

  // Check targeted spell first
  const targeted = falling.find(s => s.isTargeted)
  if (targeted && targeted.spell.displayName[0].toUpperCase() === pressed) {
    return { matchedId: targeted.id, matchedSpell: targeted.spell }
  }

  // Fall back to any matching spell (allows intentional targeting of others)
  const anyMatch = falling.find(s => s.spell.displayName[0].toUpperCase() === pressed)
  if (anyMatch) {
    return { matchedId: anyMatch.id, matchedSpell: anyMatch.spell }
  }

  return { matchedId: null, matchedSpell: null }
}

// ---- Health ----

export function applyHealthLoss(current: number): number {
  return Math.max(0, current - HEALTH_LOSS_PER_MISS)
}

export function getHealthColor(health: number): string {
  if (health > 60) return '#22c55e'
  if (health > 30) return '#eab308'
  return '#ef4444'
}

// ---- Game loop tick ----
// Returns a new state derived from the current state + current timestamp.
// This is a pure function — no side effects.

export interface TickResult {
  newState: Omit<GameState, 'isRunning' | 'isPaused' | 'sessionStartTime'>
  shouldEnd: boolean
  endReason: 'health' | 'complete' | null
}

export function tickGameState(
  state: GameState,
  config: LevelConfig,
  now: number,
  spellsToComplete: number,
): TickResult {
  let fallingSpells = [...state.fallingSpells]
  let health = state.health
  let spellsMissed = state.spellsMissed
  let effects = state.effects.filter(e => now - e.timestamp < EFFECT_DURATION_MS)
  let lastSpawnTime = state.lastSpawnTime

  // Detect spells that have hit the bottom
  const newlyMissed = fallingSpells.filter(
    s => s.status === 'falling' && getSpellProgress(s, now) >= 1.0,
  )

  for (const missed of newlyMissed) {
    missed.status = 'missed'
    spellsMissed++
    health = applyHealthLoss(health)
    effects = [
      ...effects,
      {
        id:          `miss-${missed.id}`,
        type:        'miss',
        xPercent:    missed.xPercent,
        yPercent:    90,
        spellName:   missed.spell.displayName,
        description: 'Missed!',
        timestamp:   now,
      },
    ]
  }

  // Remove spells whose animations have fully played (500ms grace after hitting)
  fallingSpells = fallingSpells.filter(
    s => !(s.status !== 'falling' && now - s.startTime > s.fallDurationMs + 600),
  )

  // Spawn new spell if interval has elapsed
  const timeSinceSpawn = now - lastSpawnTime
  if (timeSinceSpawn >= config.spawnIntervalMs) {
    const newSpell = spawnSpell(config, fallingSpells, now)
    if (newSpell) {
      fallingSpells = [...fallingSpells, newSpell]
      lastSpawnTime = now
    }
  }

  // Update targeting — highlight the lowest spell
  const lowestId = findLowestSpell(fallingSpells, now)?.id ?? null
  fallingSpells = fallingSpells.map(s => ({ ...s, isTargeted: s.id === lowestId }))

  // Check end conditions
  const isDead = health <= 0
  const isComplete = state.spellsTyped >= spellsToComplete

  const newState = {
    isGameOver:    isDead,
    health,
    score:         state.score,
    comboStreak:   state.comboStreak,
    spellsTyped:   state.spellsTyped,
    spellsMissed,
    fallingSpells,
    effects,
    lastSpawnTime,
  }

  return {
    newState,
    shouldEnd:  isDead || isComplete,
    endReason:  isDead ? 'health' : isComplete ? 'complete' : null,
  }
}
