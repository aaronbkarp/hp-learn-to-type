export interface LevelConfig {
  level: number
  name: string
  subtitle: string
  description: string
  newLetters: string[]      // Letters introduced at THIS level
  allLetters: string[]      // Cumulative set of all available letters
  spellsOnScreen: number    // Max simultaneous falling spells
  fallDurationMs: number    // Time for a spell to fall full height (ms)
  spawnIntervalMs: number   // Time between new spell spawns (ms)
  spellsToComplete: number  // Correct hits needed to pass
  requiredAccuracy: number  // Minimum accuracy % (0–100) to pass
  housePoints: number       // Points awarded on completion
  mapIcon: string           // Emoji icon for the level map
  unlockMessage: string     // Shown when level is first unlocked
}

export const LEVEL_CONFIGS: LevelConfig[] = [
  {
    level:            1,
    name:             'The Sorting',
    subtitle:         'Left Home Row',
    description:      'Place your fingers on A, S, D, F and defend Hogwarts!',
    newLetters:       ['A', 'S', 'D', 'F'],
    allLetters:       ['A', 'S', 'D', 'F'],
    spellsOnScreen:   1,
    fallDurationMs:   7000,
    spawnIntervalMs:  4000,
    spellsToComplete: 15,
    requiredAccuracy: 70,
    housePoints:      50,
    mapIcon:          '🎩',
    unlockMessage:    'Welcome to Hogwarts! Your journey begins with A, S, D, and F.',
  },
  {
    level:            2,
    name:             'The Common Room',
    subtitle:         'Right Home Row',
    description:      'Add J, K, L — both hands on the home row!',
    newLetters:       ['J', 'K', 'L'],
    allLetters:       ['A', 'S', 'D', 'F', 'J', 'K', 'L'],
    spellsOnScreen:   1,
    fallDurationMs:   6500,
    spawnIntervalMs:  3800,
    spellsToComplete: 20,
    requiredAccuracy: 70,
    housePoints:      75,
    mapIcon:          '🛋️',
    unlockMessage:    'Both hands on the home row — you\'re a natural!',
  },
  {
    level:            3,
    name:             'The Astronomy Tower',
    subtitle:         'Upper Left Keys',
    description:      'Reach up for E, R, and T — the most-used letters!',
    newLetters:       ['E', 'R', 'T'],
    allLetters:       ['A', 'S', 'D', 'F', 'J', 'K', 'L', 'E', 'R', 'T'],
    spellsOnScreen:   2,
    fallDurationMs:   6000,
    spawnIntervalMs:  3500,
    spellsToComplete: 20,
    requiredAccuracy: 72,
    housePoints:      100,
    mapIcon:          '🔭',
    unlockMessage:    'Reaching for the stars — literally! E, R, T join your arsenal.',
  },
  {
    level:            4,
    name:             'The Owlery',
    subtitle:         'Upper Right Keys',
    description:      'Y, U, I, O, P — the full top row is yours!',
    newLetters:       ['Y', 'U', 'I', 'O', 'P'],
    allLetters:       ['A', 'S', 'D', 'F', 'J', 'K', 'L', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    spellsOnScreen:   2,
    fallDurationMs:   5500,
    spawnIntervalMs:  3200,
    spellsToComplete: 25,
    requiredAccuracy: 74,
    housePoints:      125,
    mapIcon:          '🦉',
    unlockMessage:    'The entire top row is at your command!',
  },
  {
    level:            5,
    name:             'The Dungeons',
    subtitle:         'Lower Left Keys',
    description:      'Reach down for Z, X, C, V — watch your fingers!',
    newLetters:       ['Z', 'X', 'C', 'V'],
    allLetters:       ['A', 'S', 'D', 'F', 'J', 'K', 'L', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', 'Z', 'X', 'C', 'V'],
    spellsOnScreen:   2,
    fallDurationMs:   5000,
    spawnIntervalMs:  3000,
    spellsToComplete: 25,
    requiredAccuracy: 74,
    housePoints:      150,
    mapIcon:          '🧪',
    unlockMessage:    'Even Snape would be impressed! Reaching down with the left hand.',
  },
  {
    level:            6,
    name:             'The Forbidden Forest',
    subtitle:         'Lower Right Keys',
    description:      'B, N, M — the bottom row is complete!',
    newLetters:       ['B', 'N', 'M'],
    allLetters:       ['A', 'S', 'D', 'F', 'J', 'K', 'L', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', 'Z', 'X', 'C', 'V', 'B', 'N', 'M'],
    spellsOnScreen:   3,
    fallDurationMs:   4500,
    spawnIntervalMs:  2800,
    spellsToComplete: 30,
    requiredAccuracy: 76,
    housePoints:      200,
    mapIcon:          '🌲',
    unlockMessage:    'You\'ve explored every row of the keyboard!',
  },
  {
    level:            7,
    name:             'The Great Hall',
    subtitle:         'Completing the Alphabet',
    description:      'G, H, Q, W — the full alphabet is yours!',
    newLetters:       ['G', 'H', 'Q', 'W'],
    allLetters:       ['A', 'S', 'D', 'F', 'J', 'K', 'L', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'G', 'H', 'Q', 'W'],
    spellsOnScreen:   3,
    fallDurationMs:   4000,
    spawnIntervalMs:  2500,
    spellsToComplete: 30,
    requiredAccuracy: 78,
    housePoints:      250,
    mapIcon:          '🏰',
    unlockMessage:    'The whole alphabet at your fingertips — every letter covered!',
  },
  {
    level:            8,
    name:             'The Clock Tower',
    subtitle:         'Number Keys 1–0',
    description:      'Numbers power the most complex potions!',
    newLetters:       ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
    allLetters:       ['A', 'S', 'D', 'F', 'J', 'K', 'L', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'G', 'H', 'Q', 'W', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
    spellsOnScreen:   3,
    fallDurationMs:   3500,
    spawnIntervalMs:  2200,
    spellsToComplete: 35,
    requiredAccuracy: 78,
    housePoints:      300,
    mapIcon:          '⏰',
    unlockMessage:    'Numbers are no match for you! Potions class unlocked.',
  },
  {
    level:            9,
    name:             'Room of Requirement',
    subtitle:         'Speed Challenge',
    description:      'Every letter, faster! The castle needs you!',
    newLetters:       [],
    allLetters:       ['A', 'S', 'D', 'F', 'J', 'K', 'L', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'G', 'H', 'Q', 'W'],
    spellsOnScreen:   4,
    fallDurationMs:   3000,
    spawnIntervalMs:  2000,
    spellsToComplete: 40,
    requiredAccuracy: 80,
    housePoints:      500,
    mapIcon:          '🚪',
    unlockMessage:    'Even Professor McGonagall is impressed! Maximum speed ahead.',
  },
  {
    level:            10,
    name:             'The Final Battle',
    subtitle:         'Speed Master',
    description:      'Full keyboard. Maximum speed. Defend Hogwarts!',
    newLetters:       [],
    allLetters:       ['A', 'S', 'D', 'F', 'J', 'K', 'L', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'G', 'H', 'Q', 'W'],
    spellsOnScreen:   4,
    fallDurationMs:   2000,
    spawnIntervalMs:  1500,
    spellsToComplete: 50,
    requiredAccuracy: 80,
    housePoints:      1000,
    mapIcon:          '⚡',
    unlockMessage:    'You are a true master of the magical keyboard!',
  },
]

export function getLevelConfig(level: number): LevelConfig {
  const config = LEVEL_CONFIGS.find(c => c.level === level)
  if (!config) throw new Error(`No configuration found for level ${level}`)
  return config
}

export function calculateScore(
  spellsTyped: number,
  spellsMissed: number,
  level: number,
  comboStreak: number,
): number {
  const basePointsPerSpell = 10 * level
  const comboMultiplier = 1 + Math.floor(comboStreak / 5) * 0.5
  const accuracyBonus = spellsMissed === 0 ? 1.5 : 1
  return Math.floor(spellsTyped * basePointsPerSpell * comboMultiplier * accuracyBonus)
}

export function didPassLevel(
  spellsTyped: number,
  spellsMissed: number,
  config: LevelConfig,
): boolean {
  const total = spellsTyped + spellsMissed
  const accuracy = total > 0 ? (spellsTyped / total) * 100 : 0
  return spellsTyped >= config.spellsToComplete && accuracy >= config.requiredAccuracy
}

export function getAccuracy(spellsTyped: number, spellsMissed: number): number {
  const total = spellsTyped + spellsMissed
  return total === 0 ? 100 : Math.round((spellsTyped / total) * 100)
}

export function getStars(accuracy: number): 0 | 1 | 2 | 3 {
  if (accuracy >= 95) return 3
  if (accuracy >= 85) return 2
  if (accuracy >= 70) return 1
  return 0
}
