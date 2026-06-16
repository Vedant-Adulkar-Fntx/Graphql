
export default {
  content: [
  './index.html',
  './src/**/*.{js,ts,jsx,tsx}'
],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: '#0A1264',
          yellow: '#FFC832',
        }
      },
      fontFamily: {
        heading: ['Lato', 'sans-serif'],
        body: ['Barlow', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
