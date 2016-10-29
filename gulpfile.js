'use strict';

var gulp = require('gulp'),
    watch = require('gulp-watch'),
    prefixer = require('gulp-autoprefixer'),
    uglify = require('gulp-uglify'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    cssmin = require('gulp-minify-css'),
    del = require('del'),
    concat = require('gulp-concat'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    browserSync = require("browser-sync"),
    reload = browserSync.reload;

var path = {
  public: {
    html: './',
    js: 'public/js/',
    css: 'public/css/',
    img: 'public/img/',
    fonts: 'public/fonts/'
  },

  src: {
    html: './*.html',
    js: 'src/js/*.js',
    style: 'src/styles/*.*',
    img: 'src/img/**/*.*',
    fonts: 'src/fonts/**/*.*'
  },

  watch: {
    html: './*.html',
    js: 'src/js/**/*.js',
    style: 'src/styles/**/*.*',
    img: 'src/img/**/*.*',
    fonts: 'src/fonts/**/*.*'
  }
};

var config = {
  server: {
    baseDir: "./"
  },
  tunnel: true,
  host: 'localhost',
  port: 9000
};

gulp.task('webserver', function () {
  browserSync(config);
});

gulp.task('html:build', function () {
  gulp.src(path.src.html)
    .pipe(gulp.dest(path.public.html))
    .pipe(reload({stream: true}));
});

gulp.task('js:build', function () {
  gulp.src(path.src.js)
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(path.public.js))
    .pipe(reload({stream: true}));
});

gulp.task('style:build', function () {
  gulp.src(path.src.style)
    .pipe(sourcemaps.init())
    .pipe(sass({
      sourceMap: true,
      errLogToConsole: true
    }))
    .pipe(prefixer())
    .pipe(concat('main.css'))
    .pipe(cssmin())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(path.public.css))
    .pipe(reload({stream: true}));
});

gulp.task('image:build', function () {
  gulp.src(path.src.img)
    .pipe(imagemin({
      progressive: true,
      svgoPlugins: [{removeViewBox: false}],
      use: [pngquant()],
      interlaced: true
    }))
    .pipe(gulp.dest(path.public.img))
    .pipe(reload({stream: true}));
});

gulp.task('fonts:build', function() {
  gulp.src(path.src.fonts)
  .pipe(gulp.dest(path.public.fonts))
});

gulp.task('build', [
  'html:build',
  'js:build',
  'style:build',
  'fonts:build',
  'image:build'
]);

gulp.task('watch', function(){
  watch([path.watch.html], function(event, cb) {
    gulp.start('html:build');
  });
  watch([path.watch.style], function(event, cb) {
    gulp.start('style:build');
  });
  watch([path.watch.js], function(event, cb) {
    gulp.start('js:build');
  });
  watch([path.watch.img], function(event, cb) {
    gulp.start('image:build');
  });
  watch([path.watch.fonts], function(event, cb) {
    gulp.start('fonts:build');
  });
});

gulp.task('clean', function() {
  return del.sync('public/**/*.*');
});

gulp.task('default', ['clean', 'build', 'webserver', 'watch']);
