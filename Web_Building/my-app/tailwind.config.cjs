const plugin = require('tailwindcss/plugin')
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "puck.config.tsx",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./src/**/**/*.{js,ts,jsx,tsx}"
  ],
  darkMode: "class",
  theme: {
    colors: {
      'transparent': 'transparent',
      'black': {
        light: '#525252',
        DEFAULT: '#232323',
        dark: '#141414'
      },
      'red': {
        DEFAULT: '#B43018',
        dark: '#9B2915'
      },
      'white': {
        DEFAULT: '#e9e6e4',
        mid: '#DAD5D2',
        dark: '#C8C1BC',
      },
      'cyan': '#28CCC7',
      'purple': { 
        DEFAULT: '#57035b',
        dark: '#11082a',
      },
      'gold': {
        light: '#B39C4D',
        DEFAULT: '#DEB841',
      },
      adaptive: {
        primary: 'var(--color-primary)',
        primaryAlt: 'var(--color-primary-Alt)',
        secondary: 'var(--color-secondary)',
        secondaryAlt: 'var(--color-secondary-Alt)',
        accent: 'var(--color-accent)',
        accent2: 'var(--color-accent2)',
        accent3: 'var(--color-accent3)',
        backgroundDark: 'var(--color-backgroundDark)',
        backgroundLight: 'var(--color-backgroundLight)',
        selection: {
          text: 'var(--color-selection-text)',
          bg: 'var(--color-selection-bg)'
        }
      }
    },
    fontFamily: {
      sans: ['Inter', "sans-serif"],
      display: ['Space Grotesk', "sans-serif"],
      serif: ['Playfair Display', "serif"],
      other: [
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
        '"Noto Color Emoji"',
      ],
    },
    extend: {
      dropShadow: {
        glowY: [
          "0 0px 20px var(--color-accent3 / 40%)",
          "0 0px 65px var(--color-accent3 / 25%)",
        ],
        glow: [
          "0 0px 20px var(--color-accent / 40%)",
          "0 0px 65px var(--color-accent / 25%)",
        ],
        glowP: [
          "0 0px 20px var(--color-accent2 / 40%)",
          "0 0px 65px var(--color-accent2 / 25%)",
        ],
      },
      fontSize: {
        '2xs': ['0.6rem', { lineHeight: '0.75rem' }],  // 10px with 12px line height
        '3xs': ['0.5rem', { lineHeight: '0.5rem' }]
      },
      scrollSnapType: {
        y: 'y',
        mandatory: 'mandatory',
        proximity: 'proximity'
      },
      scrollSnapType: {
        x: 'x',
        mandatory: 'mandatory',
        proximity: 'proximity'
      },
      scrollSnapAlign: {
        start: 'start',
        normal: 'normal',
      },
      transitionDuration: {
        '400': '400ms',
      },
      boxShadow: {
        slider: "0 0 0 5px rgba(0, 0, 0, 0.3)",
      },
      keyframes: {
        // Dropdown menu
        "scale-in": {
          "0%": { opacity: 0, transform: "scale(0)" },
          "100%": { opacity: 1, transform: "scale(1)" },
        },
        "slide-down": {
          "0%": { opacity: 0, transform: "translateY(-10px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        "slide-up": {
          "0%": { opacity: 0, transform: "translateY(10px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        // Tooltip
        "slide-up-fade": {
          "0%": { opacity: 0, transform: "translateY(2px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        "slide-right-fade": {
          "0%": { opacity: 0, transform: "translateX(-2px)" },
          "100%": { opacity: 1, transform: "translateX(0)" },
        },
        "slide-down-fade": {
          "0%": { opacity: 0, transform: "translateY(-2px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        "slide-left-fade": {
          "0%": { opacity: 0, transform: "translateX(2px)" },
          "100%": { opacity: 1, transform: "translateX(0)" },
        },
        // Navigation menu
        "enter-from-right": {
          "0%": { transform: "translateX(200px)", opacity: 0 },
          "100%": { transform: "translateX(0)", opacity: 1 },
        },
        "enter-from-left": {
          "0%": { transform: "translateX(-200px)", opacity: 0 },
          "100%": { transform: "translateX(0)", opacity: 1 },
        },
        "exit-to-right": {
          "0%": { transform: "translateX(0)", opacity: 1 },
          "100%": { transform: "translateX(200px)", opacity: 0 },
        },
        "exit-to-left": {
          "0%": { transform: "translateX(0)", opacity: 1 },
          "100%": { transform: "translateX(-200px)", opacity: 0 },
        },
        "scale-in-content": {
          "0%": { transform: "rotateX(-30deg) scale(0.9)", opacity: 0 },
          "100%": { transform: "rotateX(0deg) scale(1)", opacity: 1 },
        },
        "scale-out-content": {
          "0%": { transform: "rotateX(0deg) scale(1)", opacity: 1 },
          "100%": { transform: "rotateX(-10deg) scale(0.95)", opacity: 0 },
        },
        "fade-in": {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
        "fade-out": {
          "0%": { opacity: 1 },
          "100%": { opacity: 0 },
        },
        // Toast
        "toast-hide": {
          "0%": { opacity: 1 },
          "100%": { opacity: 0 },
        },
        "toast-slide-in-right": {
          "0%": { transform: "translateX(calc(100% + 1rem))" },
          "100%": { transform: "translateX(0)" },
        },
        "toast-slide-in-bottom": {
          "0%": { transform: "translateY(calc(100% + 1rem))" },
          "100%": { transform: "translateY(0)" },
        },
        "toast-swipe-out-x": {
          "0%": { transform: "translateX(var(--radix-toast-swipe-end-x))" },
          "100%": {
            transform: "translateX(calc(100% + 1rem))",
          },
        },
        "toast-swipe-out-y": {
          "0%": { transform: "translateY(var(--radix-toast-swipe-end-y))" },
          "100%": {
            transform: "translateY(calc(100% + 1rem))",
          },
        },
      },
      animation: {
        // Ticker
        'pause': 'animation-play-state: paused',
        'ticker-scroll': 'ticker-scroll var(--duration) linear infinite var(--direction)',
        // Dropdown menu
        "scale-in": "scale-in 0.2s ease-in-out",
        "slide-down": "slide-down 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
        "slide-up": "slide-up 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
        // Tooltip
        "slide-up-fade": "slide-up-fade 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        "slide-right-fade":
          "slide-right-fade 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        "slide-down-fade": "slide-down-fade 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        "slide-left-fade": "slide-left-fade 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        // Navigation menu
        "enter-from-right": "enter-from-right 0.25s ease",
        "enter-from-left": "enter-from-left 0.25s ease",
        "exit-to-right": "exit-to-right 0.25s ease",
        "exit-to-left": "exit-to-left 0.25s ease",
        "scale-in-content": "scale-in-content 0.2s ease",
        "scale-out-content": "scale-out-content 0.2s ease",
        "fade-in": "fade-in 0.2s ease",
        "fade-out": "fade-out 0.2s ease",
        // Toast
        "toast-hide": "toast-hide 100ms ease-in forwards",
        "toast-slide-in-right":
          "toast-slide-in-right 150ms cubic-bezier(0.16, 1, 0.3, 1)",
        "toast-slide-in-bottom":
          "toast-slide-in-bottom 150ms cubic-bezier(0.16, 1, 0.3, 1)",
        "toast-swipe-out-x": "toast-swipe-out-x 100ms ease-out forwards",
        "toast-swipe-out-y": "toast-swipe-out-y 100ms ease-out forwards",
      },
    },
  },
  variants: {
    extend: { 
      scrollSnapType: ['responsive'],
      scrollSnapAlign: ['responsive']
    },
  },
  plugins: [
    require("@tailwindcss/forms"), 
    require("tailwindcss-radix"), 
    require("@tailwindcss/typography"), 
    require('tailwind-scrollbar-hide'),
    require('tailwindcss-animate'),
    plugin(function({ addBase }) {
      addBase({
        '::selection': {
          backgroundColor: 'var(--color-selection-bg)',
          color: 'var(--color-selection-text)'
        },
        ':root': {
          '--color-primary': '#e9e6e4', // White
          '--color-primary-Alt': '#DAD5D2', // Off-White
          '--color-secondary': '#232323', // Black
          '--color-secondary-Alt': '#525252', // Dark Gray
          '--color-accent': '#9B2915', // Red
          '--color-accent2': '#11082a', // Purple
          '--color-accent3': '#B39C4D', // Gold
        },
        '.dark': {
          '--color-primary': '#232323', // Black
          '--color-primary-Alt': '#525252', // Dark Gray
          '--color-secondary': '#e9e6e4', // White
          '--color-secondary-Alt': '#DAD5D2', // Off-White
          '--color-accent': '#28AFB0', // Cyan
          '--color-accent2': '#57035b', // Purple
          '--color-accent3': '#DEB841', // Gold
        }
      })
    })
  ],
};