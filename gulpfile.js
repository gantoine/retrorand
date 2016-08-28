var path = require('path');
var gulp = require('gulp');
var eslint = require('gulp-eslint');
var excludeGitignore = require('gulp-exclude-gitignore');
var mocha = require('gulp-mocha');
var istanbul = require('gulp-istanbul');
var nsp = require('gulp-nsp');
var plumber = require('gulp-plumber');
var codecov = require('gulp-codecov');
var babel = require('gulp-babel');
var del = require('del');
var isparta = require('isparta');
var sass = require('gulp-sass');
var ejs = require("gulp-ejs");
var browserify = require('gulp-browserify');
var uglify = require('gulp-uglify');

// Initialize the babel transpiler so ES2015 files gets compiled
// when they're loaded
require('babel-register');

gulp.task('static', function () {
  return gulp.src('**/*.js')
    .pipe(excludeGitignore())
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task('sass', ['scrub'], function () {
  return gulp.src('src/browser/**/app.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('public'));
});

gulp.task('sass:watch', function () {
  gulp.watch('src/**/*.scss', ['sass']);
});

gulp.task('ejs', ['clean'], function () {
  gulp.src('src/**/*.ejs')
    .pipe(ejs())
    .pipe(gulp.dest('dist'));
});

gulp.task('js', ['scrub'], function() {
  gulp.src('src/browser/js/app.js')
    .pipe(uglify())
    .pipe(browserify({
      insertGlobals : true
    }))
    .pipe(gulp.dest('public'))
});

gulp.task('nsp', function (cb) {
  nsp({package: path.resolve('package.json')}, cb);
});

gulp.task('pre-test', function () {
  return gulp.src('src/**/*.js')
    .pipe(excludeGitignore())
    .pipe(istanbul({
      includeUntested: true,
      instrumenter: isparta.Instrumenter
    }))
    .pipe(istanbul.hookRequire());
});

gulp.task('test', ['pre-test'], function (cb) {
  var mochaErr;

  gulp.src('test/**/*.js')
    .pipe(plumber())
    .pipe(mocha({reporter: 'spec'}))
    .on('error', function (err) {
      mochaErr = err;
    })
    .pipe(istanbul.writeReports())
    .on('end', function () {
      cb(mochaErr);
    });
});

gulp.task('watch', function () {
  gulp.watch(['src/**/*.js', 'test/**'], ['test']);
});

gulp.task('codecov', ['test'], function () {
  if (!process.env.CI) {
    return;
  }

  return gulp.src(path.join(__dirname, 'coverage/lcov.info'))
    .pipe(codecov());
});

gulp.task('babel', ['clean'], function () {
  return gulp.src('src/server/**/*.js')
    .pipe(babel())
    .pipe(gulp.dest('dist'));
});

gulp.task('clean', function () {
  return del('dist');
});

gulp.task('scrub', function () {
  return del('public');
});

gulp.task('prepublish', ['nsp', 'babel', 'js', 'sass', 'ejs']);
gulp.task('default', ['static', 'test', 'codecov']);
