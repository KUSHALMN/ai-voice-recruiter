/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: '#F8FAFC',
        card: '#FFFFFF',
        primary: '#1E293B',
        accent: '#3B82F6',
        secondary: '#64748B',
        success: '#10B981',
        border: '#E2E8F0',
        'admin-accent': '#3B82F6',
        'user-accent': '#10B981',
        'gradient-start': '#EEF2FF',
        'gradient-end': '#F0FDF4',
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-accent': 'pulseAccent 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        pulseAccent: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
      },
      boxShadow: {
        'card': '0 4px 12px rgba(0, 0, 0, 0.15)',
        'card-hover': '0 8px 24px rgba(0, 0, 0, 0.25)',
        'button': '0 2px 8px rgba(59, 130, 246, 0.15)',
      },
    },
  },
  plugins: [],
}