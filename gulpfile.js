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
var ejs = require('gulp-ejs');
var browserify = require('gulp-browserify');
var uglify = require('gulp-uglify');

// Initialize the babel transpiler so ES2015 files gets compiled
// when they're loaded
require('babel-register');

gulp.task('static', () => {
  return gulp.src('**/*.js')
    .pipe(excludeGitignore())
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task('ejs', ['clean'], () => {
  gulp.src('src/**/*.ejs')
    .pipe(ejs())
    .pipe(gulp.dest('dist'));
});

gulp.task('nsp', function (cb) {
  nsp({package: path.resolve('package.json')}, cb);
});

gulp.task('sass', ['scrub'], () => {
  return gulp.src('src/browser/**/app.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('public'));
});

gulp.task('public:watch', () => {
  gulp.watch('src/browser/**/*.scss', ['public']);
  gulp.watch('src/browser/**/*.js', ['public']);
});

gulp.task('images', ['clean'], () => {
  gulp.src('src/browser/images/**/*')
    .pipe(gulp.dest('public/images'));
});

gulp.task('js', ['scrub'], () => {
  gulp.src('src/browser/js/app.js')
    .pipe(uglify())
    .pipe(browserify({
      insertGlobals: true
    }))
    .pipe(gulp.dest('public/js'));
});

gulp.task('pre-test', () => {
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

  gulp.src('src/**/*.test.js')
    .pipe(plumber())
    .pipe(mocha({reporter: 'spec'}))
    .on('error', function (err) {
      mochaErr = err;
    })
    .pipe(istanbul.writeReports())
    .on('end', () => {
      cb(mochaErr);
    });
});

gulp.task('watch', () => {
  gulp.watch(['src/**/*.js', 'test/**'], ['test']);
});

gulp.task('codecov', ['test'], () => {
  if (!process.env.CI) {
    return;
  }

  return gulp.src(path.join(__dirname, 'coverage/lcov.info'))
    .pipe(codecov());
});

gulp.task('babel', ['clean'], () => {
  return gulp.src('src/server/**/*.js')
    .pipe(babel())
    .pipe(gulp.dest('dist'));
});

gulp.task('clean', () => {
  return del('dist');
});

gulp.task('scrub', () => {
  return del('public');
});

gulp.task('public', ['js', 'sass', 'images']);
gulp.task('prepublish', ['nsp', 'babel', 'ejs', 'public']);
gulp.task('default', ['static', 'test', 'codecov']);
