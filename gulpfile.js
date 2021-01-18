const { src, dest, watch, parallel, series } = require("gulp");

const sass = require('gulp-sass')
const postcss = require('gulp-postcss');
const cssnano = require('cssnano');
const autoprefixer = require('autoprefixer')

const sync = require("browser-sync").create();

function sassCompiler(cb) {
  var plugins = [
    autoprefixer(),
    cssnano()
  ];

  src('src/scss/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss(plugins))
    .pipe(dest('dist/style'))
    .pipe(sync.stream())
  cb();
}
exports.sass = sassCompiler

function htmlCompiler(cb) {
  src('src/*.html')
    .pipe(dest('dist'))
  cb()
}
exports.html = htmlCompiler

function browserSync(cb) {
  sync.init({
    server: {
      baseDir: "./dist"
    }
  })

  watch('src/*.html', htmlCompiler)
  watch('src/scss/*.scss', sassCompiler)
  watch('./dist/*.html').on('change', sync.reload)
}
exports.sync = browserSync


exports.dev = series(parallel(htmlCompiler, sassCompiler), browserSync)