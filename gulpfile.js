'use strict';

const pkg = require('./package.json');
const gulp = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');
const beautify = require('gulp-jsbeautifier');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const browserify = require('browserify');
const watchify = require('watchify');
const babel = require('babelify');
const env = process.env.NODE_ENV + '';

const compile = watch => {
    const bundler = watchify(
        browserify({
            entries: [pkg.main],
            standalone: 'Service',
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
            .pipe(source('service.js'))
            .pipe(buffer())
            .pipe(sourcemaps.init({
                loadMaps: true
            }))
            //.pipe(uglify())
            .pipe(beautify())
            .pipe(sourcemaps.write('.'))
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

gulp.task('default', ['watch']);