/**
 * Copyright 2015 Mozilla
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

var connect = require('gulp-connect');
var gulp = require('gulp');
var oghliner = require('oghliner');
var handlebars = require('gulp-handlebars');
var wrap = require('gulp-wrap');
var concat = require('gulp-concat');
var declare = require('gulp-declare');
var eslint = require('gulp-eslint');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var postcss = require('gulp-postcss');
var mqpacker = require('css-mqpacker');
var csswring = require('csswring');
var path = require('path');
var debounce = require('lodash.debounce');

gulp.task('default', ['build', 'offline']);

gulp.task('build', ['templates', 'compress', 'css'], function(callback) {
  return gulp.src('app/**').pipe(gulp.dest('dist'));
});

gulp.task('configure', oghliner.configure);

gulp.task('deploy', function() {
  return oghliner.deploy({
    rootDir: 'dist',
  });
});

gulp.task('lint', function() {
  return gulp.src(['app/scripts/sightinglist.js', 'app/scripts/app.js']).pipe(eslint({
    'rules':{
        'quotes': [1, 'single'],
        'semi': [1, 'always'],
        'comma-dangle': [1, 'always-multiline'],
        'quote-props': [1, 'as-needed']
    }
  })).pipe(eslint.format());
});

gulp.task('templates', function(){
  return gulp.src('app/templates/*.html')
    .pipe(handlebars({
      handlebars: require('handlebars')
    }))
    .pipe(wrap('Handlebars.template(<%= contents %>)'))
    .pipe(declare({
      namespace: 'ebirdmybird',
      noRedeclare: true, // Avoid duplicate declarations
    }))
    .pipe(concat('handlebars-templates.js'))
    .pipe(gulp.dest('./app/scripts'));
});

gulp.task('compress', ['templates'], function(){
  return gulp.src([
    'app/scripts/d3.v3.js',
    'app/scripts/c3.min.js',
    'app/scripts/papaparse.min.js',
    'app/scripts/handlebars-v4.0.4.js',
    'app/scripts/handlebars-templates.js',
    'app/scripts/sightinglist.js',
    'app/scripts/app.js',
  ])
    .pipe(sourcemaps.init())
    .pipe(concat('compressed.js'))
    .pipe(uglify())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('app/scripts'));
});

gulp.task('css', function() {
  var processors = [
    mqpacker,
    csswring,
  ];
  return gulp
    .src(['app/styles/*.css', '!app/styles/bundle.css'])
    .pipe(postcss(processors))
    .pipe(concat('bundle.css'))
    .pipe(gulp.dest('app/styles'));
});

gulp.task('offline', ['build'], function() {
  return oghliner.offline({
    rootDir: 'dist/',
    fileGlobs: [
      'images/**',
      'index.html',
      'scripts/compressed.js',
      'data/**',
      'styles/**',
    ],
  });
});

gulp.task('watch', ['offline'], function() {
  var browserSyncCreator = require('browser-sync');
  var browserSync = browserSyncCreator.create();
  browserSync.init({
    open: false,
    server: {
      baseDir: 'dist',
      ghostMode: false,
      notify: false,
    },
  });
  gulp.watch(['./app/styles/*.css'], ['css']);
  gulp.watch(['./app/scripts/*.js', '!./app/scripts/compressed.js'], ['compress']);
  gulp.watch(['./app/templates/*.html'], ['templates']);
  gulp.watch([
    path.join('app', '**/*.*'),
  ], debounce(function () { return gulp.src('app/**').pipe(gulp.dest('dist')); }, 200));
});

