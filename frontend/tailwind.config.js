/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          900: '#0a1628',
          800: '#0f1f3a',
          700: '#1a2942',
        },
        cyan: {
          400: '#00ffcc',
          500: '#00e6b8',
        },
        neon: {
          green: '#00ff88',
          cyan: '#00ffcc',
          blue: '#00ccff',
        }
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { 
            boxShadow: '0 0 5px rgba(0, 255, 204, 0.5), 0 0 10px rgba(0, 255, 204, 0.3)',
          },
          '100%': { 
            boxShadow: '0 0 10px rgba(0, 255, 204, 0.8), 0 0 20px rgba(0, 255, 204, 0.5)',
          },
        },
      },
    },
  },
  plugins: [],
}
