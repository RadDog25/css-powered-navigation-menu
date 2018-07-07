'use strict';

var gulp = require('gulp'),
    sass = require('gulp-sass'),
    browserSync = require('browser-sync').create(),
    cleanCSS = require('gulp-clean-css'),
    autoprefixer = require('gulp-autoprefixer'),
    sourcemaps = require('gulp-sourcemaps'),
    rename = require('gulp-rename'),
    plumber = require('gulp-plumber'),
    notify = require("gulp-notify");

var onError = function (err) {
    console.log(err);
    this.emit('end');
};


// COMPILE THEME SASS FILE
gulp.task('sass', function () {
    return gulp.src('./lib/scss/style.scss')
        .pipe(sourcemaps.init())
        .pipe(plumber({
            errorHandler: onError
        }))
        .pipe(sass())
        .on('error', notify.onError({
            title: "SCSS compilation failed",
            message: "<%= error.message %>"
        }))
        .pipe(autoprefixer({
            browsers: ['> 1%', 'Safari >= 8'],
            cascade: false
        }))
        .pipe(cleanCSS({debug: true, advanced: false}, function(details) {
            console.log(details.name + ' size before minifying: ' + details.stats.originalSize);
            console.log(details.name + ' size after: ' + details.stats.minifiedSize);
        }))
        .pipe(rename({
            basename: "app",
            suffix: ".min",
            extname: ".css"
          }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('./dist/css'))
        .pipe(browserSync.stream())
        .pipe(notify({
            title: "Sass compiled successfully!",
            onLast: true,
            sound: true
        }))
});


// BROWSERSYNC AND WATCH
gulp.task('watch', function () {

  browserSync.init({
    server: {
        baseDir: "./"
    }
  });

  gulp.watch('lib/scss/**/*.scss', ['sass']);
  gulp.watch("*.html").on('change', browserSync.reload);
});

gulp.task('default', ['production', 'watch']);
gulp.task('production', ['sass']);