const { src, dest, watch, parallel, series } = require("gulp");

//* html 
const fileinclude = require('gulp-file-include');
const i18n = require('gulp-html-i18n')

//* sass
const sass = require('gulp-sass')
const postcss = require('gulp-postcss');
const cssnano = require('cssnano');
const autoprefixer = require('autoprefixer')
const purgecss = require('gulp-purgecss')

//* js
const babel = require('gulp-babel');

// image
const imagemin = require('gulp-imagemin');

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

function i18nHtmlCompiler(cb) {
  src('src/*.html')
    .pipe(fileinclude({
      prefix: '@@',
      basepath: '@file'
    }))
    .pipe(i18n({
      langDir: 'src/lang',
      createLangDirs: true,
      trace: true
    }))
    .pipe(dest('dist/i18n'))
  cb()
}
exports.i18n = i18nHtmlCompiler

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

function imageCompress(cb) {
  src('src/asset/images/*')
    .pipe(imagemin([
      imagemin.mozjpeg({ quality: 50, progressive: true }),
      imagemin.optipng({ optimizationLevel: 5 }),
    ]))
    .pipe(dest('dist/asset/images'))
  cb()
}
exports.image = imageCompress

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