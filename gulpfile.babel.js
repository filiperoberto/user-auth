const gulp = require('gulp');
const ts = require('gulp-typescript');
const runSequence = require('run-sequence');
const rename = require('gulp-rename');
const clean = require('gulp-clean');
const fs = require('fs');

const tsProject = ts.createProject('tsconfig.json');

gulp.task('scripts', () => {
  const tsResult = tsProject.src()
  .pipe(tsProject());
  return tsResult.js.pipe(gulp.dest('dist'));
});

gulp.task('watch', ['build'], () => {
  gulp.watch('src/**/*.ts', ['scripts']);
});

gulp.task('clean',() => {
	gulp.src('dist',{read : false}).pipe(clean());
});

gulp.task('build',done => {
	runSequence('clean','scripts','env',done);
})

gulp.task('env',() => {

	fs.stat('.env',(err, stat) => {
    	if(err == null) {
    		gulp.src('.env').pipe(gulp.dest('dist'));
    	} else {
        	gulp.src('.env_sample')
        		.pipe(rename('.env'))
        		.pipe(gulp.dest('dist'));
    	}
	});
})

gulp.task('default', ['watch']);