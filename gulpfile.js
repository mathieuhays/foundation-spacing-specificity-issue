/**
 *	Gulp Config
 */


// Packages
const PATH = require('path');
const GULP = require('gulp');
const WATCH = require('gulp-watch');
const SOURCEMAPS = require('gulp-sourcemaps');
const SASS = require('gulp-sass');
const POSTCSS = require('gulp-postcss');
const AUTOPREFIXER = require('autoprefixer');
const RENAME = require('gulp-rename');
const UGLIFY = require('gulp-uglify');
const GUTIL = require('gulp-util');
const FS = require('fs');


// Paths
const CSS = PATH.join(__dirname, 'css');
const SCSS = PATH.join(__dirname, 'scss');


// Patterns
const SCSS_WATCH_ENTRY = [ PATH.join(SCSS, '**', '*.scss') ];
const SCSS_BUILD_ENTRY = [ PATH.join(SCSS, '**', '*.scss'), '!' + PATH.join(SCSS, '**', '_*.scss') ];


/**
 *	Tasks
 */

// Parse SASS
GULP.task('scss:build:development', function() {
	return GULP.src(SCSS_BUILD_ENTRY)
		.pipe(SOURCEMAPS.init())
		.pipe(SASS({
			includePaths: [ PATH.join(__dirname, 'foundation-sites-develop-v6.5/scss') ]
		}).on('error', GUTIL.log))
		.pipe(POSTCSS([ AUTOPREFIXER({ browsers: ['> 5%', 'IE 9'] }) ]))
		.pipe(SOURCEMAPS.write('./maps'))
		.pipe(GULP.dest(CSS));
});


// Watch SASS changes
GULP.task('scss:watch', [ 'scss:build:development' ], function() {
	WATCH(SCSS_WATCH_ENTRY, function() {
		GULP.start('scss:build:development');
	});
});


// Minify SASS/CSS
GULP.task('scss:build:production', function() {
	return GULP.src(SCSS_BUILD_ENTRY)
		.pipe(SASS({
			includePaths: [ PATH.join(__dirname, 'foundation-sites-develop-v6.5/scss') ],
			outputStyle: 'compressed'
		}).on('error', GUTIL.log))
		.pipe(POSTCSS([ AUTOPREFIXER({ browsers: ['> 5%', 'IE 9'] }) ]))
		.pipe(RENAME({ suffix: '.min' }))
		.pipe(GULP.dest(CSS));
});


/**
 *	Task Aliases
 */
GULP.task('default', [ 'scss:watch' ]);
GULP.task('build', [ 'scss:build:production', 'js:build:production' ]);
