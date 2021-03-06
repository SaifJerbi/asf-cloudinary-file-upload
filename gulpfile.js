var gulp = require('gulp');
var connect = require('gulp-connect');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var templateCache = require('gulp-angular-templatecache');
var streamqueue = require('streamqueue');
var fs = require('fs');
var cleanCSS = require('gulp-clean-css');

gulp.task('default', ['minify','minify-css', 'connect', 'watch']);

gulp.task('connect', function () {
  connect.server({
    root: ['demo', './'],
    livereload: true,
  });
});

gulp.task('reload', ['minify'], function () {
  gulp.src('./dist/**/*.*').pipe(connect.reload());
});

gulp.task('watch', function () {
  gulp.watch(['./src/**', './demo/**'], ['reload']);
});

gulp.task('minify-css', () => {
  return gulp.src('src/templates/*.css')
    .pipe(concat('asf-cloudinary-file-upload.css'))
    .pipe(gulp.dest('./dist'))
    .pipe(concat('asf-cloudinary-file-upload.min.css'))
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(gulp.dest('./dist'));
});

gulp.task('minify', function () {
  var files = JSON.parse(fs.readFileSync('sources.json', 'utf-8'));
  var stream = streamqueue({ objectMode: true },
    gulp.src(['src/templates/**/*.html']).pipe(templateCache({
      standalone: true,
      root: 'src/templates/',
    })),
    gulp.src(files)
  )
  .pipe(concat('asf-cloudinary-file-upload.js'))
  .pipe(gulp.dest('./dist'))
  .pipe(uglify())
  .pipe(rename('asf-cloudinary-file-upload.min.js'))
  .pipe(gulp.dest('./dist'));

  return stream;
});
