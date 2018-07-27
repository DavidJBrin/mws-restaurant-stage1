const gulp = require('gulp');
const sass = require('gulp-sass');
const browserSync = require('browser-sync').create();
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const responsive = require('gulp-responsive');


gulp.task('build', ['move-files', 'scripts', 'styles', 'images']);

gulp.task('default', ['move-files', 'scripts', 'styles'], () => {
  gulp.start('preview-dist');
  gulp.watch('src/js/**/*.js', ['scripts-reload']);
  gulp.watch('src/*.*', ['move-reload']);
  gulp.watch('src/sass/**/*', ['cssInject']);
});

// Reload all Browsers
gulp.task('scripts-reload', ['scripts'], function () {
  browserSync.reload();
});

// Realod Browsers after moving files
gulp.task('move-reload', ['move-files'], function () {
  browserSync.reload();
});

//Inject CSS after sunning sass
gulp.task('cssInject', ['styles'], () => {
  return gulp.src('dist/css/styles.css')
    .pipe(browserSync.stream());
});

// Task to previe the dist 
gulp.task('preview-dist', () => {
  browserSync.init({
    notify: true,
    server: {
      baseDir: 'dist'
    },
    browser: ['chrome']
  });
});

// Move all static files from src to dist
gulp.task('move-files', () => {
  gulp.src('src/*.*')
    .pipe(gulp.dest('dist/'));
});

// Task to minify scripts
gulp.task('restaurant-scripts', () => {
  const scriptsToCopy = [
    'src/js/idb.js',
    'src/js/dbhelper.js',
    'src/js/restaurant_info.js',
  ]
	gulp.src(scriptsToCopy)
    .pipe(concat('restaurant_info.js'))
    .pipe(babel({
      presets: [['env',{ "modules": false }]]
    }))
    .pipe(uglify())
    .pipe(gulp.dest('dist/js/'));
});

gulp.task('main-scripts', () => {
  const scriptsToCopy = [
    'src/js/lazysizes.min.js',
    'src/js/idb.js',
    'src/js/dbhelper.js',
    'src/js/main.js',
  ]
	gulp.src(scriptsToCopy)
    .pipe(concat('main.js'))
    .pipe(babel({
      presets: [['env',{ "modules": false }]]
    }))
    .pipe(uglify())
    .pipe(gulp.dest('dist/js/'));
});

gulp.task('scripts', ['restaurant-scripts','main-scripts']);

// Transpile/Concat Sass and comppress styles
gulp.task('styles', () => {
  gulp.src('src/sass/styles.scss')
  .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
  .pipe(gulp.dest('dist/css'));
});

// Images
gulp.task('images', () => {
  gulp.src('src/img/**/*')
  .pipe(responsive({
    // produce multiple images from one source
    '*': [
      { 
        width: 800,
        rename: { suffix: '-large' }
      },{
        width: 560,
        rename: { suffix: '-small' }
      }
    ]
  }))
  .pipe(gulp.dest('dist/img'));
});