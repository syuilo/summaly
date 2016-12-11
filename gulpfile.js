'use strict';

const gulp = require('gulp');
const babel = require('gulp-babel');
const ts = require('gulp-typescript');
const es = require('event-stream');

const project = ts.createProject('tsconfig.json');

gulp.task('build', () => {
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
