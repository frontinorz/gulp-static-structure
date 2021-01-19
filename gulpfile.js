//* gulp core 
const { src, dest, watch, parallel, series } = require("gulp");

//* html 
const fileinclude = require('gulp-file-include');
const i18n = require('gulp-html-i18n')

//* sass
const sass = require('gulp-sass')
const purgecss = require('gulp-purgecss')
const postcss = require('gulp-postcss');
const cssnano = require('cssnano');
const autoprefixer = require('autoprefixer')

//* js
const babel = require('gulp-babel');
const terser = require('gulp-terser');

//* utility 
const concat = require('gulp-concat');
const imagemin = require('gulp-imagemin');
const del = require('del')
const sync = require("browser-sync").create();

//*---------- utility methods ---------- 
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

function jsUCompiler(cb) {
  src('src/js/utility/*.js')
    .pipe(babel())
    .pipe(concat('utility.js'))
    .pipe(dest('dist/js'))
  cb();
}
exports.jsu = jsUCompiler

function cleanBuild(cb) {
  del(['dist/**', '!dist'])
  cb()
}
exports.clean = cleanBuild
// -------------------------------------

//* develop
function htmlCompiler(cb) {
  src('src/*.html')
    .pipe(fileinclude({
      prefix: '@@',
      basepath: '@file'
    }))
    .pipe(dest('dist'))
    .pipe(sync.stream())
  cb()
}
exports.html = htmlCompiler

function sassCompiler(cb) {
  let plugins = [
    autoprefixer(),
  ];

  src('src/scss/**/*.scss')
    .pipe(sass({
      includePaths: ['node_modules/bootstrap/scss/'],
    }).on('error', sass.logError))
    .pipe(postcss(plugins))
    .pipe(concat('style.css'))
    .pipe(dest('dist/style'))
    .pipe(sync.stream())
  cb();
}
exports.sass = sassCompiler

function jsCompiler(cb) {
  src('src/js/*.js')
    .pipe(babel())
    .pipe(concat('script.js'))
    .pipe(dest('dist/js'))
    .pipe(sync.stream())
  cb();
}
exports.js = jsCompiler

function browserSync(cb) {
  sync.init({
    server: {
      baseDir: "./dist"
    }
  })

  watch('src/**/*.html', htmlCompiler)
  watch('src/scss/*.scss', sassCompiler)
  watch('src/js/*.js', jsCompiler)
}
exports.sync = browserSync

exports.dev = series(htmlCompiler, parallel(sassCompiler, jsCompiler), browserSync)

//* build
function jsBuilder(cb) {
  src('src/js/*.js')
    .pipe(babel())
    .pipe(concat('script.js'))
    .pipe(terser())
    .pipe(dest('dist/js'))
  cb();
}
exports.jsbuild = jsBuilder

function jsBootstrap(cb) {
  src([
    'node_modules/jquery/dist/jquery.slim.min.js',
    'node_modules/bootstrap/dist/js/bootstrap.bundle.min.js'
  ])
    .pipe(concat('vender.js'))
    .pipe(dest('dist/js'))
  cb();
}
exports.jsBbuild = jsBootstrap

function cssBuilder(cb) {
  let plugins = [
    autoprefixer(),
    cssnano()
  ];

  src('src/scss/**/*.scss')
    .pipe(sass({
      includePaths: ['node_modules/bootstrap/scss/'],
    }).on('error', sass.logError))
    .pipe(postcss(plugins))
    .pipe(purgecss({
      content: ['src/**/*.html']
    }))
    .pipe(concat('style.css'))
    .pipe(dest('dist/style'))
  cb();
}
exports.cssbuild = cssBuilder

exports.build = series(cleanBuild, htmlCompiler, parallel(cssBuilder, jsBootstrap, jsBuilder, imageCompress))