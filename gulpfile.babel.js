var gulp = require('gulp');
var browserify = require('browserify');
var source = require('vinyl-source-stream');

gulp.task("default", () => {
	return console.log('From gulp');
});