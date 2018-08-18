const gulp = require('gulp');
const sass = require('gulp-sass');
const browserSync = require('browser-sync').create();
const responsive = require('gulp-responsive');
const webpack = require('webpack');

gulp.task('build', ['move-files', 'scripts', 'styles', 'images']);

gulp.task('default', ['move-files', 'scripts', 'styles'], () => {
  gulp.start('preview-dist');
  gulp.watch('src/js/**/*.js', ['scripts-reload']);
  gulp.watch('src/*.*', ['move-reload']);
  gulp.watch('src/*.html', ['scripts-reload']);
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
  gulp.src(['src/*.*', '!src/*.html'])
    .pipe(gulp.dest('dist/'));
});

/* The follwing script tasks have now been replaced with webpack
Task to minify scripts
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
**/

gulp.task('scripts', (callback) => {
  webpack(require('./webpack.config.js'), (err, stats) => {
    if (err) console.log(err.toString());
    console.log(stats.toString());
    callback();
  });
});

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
    '!icon.png': [
      { 
        width: 800,
        rename: { suffix: '-large' }
      },{
        width: 560,
        rename: { suffix: '-small' }
      }
    ],
    'icon.png': [
      { 
        width: 192,
        rename: { suffix: '-192' }
      },{
        width: 512,
        rename: { suffix: '-512' }
      }
    ]
  }))
  .pipe(gulp.dest('dist/img'));
});