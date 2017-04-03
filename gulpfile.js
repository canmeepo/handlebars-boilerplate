'use strict';

const gulp = require('gulp');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const sourcemaps = require('gulp-sourcemaps');
const del = require('del');
const newer = require('gulp-newer');
const autoprefixer = require('gulp-autoprefixer');
const browserSync = require('browser-sync').create();
const notify = require('gulp-notify');
const babel = require('gulp-babel');
const handlebars = require('gulp-compile-handlebars');
const fs = require('fs');
const rename = require('gulp-rename');


gulp.task('styles', function() {

	return gulp.src('src/assets/styles/**/*.scss')
		.pipe(autoprefixer())
		.pipe(sourcemaps.init())
		.pipe(sass())
		.on('error', function(err) {
			console.log(err.message);
			this.end();
		})
		.pipe(concat('all.css'))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest('dist/styles/'));

});

gulp.task('clean', function() {
	return del('dist');
});

gulp.task('img', function() {
	return gulp.src('src/assets/img/**', {since: gulp.lastRun('img')})
	.pipe(newer('dist/img'))
	.pipe(gulp.dest('dist/img'));
});

gulp.task('fonts', function() {
	return gulp.src('src/assets/fonts/**', {since: gulp.lastRun('fonts')})
	.pipe(newer('dist/fonts'))
	.pipe(gulp.dest('dist/fonts'));
});

gulp.task('js', () =>
    gulp.src('src/assets/scripts/*.js')
        .pipe(babel({
            presets: ['es2015']
        })).on('error', function(err) {
			console.log(err.message);
			this.end();
		}) 
        .pipe(concat('all.js'))
		.pipe(sourcemaps.write())
        .pipe(gulp.dest('dist/scripts'))
);

gulp.task('lib', function() {
	return gulp.src('src/assets/scripts/lib/*.js', {since: gulp.lastRun('lib')})
	.pipe(newer('dist/scripts/lib'))
	.pipe(gulp.dest('dist/scripts/lib'));
});

gulp.task('handlebars', function () {
	let data = JSON.parse(fs.readFileSync('src/data/data.json'));
	let options = {
		ignorePartials: true, // ignores any unknown partials. Useful if you only want to handle part of the file
		batch : ['src/partials'] // Javascript array of filepaths to use as partials
	};
	return gulp.src('src/templates/**/*.hbs')
		.pipe(handlebars(data, options)) 
		.pipe(rename(function(path) {
			path.extname = '.html';
		}))
		.pipe(gulp.dest('dist/'));
});

gulp.task('build', gulp.series(
	'clean', gulp.parallel('styles', 'img', 'fonts', 'lib', 'js', 'handlebars'))
);

gulp.task('watch', function() {

	gulp.watch('src/assets/styles/**/*.scss', gulp.series('styles'));
	gulp.watch('src/assets/fonts/*.*', gulp.series('fonts'));
	gulp.watch('src/assets/img/**', gulp.series('img'));
	gulp.watch('src/templates/**/*.hbs', gulp.series('handlebars'));
	gulp.watch('src/partials/*.hbs', gulp.series('handlebars'));
	gulp.watch('src/data/data.json', gulp.series('handlebars'));
	gulp.watch('src/assets/scripts/*.js', gulp.series('js'));
	gulp.watch('src/assets/scripts/lib/*.js', gulp.series('lib'));

});

gulp.task('serve', function() {
	browserSync.init({
		server: 'dist'
	})

	browserSync.watch('dist/**/*.*').on('change', browserSync.reload);

});

gulp.task('dev', gulp.series('build', gulp.parallel('watch', 'serve')));