'use strict';

const gulp = require('gulp');
const ts = require('gulp-typescript');
const es = require('event-stream');

const project = ts.createProject('tsconfig.json');

gulp.task('build', () => {
	const tsResult = project
		.src()
		.pipe(project());

	return es.merge(
		tsResult.js
			.pipe(gulp.dest('./built/')),
		tsResult.dts.pipe(gulp.dest('./built/'))
	);
});
