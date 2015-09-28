'use strict';

var gulp = require('gulp');
var mocha = require('gulp-mocha');
var istanbul = require('gulp-istanbul');
var jshint = require('gulp-jshint');
var _ = require('lodash');
var jscs = require('gulp-jscs');
var gutil = require('gulp-util');
var stylishJshint = require('jshint-stylish');
var stylishJscs = require('jscs-stylish');

var sourceFiles = ['index.js', 'lib/**/*.js'];
var testSourceFiles = ['test/**/**.spec.js'];
var allSourceFiles = sourceFiles.concat(testSourceFiles);

gulp.task('test', function (done) {

  gulp.src(sourceFiles)
    .pipe(istanbul()) // Covering files
    .pipe(istanbul.hookRequire()) // Force `require` to return covered files
    .on('finish', function () {
      return gulp.src(testSourceFiles)
        .pipe(mocha())
        .on('error', gutil.log)
        .pipe(istanbul.writeReports()) // Creating the reports after tests ran
        .pipe(istanbul.enforceThresholds({thresholds: {global: 100}})) // Enforce a coverage of at least 100%
        .on('end', done);

    })
    .on('error', gutil.log);
});

gulp.task('style', function () {

  return gulp.src(allSourceFiles)
    .pipe(jscs())
    .pipe(jscs.reporter(stylishJscs.path))
    .pipe(jscs.reporter('fail'));
});

gulp.task('lint', function () {

  return gulp.src(allSourceFiles)
    .pipe(jshint())
    .pipe(jshint.reporter(stylishJshint))
    .pipe(jshint.reporter('gulp-jshint-html-reporter', {
      filename: __dirname + '/lint.html',
      createMissingFolders: false
    }))
    .pipe(jshint.reporter('fail'));
});

gulp.task('default', ['test', 'lint', 'style']);
