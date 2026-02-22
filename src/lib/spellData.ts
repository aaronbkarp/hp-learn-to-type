export interface Spell {
  name: string
  displayName: string       // Text shown as it falls (sometimes abbreviated)
  description: string       // Shown in success effect popup
  category: 'charm' | 'jinx' | 'hex' | 'curse' | 'transfiguration' | 'other'
  difficulty: 1 | 2 | 3    // Visual length complexity
}

export type SpellsByLetter = Record<string, Spell[]>

// All spells organized by their FIRST LETTER (uppercase key).
// Letters with no canonical HP spells use HP-style invented incantations
// marked with category: 'other' — shown with a ✨ in the UI.
export const SPELLS_BY_LETTER: SpellsByLetter = {
  A: [
    { name: 'Accio',            displayName: 'Accio',           description: 'Summoning Charm!',          category: 'charm',           difficulty: 1 },
    { name: 'Alohomora',        displayName: 'Alohomora',       description: 'Unlocking Charm!',          category: 'charm',           difficulty: 2 },
    { name: 'Aguamenti',        displayName: 'Aguamenti',       description: 'Water-Making Spell!',       category: 'charm',           difficulty: 2 },
    { name: 'Ascendio',         displayName: 'Ascendio',        description: 'Ascension Charm!',          category: 'charm',           difficulty: 2 },
    { name: 'Aparecium',        displayName: 'Aparecium',       description: 'Revealing Spell!',          category: 'charm',           difficulty: 2 },
    { name: 'Avifors',          displayName: 'Avifors',         description: 'Bird Transformation!',      category: 'transfiguration', difficulty: 2 },
    { name: 'Alarte Ascendare', displayName: 'Alarte',          description: 'Shooting-Up Spell!',        category: 'charm',           difficulty: 3 },
    { name: 'Arania Exumai',    displayName: 'Arania',          description: 'Spider-Banishing Spell!',   category: 'jinx',            difficulty: 3 },
  ],
  S: [
    { name: 'Stupefy',          displayName: 'Stupefy',         description: 'Stunning Spell!',           category: 'charm',           difficulty: 1 },
    { name: 'Silencio',         displayName: 'Silencio',        description: 'Silencing Charm!',          category: 'charm',           difficulty: 2 },
    { name: 'Sonorus',          displayName: 'Sonorus',         description: 'Amplifying Charm!',         category: 'charm',           difficulty: 2 },
    { name: 'Scourgify',        displayName: 'Scourgify',       description: 'Scouring Charm!',           category: 'charm',           difficulty: 2 },
    { name: 'Skurge',           displayName: 'Skurge',          description: 'Ectoplasm Removing Charm!', category: 'charm',           difficulty: 1 },
    { name: 'Sectumsempra',     displayName: 'Sectumsempra',    description: 'Slashing Spell!',           category: 'hex',             difficulty: 3 },
    { name: 'Serpensortia',     displayName: 'Serpensortia',    description: 'Snake Conjuring Spell!',    category: 'transfiguration', difficulty: 3 },
    { name: 'Specialis Revelio',displayName: 'Specialis',       description: "Scarpin's Spell!",          category: 'charm',           difficulty: 3 },
  ],
  D: [
    { name: 'Duro',             displayName: 'Duro',            description: 'Hardening Charm!',          category: 'charm',           difficulty: 1 },
    { name: 'Depulso',          displayName: 'Depulso',         description: 'Banishing Charm!',          category: 'charm',           difficulty: 2 },
    { name: 'Diffindo',         displayName: 'Diffindo',        description: 'Severing Charm!',           category: 'charm',           difficulty: 2 },
    { name: 'Deletrius',        displayName: 'Deletrius',       description: 'Erasing Spell!',            category: 'charm',           difficulty: 2 },
    { name: 'Descendo',         displayName: 'Descendo',        description: 'Descending Spell!',         category: 'charm',           difficulty: 2 },
    { name: 'Dissendium',       displayName: 'Dissendium',      description: 'Opening Spell!',            category: 'charm',           difficulty: 3 },
    { name: 'Defodio',          displayName: 'Defodio',         description: 'Gouging Spell!',            category: 'charm',           difficulty: 2 },
  ],
  F: [
    { name: 'Finite',           displayName: 'Finite',          description: 'Counter-Spell!',            category: 'charm',           difficulty: 1 },
    { name: 'Fumos',            displayName: 'Fumos',           description: 'Smoke Screen Charm!',       category: 'charm',           difficulty: 1 },
    { name: 'Flipendo',         displayName: 'Flipendo',        description: 'Knockback Jinx!',           category: 'jinx',            difficulty: 2 },
    { name: 'Ferula',           displayName: 'Ferula',          description: 'Bandaging Spell!',          category: 'charm',           difficulty: 2 },
    { name: 'Flagrante',        displayName: 'Flagrante',       description: 'Hot-Branding Jinx!',        category: 'jinx',            difficulty: 2 },
    { name: 'Furnunculus',      displayName: 'Furnunculus',     description: 'Pimple Jinx!',              category: 'jinx',            difficulty: 3 },
  ],
  J: [
    // No canonical HP spells start with J — using HP-style invented incantations
    { name: 'Jaculatus',        displayName: 'Jaculatus',       description: 'Throwing Jinx! ✨',         category: 'other',           difficulty: 3 },
    { name: 'Jubilate',         displayName: 'Jubilate',        description: 'Joyful Charm! ✨',          category: 'other',           difficulty: 3 },
  ],
  K: [
    // No canonical HP spells start with K
    { name: 'Kaligos',          displayName: 'Kaligos',         description: 'Binding Charm! ✨',         category: 'other',           difficulty: 2 },
    { name: 'Kronimus',         displayName: 'Kronimus',        description: 'Time-Slowing Charm! ✨',    category: 'other',           difficulty: 3 },
  ],
  L: [
    { name: 'Lumos',            displayName: 'Lumos',           description: 'Wand-Lighting Charm!',      category: 'charm',           difficulty: 1 },
    { name: 'Legilimens',       displayName: 'Legilimens',      description: 'Mind-Reading Spell!',       category: 'charm',           difficulty: 3 },
    { name: 'Levicorpus',       displayName: 'Levicorpus',      description: 'Dangling Jinx!',            category: 'jinx',            difficulty: 3 },
    { name: 'Locomotor',        displayName: 'Locomotor',       description: 'Locomotion Charm!',         category: 'charm',           difficulty: 3 },
    { name: 'Liberacorpus',     displayName: 'Liberacorpus',    description: 'Liberating Spell!',         category: 'charm',           difficulty: 3 },
    { name: 'Lacarnum Inflamarae', displayName: 'Lacarnum',     description: 'Cloak-Igniting Charm!',     category: 'charm',           difficulty: 3 },
  ],
  E: [
    { name: 'Episkey',          displayName: 'Episkey',         description: 'Healing Spell!',            category: 'charm',           difficulty: 2 },
    { name: 'Erecto',           displayName: 'Erecto',          description: 'Tent-Raising Spell!',       category: 'charm',           difficulty: 2 },
    { name: 'Evanesco',         displayName: 'Evanesco',        description: 'Vanishing Spell!',          category: 'transfiguration', difficulty: 2 },
    { name: 'Engorgio',         displayName: 'Engorgio',        description: 'Engorgement Charm!',        category: 'charm',           difficulty: 2 },
    { name: 'Expulso',          displayName: 'Expulso',         description: 'Blasting Spell!',           category: 'charm',           difficulty: 2 },
    { name: 'Expelliarmus',     displayName: 'Expelliarmus',    description: 'Disarming Charm!',          category: 'charm',           difficulty: 3 },
    { name: 'Expecto Patronum', displayName: 'Expecto Patronum',description: 'Patronus Charm!',           category: 'charm',           difficulty: 3 },
  ],
  R: [
    { name: 'Reparo',           displayName: 'Reparo',          description: 'Mending Charm!',            category: 'charm',           difficulty: 2 },
    { name: 'Reducio',          displayName: 'Reducio',         description: 'Shrinking Charm!',          category: 'charm',           difficulty: 2 },
    { name: 'Reducto',          displayName: 'Reducto',         description: 'Reductor Curse!',           category: 'curse',           difficulty: 2 },
    { name: 'Relashio',         displayName: 'Relashio',        description: 'Revulsion Jinx!',           category: 'jinx',            difficulty: 2 },
    { name: 'Repello',          displayName: 'Repello',         description: 'Repelling Charm!',          category: 'charm',           difficulty: 2 },
    { name: 'Riddikulus',       displayName: 'Riddikulus',      description: 'Boggart-Banishing Spell!',  category: 'charm',           difficulty: 3 },
    { name: 'Rictusempra',      displayName: 'Rictusempra',     description: 'Tickling Charm!',           category: 'charm',           difficulty: 3 },
  ],
  T: [
    { name: 'Tergeo',           displayName: 'Tergeo',          description: 'Wiping Spell!',             category: 'charm',           difficulty: 2 },
    { name: 'Tempus',           displayName: 'Tempus',          description: 'Time-Telling Spell!',       category: 'charm',           difficulty: 2 },
    { name: 'Tarantallegra',    displayName: 'Tarantallegra',   description: 'Dancing Jinx!',             category: 'jinx',            difficulty: 3 },
  ],
  Y: [
    // Very few HP spells start with Y
    { name: 'Yolanda',          displayName: 'Yolanda',         description: 'Mischief Jinx! ✨',         category: 'other',           difficulty: 3 },
    { name: 'Yclept',           displayName: 'Yclept',          description: 'Naming Charm! ✨',          category: 'other',           difficulty: 2 },
  ],
  U: [
    { name: 'Undio',            displayName: 'Undio',           description: 'Untying Spell! ✨',         category: 'other',           difficulty: 2 },
    { name: 'Unoffendo',        displayName: 'Unoffendo',       description: 'Peace Charm! ✨',           category: 'other',           difficulty: 3 },
  ],
  I: [
    { name: 'Incendio',         displayName: 'Incendio',        description: 'Fire-Making Spell!',        category: 'charm',           difficulty: 2 },
    { name: 'Inflatus',         displayName: 'Inflatus',        description: 'Inflating Charm!',          category: 'charm',           difficulty: 2 },
    { name: 'Impervius',        displayName: 'Impervius',       description: 'Waterproofing Charm!',      category: 'charm',           difficulty: 3 },
    { name: 'Immobulus',        displayName: 'Immobulus',       description: 'Freezing Charm!',           category: 'charm',           difficulty: 3 },
    { name: 'Impedimenta',      displayName: 'Impedimenta',     description: 'Impediment Jinx!',          category: 'jinx',            difficulty: 3 },
  ],
  O: [
    { name: 'Obscuro',          displayName: 'Obscuro',         description: 'Blindfolding Spell!',       category: 'charm',           difficulty: 2 },
    { name: 'Oppugno',          displayName: 'Oppugno',         description: 'Attack Jinx!',              category: 'jinx',            difficulty: 2 },
    { name: 'Orchideous',       displayName: 'Orchideous',      description: 'Flower Conjuring Spell!',   category: 'charm',           difficulty: 3 },
    { name: 'Obliviate',        displayName: 'Obliviate',       description: 'Memory Charm!',             category: 'charm',           difficulty: 3 },
  ],
  P: [
    { name: 'Pack',             displayName: 'Pack',            description: 'Packing Spell!',            category: 'charm',           difficulty: 1 },
    { name: 'Protego',          displayName: 'Protego',         description: 'Shield Charm!',             category: 'charm',           difficulty: 2 },
    { name: 'Point Me',         displayName: 'Point Me',        description: 'Four-Point Spell!',         category: 'charm',           difficulty: 2 },
    { name: 'Petrificus Totalus',displayName: 'Petrificus',     description: 'Full Body-Bind Curse!',     category: 'curse',           difficulty: 3 },
    { name: 'Piertotum Locomotor',displayName: 'Piertotum',     description: 'Animate Statues Spell!',    category: 'charm',           difficulty: 3 },
    { name: 'Priori Incantatem',displayName: 'Priori',          description: 'Reverse Spell Effect!',     category: 'charm',           difficulty: 3 },
    { name: 'Peskipiksi Pesternomi',displayName: 'Peskipiksi',  description: 'Pixie-Repellent Charm!',    category: 'charm',           difficulty: 3 },
  ],
  Z: [
    // No canonical HP spells start with Z
    { name: 'Zephyrus',         displayName: 'Zephyrus',        description: 'Wind Charm! ✨',            category: 'other',           difficulty: 3 },
    { name: 'Zelus',            displayName: 'Zelus',           description: 'Enthusiasm Charm! ✨',      category: 'other',           difficulty: 2 },
  ],
  X: [
    // No canonical HP spells start with X
    { name: 'Xeronite',         displayName: 'Xeronite',        description: 'Drying Charm! ✨',          category: 'other',           difficulty: 3 },
  ],
  C: [
    { name: 'Cistem Aperio',    displayName: 'Cistem',          description: 'Chest-Opening Spell!',      category: 'charm',           difficulty: 2 },
    { name: 'Confundo',         displayName: 'Confundo',        description: 'Confundus Charm!',          category: 'charm',           difficulty: 2 },
    { name: 'Colloportus',      displayName: 'Colloportus',     description: 'Locking Spell!',            category: 'charm',           difficulty: 3 },
    { name: 'Colovaria',        displayName: 'Colovaria',       description: 'Colour-Changing Charm!',    category: 'charm',           difficulty: 3 },
    { name: 'Confringo',        displayName: 'Confringo',       description: 'Blasting Curse!',           category: 'curse',           difficulty: 3 },
  ],
  V: [
    { name: 'Ventus',           displayName: 'Ventus',          description: 'Wind Charm!',               category: 'charm',           difficulty: 2 },
    { name: 'Vera Verto',       displayName: 'Vera Verto',      description: 'Animal to Cup Charm!',      category: 'transfiguration', difficulty: 2 },
    { name: 'Vipera Evanesca',  displayName: 'Vipera',          description: 'Snake-Vanishing Spell!',    category: 'transfiguration', difficulty: 3 },
    { name: 'Vulnera Sanentur', displayName: 'Vulnera',         description: 'Wound-Healing Spell!',      category: 'charm',           difficulty: 3 },
  ],
  B: [
    { name: 'Bombarda',         displayName: 'Bombarda',        description: 'Explosive Spell!',          category: 'charm',           difficulty: 2 },
    { name: 'Bubble-Head Charm',displayName: 'Bubble-Head',     description: 'Bubble-Head Charm!',        category: 'charm',           difficulty: 2 },
    { name: 'Brackium Emendo',  displayName: 'Brackium',        description: 'Bone-Mending Spell!',       category: 'charm',           difficulty: 3 },
  ],
  N: [
    { name: 'Nox',              displayName: 'Nox',             description: 'Wand-Extinguishing Charm!', category: 'charm',           difficulty: 1 },
    { name: 'Nebulus',          displayName: 'Nebulus',         description: 'Fog-Conjuring Charm!',      category: 'charm',           difficulty: 2 },
    { name: 'Noctua',           displayName: 'Noctua',          description: 'Owl-Summoning Charm!',      category: 'charm',           difficulty: 2 },
  ],
  M: [
    { name: 'Muffliato',        displayName: 'Muffliato',       description: 'Muffling Charm!',           category: 'charm',           difficulty: 3 },
    { name: 'Mobiliarbus',      displayName: 'Mobiliarbus',     description: 'Tree-Moving Charm!',        category: 'charm',           difficulty: 3 },
    { name: 'Mobilicorpus',     displayName: 'Mobilicorpus',    description: 'Body-Moving Charm!',        category: 'charm',           difficulty: 3 },
    { name: 'Meteolojinx',      displayName: 'Meteolojinx',     description: 'Weather Jinx!',             category: 'jinx',            difficulty: 3 },
    { name: 'Melofors',         displayName: 'Melofors',        description: 'Pumpkin-Head Jinx!',        category: 'jinx',            difficulty: 2 },
  ],
  G: [
    { name: 'Glacius',          displayName: 'Glacius',         description: 'Freezing Spell!',           category: 'charm',           difficulty: 2 },
    { name: 'Geminio',          displayName: 'Geminio',         description: 'Doubling Charm!',           category: 'charm',           difficulty: 2 },
    { name: 'Glisseo',          displayName: 'Glisseo',         description: 'Sliding Stairs Spell!',     category: 'charm',           difficulty: 2 },
  ],
  H: [
    { name: 'Homenum Revelio',  displayName: 'Homenum',         description: 'Human-Presence Charm!',     category: 'charm',           difficulty: 3 },
    { name: 'Herbifors',        displayName: 'Herbifors',       description: 'Flower-Growing Jinx!',      category: 'jinx',            difficulty: 2 },
  ],
  Q: [
    { name: 'Quietus',          displayName: 'Quietus',         description: 'Quieting Charm!',           category: 'charm',           difficulty: 2 },
    { name: 'Quadrupedus',      displayName: 'Quadrupedus',     description: 'Four-Legs Spell!',          category: 'transfiguration', difficulty: 3 },
  ],
  W: [
    { name: 'Waddiwasi',        displayName: 'Waddiwasi',       description: 'Unsticking Spell!',         category: 'charm',           difficulty: 2 },
    { name: 'Wingardium Leviosa',displayName: 'Wingardium',     description: 'Levitation Charm!',         category: 'charm',           difficulty: 3 },
  ],
  // Number keys — use potion/ingredient names for levels 8+
  '1': [{ name: 'One',   displayName: '1 - Unicorn Horn',   description: 'First Ingredient!',  category: 'other', difficulty: 1 }],
  '2': [{ name: 'Two',   displayName: '2 - Dragon Scale',   description: 'Second Ingredient!', category: 'other', difficulty: 1 }],
  '3': [{ name: 'Three', displayName: '3 - Boomslang Skin', description: 'Third Ingredient!',  category: 'other', difficulty: 1 }],
  '4': [{ name: 'Four',  displayName: '4 - Lacewing Fly',   description: 'Fourth Ingredient!', category: 'other', difficulty: 1 }],
  '5': [{ name: 'Five',  displayName: '5 - Newt Tail',      description: 'Fifth Ingredient!',  category: 'other', difficulty: 1 }],
  '6': [{ name: 'Six',   displayName: '6 - Flobberworm',    description: 'Sixth Ingredient!',  category: 'other', difficulty: 1 }],
  '7': [{ name: 'Seven', displayName: '7 - Felix Felicis',  description: 'Lucky Number!',      category: 'other', difficulty: 1 }],
  '8': [{ name: 'Eight', displayName: '8 - Mandrake Root',  description: 'Eighth Ingredient!', category: 'other', difficulty: 1 }],
  '9': [{ name: 'Nine',  displayName: '9 - Gillyweed',      description: 'Ninth Ingredient!',  category: 'other', difficulty: 1 }],
  '0': [{ name: 'Zero',  displayName: '0 - Polyjuice Potion',description: 'Master Potion!',    category: 'other', difficulty: 1 }],
}

export function getSpellsForLetters(letters: string[]): Spell[] {
  return letters.flatMap(letter => SPELLS_BY_LETTER[letter.toUpperCase()] ?? [])
}

export function getRandomSpell(letters: string[]): Spell {
  const pool = getSpellsForLetters(letters)
  if (pool.length === 0) throw new Error(`No spells for letters: ${letters.join(', ')}`)
  return pool[Math.floor(Math.random() * pool.length)]
}
