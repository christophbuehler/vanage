'use strict';

const pkg = require('./package.json');
const gulp = require('gulp');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const browserify = require('browserify');
const watchify = require('watchify');
const babel = require('babelify');
const plugins = require('gulp-load-plugins')();

const env = process.env.NODE_ENV + '';

const compile = watch => {
    const bundler = watchify(
        browserify({
            entries: [pkg.main],
            standalone: 'Vanage',
            extensions: ['js']
        }).transform(babel.configure({
            presets: ['es2015']
        }))
    );

    const rebundle = () => {
        bundler.bundle()
            .on('error', err => { 
                console.error(`Bundling failed: ${err.message}`);
            })
            .pipe(source('vanage.js'))
            .pipe(buffer())
            .pipe(plugins.sourcemaps.init({
                loadMaps: true
            }))
            .pipe(plugins.jsbeautifier())
            .pipe(plugins.sourcemaps.write('.'))
            .pipe(gulp.dest('./dist'));
    }

    if (watch) {
        bundler.on('update', () => {
            console.log('Bundling new exports ...');
            rebundle();
        });
    }

    rebundle();
}

const watch = () => {
    return compile(true);
};

gulp.task('build', () => { return compile(); });
gulp.task('watch', () => { return watch(); });

gulp.task('compress', ['build'], () => {
    return gulp.src('./dist/vanage.js')
        .pipe(plugins.sourcemaps.init({
                loadMaps: true
        }))
        .pipe(plugins.uglify())
        .pipe(plugins.rename('vanage.min.js'))
        .pipe(plugins.sourcemaps.write('.'))
        .pipe(gulp.dest('./dist'));
});

gulp.task('default', ['compress']);
gulp.task('develop', ['build', 'watch']);