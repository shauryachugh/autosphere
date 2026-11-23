/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          950: '#07090E',
          900: '#0B0F17',
          850: '#101726',
          800: '#162034',
          750: '#1C2942',
          700: '#233352',
          600: '#33476D',
        },
        electric: {
          blue: '#00D2FF',
          sky: '#38BDF8',
          deep: '#0284C7',
          glow: 'rgba(0, 210, 255, 0.15)',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace'],
      },
      boxShadow: {
        'glow-blue': '0 0 24px -4px rgba(0, 210, 255, 0.22)',
        'glow-subtle': '0 0 16px -2px rgba(56, 189, 248, 0.12)',
        'card': '0 4px 20px -2px rgba(0, 0, 0, 0.5)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
}
