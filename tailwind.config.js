/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        cinzel: ['Cinzel', 'serif'],
        sans:   ['Inter', 'ui-sans-serif', 'system-ui'],
      },
      colors: {
        // Remappé sur les tokens du design spec (backward compat MonsterForm)
        parchment: {
          100: '#e8d5a3',
          200: '#e8d5a3',
          300: '#e8d5a3',
          400: '#b8a87a',
          500: '#7a6e52',
          600: '#7a6e52',
          700: '#c87d2a',
          800: '#8b5520',
          900: '#1f1508',
        },
        shadow: {
          900: '#0d0c0a',
          800: '#131109',
          700: '#1a1712',
          600: '#332d21',
          500: '#3d3628',
          400: '#221e17',
          300: '#2a251c',
        },
        // Namespace sym — tokens spec complets
        sym: {
          bg:      '#0d0c0a',
          bg1:     '#131109',
          bg2:     '#1a1712',
          bg3:     '#221e17',
          bg4:     '#2a251c',
          border:  '#332d21',
          border2: '#3d3628',
          text:    '#e8d5a3',
          text2:   '#b8a87a',
          text3:   '#7a6e52',
          amber:   '#c87d2a',
          amber2:  '#e8952a',
          adim:    '#8b5520',
          abg:     '#1f1508',
          red:     '#c84040',
          blue:    '#4a7ab5',
          green:   '#5a8a3a',
        },
      },
      gridTemplateColumns: {
        detail: '240px 1fr 280px',
      },
    },
  },
  plugins: [],
}
