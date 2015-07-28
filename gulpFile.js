var gulp            = require('gulp');
//var sass            = require('gulp-sass');
var watch           = require('gulp-watch');
//var autoprefixer    = require('gulp-autoprefixer');
//var notify          = require("gulp-notify");
//var sourcemaps      = require('gulp-sourcemaps');
// Server
var browserSync     = require('browser-sync').create();
var reload          = browserSync.reload;
//var filter          = require('gulp-filter');
var proxyMiddleware = require('http-proxy-middleware');

gulp.task('default', ['serve']);


// Use BrowserSync to fire up a localhost server and start a livereload. We
// inject CSS changes, and reload fully for javascript and html changes.
// http://www.browsersync.io/docs/options/
gulp.task('serve', [], function() {// ['sass'], function() {

    browserSync.init({
        server: "./",
        notify: false,
        reloadOnRestart: true,
        open: false,
        middleware: [
            proxyMiddleware('', { target: 'http://localhost:3000' }),
        ]
    });
    
    gulp.watch('**/*.js').on('change', browserSync.reload);
    gulp.watch("*.html").on('change', browserSync.reload);
    
    //gulp.watch("Javascript/**/*.scss", ['sass']);
    //gulp.watch("sass/**/*.scss", ['sass']);
});
/*
gulp.task('sass', function () {
    gulp.src('./sass/screen.scss')

        // Include source maps so Chrome extension tools shows SASS line numbers
        .pipe(sourcemaps.init())
        .pipe(sass({
            sourcemap: true,
            style: 'compressed',
            onError: function(error) {

                // Log and notify any SASS errors and make a little bleep sound
                console.log(error);
                return notify({ sound: true }).write('line ' + error.line + ', ' + error.message);
            }
        }))

        // Autoprefix our generated CSS because duh
        .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))

        // We write our sourcemaps here after everythings been generated and such
        .pipe(sourcemaps.write("./"))

        // This should be a cross platform message and no sound
        .pipe(notify({ title: 'SASS Compiled!', message: '<%= file.relative %>', sound: false}))

        // So much magic
        .pipe(gulp.dest('css'))

        // Filter it so only .css files pass through to the reload, since the
        // map files also would trigger it (and trigger a full reload, which we
        // don't want, since we're just injecting the CSS here)
        .pipe(filter('*.css'))
        .pipe(reload({stream: true}));
});*/