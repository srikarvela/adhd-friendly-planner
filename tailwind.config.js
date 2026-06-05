export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans:    ['SF Pro Text', 'SF Pro Display', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        display: ['SF Pro Display', '-apple-system', 'sans-serif'],
        rounded: ['SF Pro Rounded', 'SF Pro Display', '-apple-system', 'sans-serif'],
      },
      colors: {
        dark: {
          bg:   '#000000',
          card: '#1C1C1E',
          ele:  '#2C2C2E',
          sep:  'rgba(84,84,88,0.65)',
        }
      }
    },
  },
  plugins: [],
}
