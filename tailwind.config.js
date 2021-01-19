module.exports = {
  content: ['./src/**/*.html', './src/**/*.js', './src/**/*.scss'],
  purge: [],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {
      backgroundColor: ['checked', 'disabled'],
      borderColor: ['checked', 'disabled'],
      outline: ['checked'],
      cursor: ['disabled'],
      margin: ['last'],
    }
  },
  plugins: [],
}
