import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  House,
  HOUSES,
  QUIZ_QUESTIONS,
  calculateHouse,
  QuizAnswer,
} from '../../lib/houseData'

interface HouseSortingQuizProps {
  onSorted: (house: House) => void
}

// ---- Intro screen ----
function IntroScreen({ onBegin }: { onBegin: () => void }) {
  return (
    <motion.div
      key="intro"
      className="flex flex-col items-center justify-center text-center max-w-md mx-auto px-6"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.6 }}
    >
      <motion.div
        animate={{ rotate: [-5, 5, -3, 3, 0], y: [0, -8, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        className="text-7xl mb-6 select-none"
      >
        🎩
      </motion.div>

      <h1 className="font-hp-heading text-4xl text-hp-gold text-glow-gold mb-3">
        The Sorting Ceremony
      </h1>
      <p className="font-hp-body text-white/70 mb-2 italic text-lg">
        "Hmm… difficult. Very difficult."
      </p>
      <p className="font-hp-body text-white/50 mb-8 text-sm leading-relaxed">
        The Sorting Hat gazes deep into your soul. Answer five questions truthfully
        and it shall reveal which house you truly belong to.
      </p>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.97 }}
        onClick={onBegin}
        className="btn-hp-primary px-10 py-4 text-lg"
      >
        Put on the Hat ✨
      </motion.button>
    </motion.div>
  )
}

// ---- Single question screen ----
function QuestionScreen({
  questionIndex,
  total,
  onAnswer,
}: {
  questionIndex: number
  total: number
  onAnswer: (answer: QuizAnswer) => void
}) {
  const q = QUIZ_QUESTIONS[questionIndex]
  const [selected, setSelected] = useState<number | null>(null)

  const handleSelect = (i: number) => {
    if (selected !== null) return
    setSelected(i)
    setTimeout(() => onAnswer(q.answers[i]), 500)
  }

  return (
    <motion.div
      key={`q-${questionIndex}`}
      className="flex flex-col items-center text-center max-w-lg mx-auto px-6 w-full"
      initial={{ opacity: 0, x: 60 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -60 }}
      transition={{ duration: 0.4 }}
    >
      {/* Progress dots */}
      <div className="flex gap-2 mb-8">
        {Array.from({ length: total }).map((_, i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full transition-all duration-300"
            style={{
              background: i <= questionIndex ? '#c9a84c' : 'rgba(201,168,76,0.2)',
              transform:  i === questionIndex ? 'scale(1.4)' : 'scale(1)',
            }}
          />
        ))}
      </div>

      <p className="text-hp-gold/50 font-hp-score text-xs mb-3 tracking-widest uppercase">
        Question {questionIndex + 1} of {total}
      </p>

      <h2 className="font-hp-heading text-2xl text-white mb-8 leading-snug">
        {q.question}
      </h2>

      <div className="flex flex-col gap-3 w-full">
        {q.answers.map((answer, i) => {
          const isSelected = selected === i
          return (
            <motion.button
              key={i}
              whileHover={selected === null ? { scale: 1.02, x: 4 } : {}}
              whileTap={selected === null ? { scale: 0.98 } : {}}
              onClick={() => handleSelect(i)}
              disabled={selected !== null}
              className="text-left px-5 py-4 rounded-xl border font-hp-body text-sm transition-all duration-200"
              style={{
                background:  isSelected ? 'rgba(201,168,76,0.2)' : 'rgba(26,10,46,0.6)',
                borderColor: isSelected ? '#c9a84c' : 'rgba(201,168,76,0.25)',
                color:       isSelected ? '#c9a84c' : 'rgba(255,255,255,0.75)',
                cursor:      selected !== null ? 'default' : 'pointer',
              }}
            >
              {answer.text}
            </motion.button>
          )
        })}
      </div>
    </motion.div>
  )
}

