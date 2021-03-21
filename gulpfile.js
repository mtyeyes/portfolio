const gulp = require('gulp');
const plumber = require('gulp-plumber');
const csso = require('gulp-csso');
const htmlmin = require('gulp-htmlmin');
const minifyInline = require('gulp-minify-inline');
const beautify = require('gulp-beautify');

const minifyHtml = () => {
  return gulp
    .src('index.html')
    .pipe(minifyInline())
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest('./'));
};

exports.minifyHtml = minifyHtml;

const unminifyHtml = () => {
  return gulp
    .src('index.html')
    .pipe(beautify.html({ indent_size: 2 }))
    .pipe(gulp.dest('./'));
};

exports.unminifyHtml = unminifyHtml;

const minifyCss = () => {
  return gulp
    .src('style.css')
    .pipe(plumber())
    .pipe(csso())
    .pipe(gulp.dest('./'));
};

exports.minifyCss = minifyCss;

const unminifyCss = () => {
  return gulp
    .src('style.css')
    .pipe(plumber())
    .pipe(beautify.css({ indent_size: 2 }))
    .pipe(gulp.dest('./'));
};

exports.unminifyCss = unminifyCss;

const minify = gulp.series(gulp.parallel(minifyHtml, minifyCss));

exports.minify = minify;

const unminify = gulp.series(gulp.parallel(unminifyHtml, unminifyCss));

exports.unminify = unminify;
