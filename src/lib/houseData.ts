export type House = 'gryffindor' | 'hufflepuff' | 'ravenclaw' | 'slytherin'

export interface HouseMeta {
  id: House
  name: string
  crest: string
  colors: { primary: string; secondary: string }
  motto: string
  traits: string
  founder: string
}

export const HOUSES: Record<House, HouseMeta> = {
  gryffindor: {
    id:       'gryffindor',
    name:     'Gryffindor',
    crest:    '🦁',
    colors:   { primary: '#7F0909', secondary: '#FDB813' },
    motto:    'Nerve, Bravery, Chivalry',
    traits:   'Brave • Daring • Chivalrous',
    founder:  'Godric Gryffindor',
  },
  hufflepuff: {
    id:       'hufflepuff',
    name:     'Hufflepuff',
    crest:    '🦡',
    colors:   { primary: '#EEA820', secondary: '#000000' },
    motto:    'Patience, Loyalty, Hard Work',
    traits:   'Loyal • Kind • Just',
    founder:  'Helga Hufflepuff',
  },
  ravenclaw: {
    id:       'ravenclaw',
    name:     'Ravenclaw',
    crest:    '🦅',
    colors:   { primary: '#0E1A40', secondary: '#AEB4BD' },
    motto:    'Wit, Wisdom, Learning',
    traits:   'Clever • Wise • Creative',
    founder:  'Rowena Ravenclaw',
  },
  slytherin: {
    id:       'slytherin',
    name:     'Slytherin',
    crest:    '🐍',
    colors:   { primary: '#1A472A', secondary: '#AAAAAA' },
    motto:    'Ambition, Cunning, Resourcefulness',
    traits:   'Ambitious • Cunning • Resourceful',
    founder:  'Salazar Slytherin',
  },
}

export interface QuizAnswer {
  text: string
  house: House
}

export interface QuizQuestion {
  question: string
  answers: QuizAnswer[]
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    question: 'What do you value above all else?',
    answers: [
      { text: 'Courage — I would rather face danger than hide from it.', house: 'gryffindor' },
      { text: 'Loyalty — I would never abandon a friend in need.',        house: 'hufflepuff' },
      { text: 'Wisdom — Knowledge is the greatest power of all.',         house: 'ravenclaw'  },
      { text: 'Ambition — I will do what it takes to achieve greatness.', house: 'slytherin'  },
    ],
  },
  {
    question: 'Your ideal Saturday at Hogwarts?',
    answers: [
      { text: 'Flying on a broomstick — the faster, the better.',          house: 'gryffindor' },
      { text: 'Helping a younger student who is struggling with lessons.',  house: 'hufflepuff' },
      { text: 'Spending the afternoon deep in the library.',                house: 'ravenclaw'  },
      { text: 'Scheming with my inner circle in the Slytherin common room.',house: 'slytherin'  },
    ],
  },
  {
    question: 'A mountain troll is blocking the corridor. What do you do?',
    answers: [
      { text: 'Charge straight at it — glory awaits the brave.',            house: 'gryffindor' },
      { text: 'Rally my friends and find a way around it together.',        house: 'hufflepuff' },
      { text: 'Study its movements and exploit a weakness.',                house: 'ravenclaw'  },
      { text: 'Let someone else go first, then use the distraction.',       house: 'slytherin'  },
    ],
  },
  {
    question: 'The Sorting Hat peers into your deepest fear. You dread…',
    answers: [
      { text: 'Cowardice — being seen as weak when it matters most.',       house: 'gryffindor' },
      { text: 'Betraying a friend and losing their trust forever.',         house: 'hufflepuff' },
      { text: 'Ignorance — not understanding something important.',         house: 'ravenclaw'  },
      { text: 'Failure — being ordinary when I was meant for more.',        house: 'slytherin'  },
    ],
  },
  {
    question: 'Which would you most hate to be called?',
    answers: [
      { text: 'Weak-willed.',   house: 'gryffindor' },
      { text: 'Cruel-hearted.', house: 'hufflepuff' },
      { text: 'Small-minded.',  house: 'ravenclaw'  },
      { text: 'Ordinary.',      house: 'slytherin'  },
    ],
  },
]

export function calculateHouse(answers: House[]): House {
  const counts: Record<House, number> = {
    gryffindor: 0,
    hufflepuff: 0,
    ravenclaw:  0,
    slytherin:  0,
  }
  for (const h of answers) counts[h]++
  return (Object.keys(counts) as House[]).reduce((a, b) => counts[a] >= counts[b] ? a : b)
}
