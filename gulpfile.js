'use strict';

const gulp = require('gulp');
const babel = require('gulp-babel');
const ts = require('gulp-typescript');
const es = require('event-stream');

const project = ts.createProject('tsconfig.json');

gulp.task('build', [
	'build:ts',
	'build:copy'
]);

gulp.task('build:ts', () => {
	const tsResult = project
		.src()
		.pipe(project());

	return es.merge(
		tsResult.js
			.pipe(babel({
				presets: ['es2015', 'stage-3']
			}))
			.pipe(gulp.dest('./built/')),
		tsResult.dts.pipe(gulp.dest('./built/'))
	);
});

gulp.task('build:copy', () => {
	return es.merge(
		gulp.src([
			'./src/**/*.pug'
		]).pipe(gulp.dest('./built/'))
	);
});
