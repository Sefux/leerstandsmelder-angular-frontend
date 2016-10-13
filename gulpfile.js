/* esversion: 6 */

'use strict';

var Promise = require('bluebird'),
    path = require('path'),
    gulp = require('gulp-param')(require('gulp'), process.argv),
    browserify = require('browserify'),
    buffer = require('vinyl-buffer'),
    source = require('vinyl-source-stream'),
    fs = require('fs'),
    header = require('gulp-header'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    pug = require('gulp-pug'),
    less = require('gulp-less'),
    minify = require('gulp-minify-css'),
    sourcemaps = require('gulp-sourcemaps'),
    watch = require('gulp-watch'),
    clean = require('gulp-clean'),
    connect = require('gulp-connect'),
    gutil = require('gulp-util'),
    pkg = require('./package.json'),
    config = require('./config.json');

var banner = ['/**',
    ' * <%= pkg.name %> - <%= pkg.description %>',
    ' * @version v<%= pkg.version %>',
    ' * @link <%= pkg.homepage %>',
    ' * @license <%= pkg.license %>',
    ' */',
    ''].join('\n');

function streamToPromise(stream) {
    return new Promise(function(resolve, reject) {
        stream.on("end", resolve);
        stream.on("error", reject);
    });
}

function getPathsForEnv(env, pathAdd) {
    let dest = [];
    pathAdd = pathAdd ? pathAdd : '';
    if (!env || env === 'web') {
        dest.push('./dist/web/' + pathAdd);
    }
    if (!env || env === 'mobile') {
        dest.push('./dist/mobile/' + pathAdd);
    }
    return dest;
}

function copySrcDest(src, dest) {
    return Promise.map(dest, function (dst) {
        let stream = gulp.src(src);
        stream.pipe(gulp.dest(dst));
        return streamToPromise(stream);
    });
}



//
//
// Dependencies

gulp.task('deps', [
    'deps:js',
    'deps:css'
]);

gulp.task('deps:js', function (env) {
    return Promise.map(getPathsForEnv(env, 'js/'), function (dest) {
        let stream = gulp.src([
                'bower_components/showdown/compressed/Showdown.min.js',
                'bower_components/codemirror/lib/codemirror.js',
                'bower_components/codemirror-spell-checker/dist/spell-checker.min.js',
                'bower_components/simplemde/dist/simplemde.min.js',
                'bower_components/bluebird/js/browser/bluebird.min.js',
                'bower_components/leaflet/dist/leaflet.js',
                'bower_components/PruneCluster/dist/PruneCluster.js',
                'bower_components/leaflet-minimap/dist/Control.MiniMap.min.js',
                'bower_components/L.GeoSearch/src/js/l.control.geosearch.js',
                'bower_components/L.GeoSearch/src/js/l.geosearch.provider.openstreetmap.js',
                'bower_components/airbrake-js-client/dist/client.min.js'
            ])
            .pipe(concat('leerstandsmelder-angular-dependencies.min.js'))
            .pipe(header(banner, {pkg: pkg}));
        stream.pipe(gulp.dest(dest));
        return streamToPromise(stream);
    });
});

gulp.task('deps:css', function (env) {
    return Promise.map(getPathsForEnv(env, 'css/'), function (dest) {
        let stream = gulp.src([
                'node_modules/angular-material/angular-material.min.css',
                'node_modules/angular-busy/dist/angular-busy.min.css',
                'bower_components/font-awesome/css/font-awesome.min.css',
                'bower_components/leaflet/dist/leaflet.css',
                'bower_components/PruneCluster/dist/LeafletStyleSheet.css',
                //'bower_components/leaflet-control-geocoder/Control.Geocoder.css',
                'bower_components/leaflet-minimap/dist/Control.MiniMap.min.css',
                'bower_components/L.GeoSearch/src/css/l.geosearch.css'
            ])
            .pipe(concat('leerstandsmelder-frontend-dependencies.min.css'))
            .pipe(header(banner, {pkg: pkg}));
        stream.pipe(gulp.dest(dest));
        return streamToPromise(stream);
    });
});



//
//
// JS

gulp.task('js', function (env) {
    let srcDest = [];
    if (!env || env === 'web') {
        srcDest.push({src: 'src/web/js/app-web.js', dest: 'dist/web/js/'});
    }
    if (!env || env === 'mobile') {
        srcDest.push({src: 'src/mobile/js/app-mobile.js', dest: 'dist/mobile/js/'});
    }

    return Promise.map(srcDest, (sd) => {
        let b = browserify({
            entries: sd.src,
            debug: true
        });
        let stream = b.bundle()
            .pipe(source(path.basename(sd.src)))
            .pipe(buffer())
            .pipe(sourcemaps.init({loadMaps: true}))
            .on('error', gutil.log)
            .pipe(header(banner, {pkg: pkg}))
            //.pipe(uglify())
            .pipe(rename('leerstandsmelder-angular-frontend.min.js'))
            .pipe(sourcemaps.write('./'));
        stream.pipe(gulp.dest(sd.dest));
        return streamToPromise(stream);
    });
});

gulp.task('js:copy', ['js:config'], function (env) {
    return copySrcDest(['./src/**/*.js'], getPathsForEnv(env, 'src/'));
});

gulp.task('js:config', function (env) {
    return copySrcDest(['./config.json'], getPathsForEnv(env, 'js/'));
});



//
//
// CSS

function cssPipe(src) {
    return src.pipe(less())
        .pipe(minify())
        .pipe(header(banner, {pkg: pkg}))
        .pipe(rename({
            basename: 'leerstandsmelder-frontend'
        }));
}

gulp.task('css', function (env) {
    return Promise.resolve()
        .then(() => {
            if (!env || env === 'web') {
                let stream = cssPipe(gulp.src('./src/web/less/web.less'));
                stream.pipe(gulp.dest('./dist/web/css/'));
                return streamToPromise(stream);
            }
        })
        .then(() => {
            if (!env || env === 'mobile') {
                let stream = cssPipe(gulp.src('./src/mobile/less/mobile.less'));
                stream.pipe(gulp.dest('./dist/mobile/css/'));
                return streamToPromise(stream);
            }
        });
});



//
//
// HTML

gulp.task('html', function (env) {
    return Promise.resolve()
        .then(() => {
            if (!env || env === 'web') {
                let stream = gulp.src(['./src/shared/pug/**/*.pug', './src/web/pug/**/*.pug']);
                stream.pipe(pug()).pipe(gulp.dest('./dist/web/'));
                return streamToPromise(stream);
            }
        })
        .then(() => {
            if (!env || env === 'mobile') {
                let stream = gulp.src(['./src/shared/pug/**/*.pug', './src/mobile/pug/**/*.pug']);
                stream.pipe(pug()).pipe(gulp.dest('./dist/mobile/'));
                return streamToPromise(stream);
            }
        });
});



//
//
// Assets

gulp.task('assets', function (env) {
    return Promise.map(getPathsForEnv(env), function (destBase) {
        return Promise.resolve()
            .then(function () {
                let stream = gulp.src([
                    './bower_components/PruneCluster/dist/PruneCluster.js.map',
                    './bower_components/leerstandsmelder-apiclient/dist/leerstandsmelder-apiclient-web.js',
                    './bower_components/requirejs/require.js',
                    './bower_components/requirejs-plugins/**/*.js'
                ]);
                stream.pipe(gulp.dest(destBase + 'js/'));
                return streamToPromise(stream);
            })
            .then(function () {
                let stream = gulp.src([
                    './assets/images/*',
                    './bower_components/leaflet/dist/images/*',
                    './bower_components/leaflet-minimap/dist/images/*'
                ]);
                stream.pipe(gulp.dest(destBase + 'images/'));
                return streamToPromise(stream);
            })
            .then(function () {
                let stream = gulp.src([
                    './bower_components/font-awesome/fonts/*',
                    './assets/fonts/*'
                ]);
                stream.pipe(gulp.dest(destBase + 'fonts/'));
                return streamToPromise(stream);
            })
            .then(function () {
                let stream = gulp.src(['./src/shared/static/md/*.md']);
                stream.pipe(gulp.dest(destBase + 'static/'));
                return streamToPromise(stream);
            });
    });
});



//
//
// Dev

gulp.task('dev', [
    'serve',
    'watch'
]);

gulp.task('watch', function () {
    watch(['src/web/js/**/*.js', 'src/mobile/js/**/*.js', 'src/shared/js/**/*.js', 'configuration.js'], function () {
        return streamToPromise(gulp.start('js')).then(connect.reload);
    });
    watch(['src/web/less/**/*.less', 'src/mobile/less/**/*.less','src/shared/less/**/*.less'], function () {
        return streamToPromise(gulp.start('css')).then(connect.reload);
    });
    watch(['src/web/pug/**/*.pug', 'src/mobile/pug/**/*.pug', 'src/shared/pug/**/*.pug'], function () {
        return streamToPromise(gulp.start('html')).then(connect.reload);
    });
    watch(['./assets/**/*', './src/shared/static/md/*.md'], function () {
        return streamToPromise(gulp.start('assets')).then(connect.reload);
    });
});

gulp.task('serve', function (env) {
    return Promise.resolve()
        .then(() => {
            if (env && env !== 'web') {
                return;
            }
            return connect.server({
                name: 'Web App',
                port: 8080,
                root: 'dist/web',
                livereload: true,
                fallback: 'index.html',
                middleware: function (conn, opts) {
                    return [
                        conn.static(opts.root),
                        conn.directory(opts.root),
                        function (req, res) { fs.readFile("#{opts.root}/index.html", function (err, html) { res.end(html); }); }
                    ];
                }
            });
        })
        .then(() => {
            if (env && env !== 'mobile') {
                return;
            }
            return connect.server({
                name: 'Mobile App',
                port: 7070,
                root: 'dist/mobile',
                livereload: true
            });
        });
});

gulp.task('serve:cordova', function () {
    return connect.server({
        name: 'Cordova Mobile App',
        port: 8090,
        root: 'dist/cordova',
        livereload: true
    });
});



//
//
// Build

gulp.task('clean', function () {
    let stream = gulp.src(['dist'], {read: false});
    stream.pipe(clean());
    return streamToPromise(stream);
});

gulp.task('release', [
    'clean'
], function () {
    return Promise.resolve(gulp.start('build'));
});

gulp.task('build', [
    'deps',
    'assets',
    'js',
    //'js:copy',
    'css',
    'html'
]);

// FIXME: build only works when cordova dir is removed, also runs through entire build for each update

gulp.task('build:android', function () {
    const create = require('gulp-cordova-create'),
        access = require('gulp-cordova-access'),
        pref = require('gulp-cordova-preference'),
        icon = require('gulp-cordova-icon'),
        version = require('gulp-cordova-version'),
        author = require('gulp-cordova-author'),
        description = require('gulp-cordova-description'),
        plugin = require('gulp-cordova-plugin'),
        xml = require('gulp-cordova-xml'),
        android = require('gulp-cordova-build-android');
    let stream = gulp.src('dist/mobile').pipe(create({
            dir: 'dist/cordova',
            id: config.android.app_id,
            name: config.android.app_name
        }))
        .pipe(access(config.android.access_origins))
        .pipe(pref(config.android.prefs))
        // .pipe(icon('res/my-icon.png'))
        .pipe(version(require('./package.json').version))
        .pipe(author('Gängeviertel e.V.', 'info@leerstandsmelder.de'))
        .pipe(description(''))
        // .pipe(xml('<access origin="*" />'))
        .pipe(plugin(config.android.plugins))
        // TODO: make release configurable
        .pipe(android({release: false}));
    stream.pipe(gulp.dest('dist/android'));
    return streamToPromise(stream);
});

gulp.task('build:ios', function () {
    const create = require('gulp-cordova-create'),
        version = require('gulp-cordova-version'),
        plugin = require('gulp-cordova-plugin'),
        ios = require('gulp-cordova-build-ios');
    let stream = gulp.src('dist/mobile').pipe(create({
            dir: 'dist/cordova',
            id: config.ios.app_id,
            name: config.ios.app_name
        }))
        .pipe(version(require('./package.json').version))
        .pipe(plugin(config.ios.plugins));
    stream.pipe(ios());
    return streamToPromise(stream);
});
