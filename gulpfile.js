const { src, dest, watch, parallel, series } = require("gulp");

//* html 
const fileinclude = require('gulp-file-include');

//* sass
const sass = require('gulp-sass')
const postcss = require('gulp-postcss');
const cssnano = require('cssnano');
const autoprefixer = require('autoprefixer')
const purgecss = require('gulp-purgecss')

//* js
const babel = require('gulp-babel');

const sync = require("browser-sync").create();

function htmlCompiler(cb) {
  src('src/*.html')
    .pipe(fileinclude({
      prefix: '@@',
      basepath: '@file'
    }))
    .pipe(dest('dist'))
  cb()
}
exports.html = htmlCompiler

function sassCompiler(cb) {
  var plugins = [
    autoprefixer(),
    cssnano()
  ];

  src('src/scss/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(purgecss({
      content: ['src/**/*.html']
    }))
    .pipe(postcss(plugins))
    .pipe(dest('dist/style'))
    .pipe(sync.stream())
  cb();
}
exports.sass = sassCompiler

function jsCompiler(cb) {
  src('src/js/*.js')
    .pipe(babel())
    .pipe(dest('dist/js'))
  cb();
}
exports.js = jsCompiler

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