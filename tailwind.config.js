/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './App.{ts,tsx}',
    './index.{ts,tsx}',
    './global.css',
    './src/**/*.{ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: '#667EEA',
        secondary: '#764BA2',
        todo: '#667EEA',
        doing: '#F6AD55',
        done: '#68D391',
        lowLoad: '#4ECDC4',
        mediumLoad: '#FFD93D',
        highLoad: '#FF6B6B',
      },
      fontFamily: {
        sans: ['System'],
      },
    },
  },
  plugins: [],
};
