const gulp = require('gulp');
const ts = require('gulp-typescript');
const runSequence = require('run-sequence');
const rename = require('gulp-rename');
const clean = require('gulp-clean');
const fs = require('fs');

const tsProject = ts.createProject('tsconfig.json');

function copyFileIfNotExists(filename, sampleFilename, dest = 'dist') {
	fs.stat(filename ,(err, stat) => {
    	if(err == null) {
    		gulp.src(filename).pipe(gulp.dest('dist'));
    	} else {
        	gulp.src(sampleFilename)
        		.pipe(rename(filename))
        		.pipe(gulp.dest('dist'));
    	}
	});
}

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
	runSequence('clean','scripts','env','conf',done);
})

gulp.task('env',() => {
	copyFileIfNotExists('.env','.env_sample');
})

gulp.task('conf',() => {
  fs.stat('src/config.js' ,(err, stat) => {
      if(err == null) {
        gulp.src('src/config.js').pipe(gulp.dest('dist'));
      } else {
          gulp.src('src/config.js.sample')
            .pipe(rename('config.js'))
            .pipe(gulp.dest('dist'));
      }
  });
})

gulp.task('default', ['watch']);