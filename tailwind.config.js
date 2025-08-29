/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        'serif': ['Playfair Display', 'serif'],
        'sans': ['Inter', 'sans-serif'],
        'vintage': ['Crimson Text', 'serif'],
      },
      colors: {
        vintage: {
          // Warm Creams and Papers
          cream: '#faf6f0',
          paper: '#f4f0e8',
          sepia: '#f0ead6',
          
          // Rich Browns and Blacks
          black: '#2c1810',
          brown: '#8b4513',
          coffee: '#6f4e37',
          
          // Elegant Golds and Greens
          gold: '#daa520',
          brass: '#b5651d',
          green: '#556b2f',
          
          // Soft Accents
          red: '#a0522d',
          blue: '#4682b4',
        },
        dark: {
          bg: '#0f0f0f',
          card: '#1a1a1a',
          border: '#2a2a2a',
          text: '#e5e5e5',
          muted: '#a0a0a0',
          accent: '#daa520',
        }
      },
      animation: {
        'fade-in': 'fadeIn 1s ease-in-out',
        'slide-up': 'slideUp 0.8s ease-out',
        'float': 'float 6s ease-in-out infinite',
        'scroll': 'scroll 60s linear infinite',
        'glow': 'glow 3s ease-in-out infinite alternate',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(50px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        scroll: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-100%)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(218, 165, 32, 0.3)' },
          '100%': { boxShadow: '0 0 40px rgba(218, 165, 32, 0.6)' },
        },
      },
      boxShadow: {
        'vault': '0 8px 32px rgba(42, 42, 42, 0.12)',
        'vault-lg': '0 16px 48px rgba(42, 42, 42, 0.15)',
        'glow': '0 0 20px rgba(201, 168, 118, 0.3)',
      }
    },
  },
  plugins: [],
}
