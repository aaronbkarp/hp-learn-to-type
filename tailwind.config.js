/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'hp-navy':       '#1a0a2e',
        'hp-purple':     '#2d1b69',
        'hp-gold':       '#c9a84c',
        'hp-gold-light': '#f0d080',
        'hp-crimson':    '#8b0000',
        'hp-teal':       '#00f5d4',
        'hp-dark':       '#0d0720',
      },
      fontFamily: {
        'hp-heading': ['Cinzel', 'serif'],
        'hp-score':   ['"Press Start 2P"', 'monospace'],
        'hp-body':    ['"Crimson Text"', 'serif'],
      },
      animation: {
        'twinkle':     'twinkle 2s ease-in-out infinite',
        'float':       'float 3s ease-in-out infinite',
        'pulse-gold':  'pulseGold 1.5s ease-in-out infinite',
        'pulse-red':   'pulseRed 0.8s ease-in-out infinite',
        'sparkle-out': 'sparkleOut 0.6s ease-out forwards',
        'smoke-out':   'smokeOut 0.8s ease-out forwards',
        'slide-up':    'slideUp 0.4s ease-out forwards',
        'star-fall':   'starFall 1s ease-out forwards',
        'firework':    'firework 0.8s ease-out forwards',
      },
      keyframes: {
        twinkle: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%':      { opacity: '0.2', transform: 'scale(0.4)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-8px)' },
        },
        pulseGold: {
          '0%, 100%': { boxShadow: '0 0 8px #c9a84c, 0 0 16px #c9a84c44' },
          '50%':      { boxShadow: '0 0 20px #c9a84c, 0 0 40px #c9a84c88' },
        },
        pulseRed: {
          '0%, 100%': { boxShadow: '0 0 8px #ef4444, 0 0 16px #ef444444' },
          '50%':      { boxShadow: '0 0 20px #ef4444, 0 0 40px #ef444488' },
        },
        sparkleOut: {
          '0%':   { transform: 'scale(0) rotate(0deg)', opacity: '1' },
          '60%':  { transform: 'scale(1.4) rotate(180deg)', opacity: '0.8' },
          '100%': { transform: 'scale(2) rotate(360deg)', opacity: '0' },
        },
        smokeOut: {
          '0%':   { transform: 'scale(0.5)', opacity: '0.9', filter: 'blur(0px)' },
          '100%': { transform: 'scale(3)', opacity: '0', filter: 'blur(10px)' },
        },
        slideUp: {
          '0%':   { transform: 'translateY(0)', opacity: '1' },
          '100%': { transform: 'translateY(-60px)', opacity: '0' },
        },
        starFall: {
          '0%':   { transform: 'translate(0, 0) scale(1)', opacity: '1' },
          '100%': { transform: 'translate(var(--tx), var(--ty)) scale(0)', opacity: '0' },
        },
        firework: {
          '0%':   { transform: 'scale(0)', opacity: '1' },
          '50%':  { transform: 'scale(1.5)', opacity: '0.8' },
          '100%': { transform: 'scale(2.5)', opacity: '0' },
        },
      },
    },
  },
  plugins: [],
}
