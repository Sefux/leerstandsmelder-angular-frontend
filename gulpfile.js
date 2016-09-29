var Promise = require('bluebird'),
    gulp = require('gulp-param')(require('gulp'), process.argv),
    fs = require('fs'),
    header = require('gulp-header'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    jade = require('gulp-jade'),
    less = require('gulp-less'),
    minify = require('gulp-minify-css'),
    requirejsOptimize = require('gulp-requirejs-optimize'),
    sourcemaps = require('gulp-sourcemaps'),
    watch = require('gulp-watch'),
    clean = require('gulp-clean'),
    connect = require('gulp-connect'),
    pkg = require('./package.json');

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

//
//
// Dependencies

gulp.task('deps:js', function (env) {
    let depsPipe = gulp.src([
        'bower_components/ng-file-upload/ng-file-upload-shim.min.js',
        'bower_components/angular/angular.min.js',
        'bower_components/angular-animate/angular-animate.min.js',
        'bower_components/angular-aria/angular-aria.min.js',
        'bower_components/angular-busy/dist/angular-busy.min.js',
        'bower_components/angular-cookies/angular-cookies.min.js',
        'bower_components/angular-material/angular-material.min.js',
        'bower_components/angular-messages/angular-messages.min.js',
        'bower_components/angular-route/angular-route.min.js',
        'bower_components/angular-sanitize/angular-sanitize.min.js',
        'bower_components/angular-translate/angular-translate.min.js',
        'bower_components/angular-material-data-table/dist/md-data-table.min.js',
        'bower_components/showdown/compressed/Showdown.min.js',
        'bower_components/angular-markdown-directive/markdown.js',
        'bower_components/codemirror/lib/codemirror.js',
        'bower_components/codemirror-spell-checker/dist/spell-checker.min.js',
        'bower_components/simplemde/dist/simplemde.min.js',
        'bower_components/async/dist/async.min.js',
        'bower_components/bluebird/js/browser/bluebird.min.js',
        'bower_components/ng-file-upload/ng-file-upload.min.js',
        'bower_components/angular-pubsub/dist/angular-pubsub.js',
        'bower_components/leaflet/dist/leaflet.js',
        'bower_components/PruneCluster/dist/PruneCluster.js',
        'bower_components/leaflet-minimap/dist/Control.MiniMap.min.js',
        'bower_components/L.GeoSearch/src/js/l.control.geosearch.js',
        'bower_components/L.GeoSearch/src/js/l.geosearch.provider.openstreetmap.js',
        'bower_components/angular-translate-storage-cookie/angular-translate-storage-cookie.min.js',
        'bower_components/angular-translate-storage-local/angular-translate-storage-local.min.js',
        'bower_components/angular-translate-loader-static-files/angular-translate-loader-static-files.js',
        'bower_components/airbrake-js-client/dist/client.min.js'
    ])
        .pipe(concat('leerstandsmelder-angular-dependencies.min.js'))
        .pipe(header(banner, {pkg: pkg}));
    return Promise.resolve()
        .then(() => {
            if (!env || env == 'web') {
                return streamToPromise(depsPipe.pipe(gulp.dest('./dist/web/js/')));
            }
        })
        .then(() => {
            if (!env || env == 'web') {
                return streamToPromise(depsPipe.pipe(gulp.dest('./dist/mobile/www/js/')));
            }
        });
});

gulp.task('deps:css', function (env) {
    let depsPipe = gulp.src([
        'bower_components/angular-material/angular-material.min.css',
        'bower_components/angular-busy/dist/angular-busy.min.css',
        'bower_components/font-awesome/css/font-awesome.min.css',
        'bower_components/leaflet/dist/leaflet.css',
        'bower_components/PruneCluster/dist/LeafletStyleSheet.css',
        //'bower_components/leaflet-control-geocoder/Control.Geocoder.css',
        'bower_components/leaflet-minimap/dist/Control.MiniMap.min.css',
        'bower_components/L.GeoSearch/src/css/l.geosearch.css'
    ])
        .pipe(concat('leerstandsmelder-frontend-dependencies.min.css'))
        .pipe(header(banner, {pkg: pkg}));
    return Promise.resolve()
        .then(() => {
            if (!env || env == 'web') {
                return depsPipe.pipe(gulp.dest('./dist/web/css/'));
            }
        })
        .then(() => {
            if (!env || env == 'web') {
                return depsPipe.pipe(gulp.dest('./dist/mobile/www/css/'));
            }
        });
});



//
//
// JS

gulp.task('js', function (env) {
    let srcDest = [];
    if (!env || env == 'web') {
        srcDest.push({src: 'src/web/js/app.build.js', dest: 'dist/web/js/'});
    }
    if (!env || env == 'mobile') {
        srcDest.push({src: 'src/mobile/js/main.js', dest: 'dist/mobile/js/'});
    }
    return Promise.map(srcDest, (sd) => {
        return gulp.src(sd.src)
            .pipe(sourcemaps.init())
            .pipe(requirejsOptimize())
            .pipe(header(banner, {pkg: pkg}))
            .pipe(rename('leerstandsmelder-angular-frontend.min.js'))
            .pipe(sourcemaps.write())
            .pipe(gulp.dest(sd.dest));
    });
});

gulp.task('js:copy', ['js:config'], function (env) {
    return Promise.resolve()
        .then(() => {
            if (!env || env == 'web') {
                return gulp.src(['./src/**/*.js']).pipe(gulp.dest('./dist/web/src/'));
            }
        })
        .then(() => {
            if (!env || env == 'mobile') {
                return gulp.src(['./src/**/*.js']).pipe(gulp.dest('./dist/mobile/www/src/'));
            }
        });
});

gulp.task('js:config', function (env) {
    return Promise.resolve()
        .then(() => {
            if (!env || env == 'web') {
                return gulp.src('./configuration.js').pipe(gulp.dest('./dist/web/js/'));
            }
        })
        .then(() => {
            if (!env || env == 'mobile') {
                return gulp.src('./configuration.js').pipe(gulp.dest('./dist/mobile/www/js/'));
            }
        });
});



//
//
// CSS

function cssPipe(src, destPath) {
    return src.pipe(less())
        .pipe(minify())
        .pipe(header(banner, {pkg: pkg}))
        .pipe(rename({
            basename: 'leerstandsmelder-frontend'
        }))
        .pipe(gulp.dest(destPath));
}

gulp.task('css', function (env) {
    return Promise.resolve()
        .then(() => {
            if (!env || env == 'web') {
                return cssPipe(gulp.src('./src/web/less/web.less'), './dist/web/css/');
            }
        })
        .then(() => {
            if (!env || env == 'mobile') {
                return cssPipe(gulp.src('./src/mobile/less/mobile.less'), './dist/mobile/www/css/');
            }
        });
});



//
//
// HTML

gulp.task('html', function (env) {
    return Promise.resolve()
        .then(() => {
            if (!env || env == 'web') {
                return gulp.src(['./src/shared/jade/**/*.jade', './src/web/jade/**/*.jade']).pipe(jade()).pipe(gulp.dest('./dist/web/'));
            }
        })
        .then(() => {
            if (!env || env == 'mobile') {
                return gulp.src(['./src/shared/jade/**/*.jade', './src/mobile/jade/**/*.jade']).pipe(jade()).pipe(gulp.dest('./dist/mobile/www/'));
            }
        });
});



//
//
// Assets

gulp.task('assets', function (env) {
    let dest = [];
    if (!env || env == 'web') {
        dest.push('dist/web/');
    }
    if (!env || env == 'mobile') {
        dest.push('dist/mobile/www/');
    }
    return Promise.map(dest, (destBase) => {
        Promise.resolve()
            .then(() => {
                return gulp.src([
                    './bower_components/PruneCluster/dist/PruneCluster.js.map',
                    './bower_components/leerstandsmelder-apiclient/dist/leerstandsmelder-apiclient-web.js',
                    './bower_components/requirejs/require.js'
                ]).pipe(gulp.dest(destBase + 'js/'));
            })
            .then(() => {
                return gulp.src([
                    './assets/images/*',
                    './bower_components/leaflet/dist/images/*',
                    './bower_components/leaflet-minimap/dist/images/*'
                ]).pipe(gulp.dest(destBase + 'images/'));
            })
            .then(() => {
                return gulp.src([
                    './bower_components/font-awesome/fonts/*',
                    './assets/fonts/*'
                ]).pipe(gulp.dest(destBase + 'fonts/'));
            })
            .then(() => {
                return gulp.src(['./src/shared/static/md/*.md']).pipe(gulp.dest(destBase + 'static/'));
            });
    });
});



//
//
// Dev tasks

gulp.task('clean', function () {
    return gulp.src(['dist/web', 'dist/mobile/www'], {read: false}).pipe(clean());
});

gulp.task('watch', function () {
    watch(['src/web/js/**/*.js', 'src/mobile/js/**/*.js', 'src/shared/js/**/*.js', 'configuration.js'], function () {
        return streamToPromise(gulp.start('js:copy')).then(connect.reload);
    });
    watch(['src/web/less/**/*.less', 'src/mobile/less/**/*.less','src/shared/less/**/*.less'], function () {
        return streamToPromise(gulp.start('css')).then(connect.reload);
    });
    watch(['src/web/jade/**/*.jade', 'src/mobile/jade/**/*.jade', 'src/shared/jade/**/*.jade'], function () {
        return streamToPromise(gulp.start('html')).then(connect.reload);
    });
    watch(['./assets/**/*', './src/shared/static/md/*.md'], function () {
        return streamToPromise(gulp.start('assets')).then(connect.reload);
    });
});

gulp.task('serve', function (env) {
    return Promise.resolve()
        .then(() => {
            if (env && env != 'web') return;
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
                        function (req, res) { fs.readFile("#{opts.root}/index.html", function (err, html) { res.end(html); }) }
                    ];
                }
            });
        })
        .then(() => {
            if (env && env != 'mobile') return;
            return connect.server({
                name: 'Mobile App',
                port: 8090,
                root: 'dist/mobile/www',
                livereload: true
            });
        });
});



//
//
// Combined tasks

gulp.task('release', [
    'clean'
], function () {
    gulp.start('build');
});

gulp.task('dev', [
    'serve',
    'watch'
]);

gulp.task('build', [
    'deps:js',
    'deps:css',
    'assets',
    //'js',
    'js:copy',
    'css',
    'html'
]);