// ---- Reveal screen ----
function RevealScreen({
  house,
  onContinue,
}: {
  house: House
  onContinue: () => void
}) {
  const meta = HOUSES[house]

  return (
    <motion.div
      key="reveal"
      className="flex flex-col items-center justify-center text-center max-w-md mx-auto px-6"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      {/* House banner */}
      <motion.div
        className="relative w-48 h-48 rounded-full flex items-center justify-center mb-6"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.3, type: 'spring', stiffness: 200, damping: 15 }}
        style={{
          background: `radial-gradient(circle, ${meta.colors.primary}cc, ${meta.colors.primary}44)`,
          border: `3px solid ${meta.colors.secondary}`,
          boxShadow: `0 0 60px ${meta.colors.primary}88, 0 0 20px ${meta.colors.secondary}44`,
        }}
      >
        <span className="text-7xl">{meta.crest}</span>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <p className="font-hp-body text-white/60 italic mb-1 text-sm">
          "After careful deliberation…"
        </p>
        <h1
          className="font-hp-heading text-5xl font-bold mb-2"
          style={{ color: meta.colors.secondary, textShadow: `0 0 20px ${meta.colors.secondary}88` }}
        >
          {meta.name}!
        </h1>
        <p className="font-hp-body text-white/50 text-sm mb-1">{meta.traits}</p>
        <p className="font-hp-body text-white/30 text-xs italic mb-2">
          Founded by {meta.founder}
        </p>
        <p className="font-hp-body text-white/40 text-xs mb-8">{meta.motto}</p>
      </motion.div>

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.0 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.97 }}
        onClick={onContinue}
        className="btn-hp-primary px-10 py-4 text-lg"
        style={{
          background: `linear-gradient(135deg, ${meta.colors.primary}, ${meta.colors.primary}cc)`,
          borderColor: meta.colors.secondary,
        }}
      >
        Enter Hogwarts →
      </motion.button>
    </motion.div>
  )
}

// ---- Main component ----
type Phase = 'intro' | 'questions' | 'reveal'

export default function HouseSortingQuiz({ onSorted }: HouseSortingQuizProps) {
  const [phase, setPhase]           = useState<Phase>('intro')
  const [questionIndex, setIndex]   = useState(0)
  const [answers, setAnswers]       = useState<House[]>([])
  const [result, setResult]         = useState<House | null>(null)

  const handleBegin = () => setPhase('questions')

  const handleAnswer = (answer: QuizAnswer) => {
    const newAnswers = [...answers, answer.house]
    setAnswers(newAnswers)

    if (questionIndex + 1 < QUIZ_QUESTIONS.length) {
      setIndex(i => i + 1)
    } else {
      const house = calculateHouse(newAnswers)
      setResult(house)
      setPhase('reveal')
    }
  }

  const handleContinue = () => {
    if (result) onSorted(result)
  }

  return (
    <div
      className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{ background: 'radial-gradient(ellipse at center top, #1a0a30 0%, #0d0720 60%)' }}
    >
      {/* Subtle animated stars */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        {Array.from({ length: 60 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white animate-twinkle"
            style={{
              top:              `${Math.random() * 100}%`,
              left:             `${Math.random() * 100}%`,
              width:            `${Math.random() * 2 + 0.5}px`,
              height:           `${Math.random() * 2 + 0.5}px`,
              animationDelay:   `${Math.random() * 4}s`,
              animationDuration:`${Math.random() * 2 + 1.5}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 w-full max-w-lg px-4 py-12">
        <AnimatePresence mode="wait">
          {phase === 'intro' && (
            <IntroScreen key="intro" onBegin={handleBegin} />
          )}
          {phase === 'questions' && (
            <QuestionScreen
              key={`q-${questionIndex}`}
              questionIndex={questionIndex}
              total={QUIZ_QUESTIONS.length}
              onAnswer={handleAnswer}
            />
          )}
          {phase === 'reveal' && result && (
            <RevealScreen key="reveal" house={result} onContinue={handleContinue} />
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
