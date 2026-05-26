/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        role: {
          student: { DEFAULT: '#10B981', fg: '#064E3B' },
          teacher: { DEFAULT: '#F59E0B', fg: '#78350F' },
          admin:   { DEFAULT: '#6366F1', fg: '#312E81' },
        },
        ui: { bg: '#0B1021', card: '#111833', soft: '#0E1530', border: '#1F2A4A' },
      },
      boxShadow: {
        soft: '0 8px 30px rgba(17, 24, 51, 0.35)',
        glow: '0 0 0 1px rgba(99,102,241,0.35), 0 8px 20px rgba(99,102,241,0.25)',
      },
      backgroundImage: {
        mesh: 'radial-gradient(1200px 600px at 10% 10%, rgba(99,102,241,.18), transparent 60%), radial-gradient(900px 450px at 80% 20%, rgba(16,185,129,.12), transparent 55%), radial-gradient(900px 450px at 50% 90%, rgba(245,158,11,.12), transparent 55%)',
      },
    },
  },
  plugins: [],
}
