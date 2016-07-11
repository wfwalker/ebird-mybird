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

// var connect = require('gulp-connect');
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
var mocha = require('gulp-mocha');
var convert = require('gulp-convert');
var nodemon = require('gulp-nodemon');

// The directory in which the app will be built, and from which it is offlined
// and deployed.  This is also the prefix that will be stripped from the front
// of paths cached by the offline worker, so it should include a trailing slash
// to ensure the leading slash of the path is stripped, i.e. to ensure
// dist/css/style.css becomes css/style.css, not /css/style.css.
var rootDir = 'dist/';
 
gulp.task('testdata', function(){
  gulp.src(['app/data/ebird.csv'])
    .pipe(convert({
      from: 'csv',
      to: 'json'
     }))
    .pipe(gulp.dest('app/test/'));
});

gulp.task('copy-js-libs', function() {
    return gulp.src([
          'node_modules/handlebars/dist/handlebars.js',
          'node_modules/d3/d3.js',
        ])
        .pipe(gulp.dest(function(file) {
            file.path = file.base + path.basename(file.path);
            return 'app/scripts';
        }));
});

gulp.task('test', function () {
  return gulp.src('app/test/test.js', { read: false })
    // gulp-mocha needs filepaths so you can't have any plugins before it 
    .pipe(mocha({reporter: 'nyan'}));
});

gulp.task('default', ['build', 'offline']);

gulp.task('build', ['templates', 'compress', 'css'], function(callback) {
  return gulp.src('app/**').pipe(gulp.dest('dist'));
});

gulp.task('configure', oghliner.configure);

gulp.task('deploy', function() {
  return oghliner.deploy({
    rootDir: rootDir,
  });
});

gulp.task('lint', function() {
  return gulp.src(['app/scripts/sightinglist.js', 'app/scripts/renders.js', 'app/scripts/app.js', 'app/test/test.js']).pipe(eslint({
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
    'app/scripts/d3.js',
    'app/scripts/c3.min.js',
    'app/scripts/handlebars.js',
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

gulp.task('offline', ['copy-js-libs', 'build'], function() {
  return oghliner.offline({
    rootDir: rootDir,
    fileGlobs: [
      'images/**',
      'index.html',
      'scripts/compressed.js',
      'styles/**',
    ],
  });
});

gulp.task('serve', ['offline'], function () {
  nodemon({
    script: 'server/server.js'
  })
})
