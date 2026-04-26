/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#ffffff',
        foreground: '#1a1a1a',
        primary: '#2563eb',
        secondary: '#64748b',
        accent: '#06b6d4',
        muted: '#f1f5f9',
        danger: '#ef4444',
        success: '#10b981',
      },
    },
  },
  plugins: [],
}
