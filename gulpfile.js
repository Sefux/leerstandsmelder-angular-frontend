var gulp = require('gulp'),
    fs = require('fs'),
    header = require('gulp-header'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    gulpCopy = require('gulp-copy'),
    jade = require('gulp-jade'),
    less = require('gulp-less'),
    minify = require('gulp-minify-css'),
    requirejsOptimize = require('gulp-requirejs-optimize'),
    sourcemaps = require('gulp-sourcemaps'),
    watch = require('gulp-watch'),
    connect = require('gulp-connect'),
    phonegapBuild = require('gulp-phonegap-build'),
    pkg = require('./package.json'),
    pgConf = require('./phonegap.json');

var banner = ['/**',
    ' * <%= pkg.name %> - <%= pkg.description %>',
    ' * @version v<%= pkg.version %>',
    ' * @link <%= pkg.homepage %>',
    ' * @license <%= pkg.license %>',
    ' */',
    ''].join('\n');

//
//
// JS building

gulp.task('js-deps', function () {
    return gulp.src([
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
        .pipe(header(banner, {pkg: pkg}))
        .pipe(gulp.dest('./dist/web/js/'))
        .pipe(gulp.dest('./dist/mobile/www/js/'));
});

gulp.task('js-web', function () {
    return gulp.src('src/web/js/app.build.js')
        .pipe(sourcemaps.init())
        .pipe(requirejsOptimize())
        .pipe(header(banner, {pkg: pkg}))
        .pipe(rename('leerstandsmelder-angular-frontend.min.js'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('dist/web/js/'));
});

gulp.task('js-mobile', function () {
    return gulp.src('src/mobile/js/main.js')
        .pipe(requirejsOptimize())
        .pipe(header(banner, {pkg: pkg}))
        .pipe(rename('leerstandsmelder-angular-frontend.min.js'))
        .pipe(gulp.dest('dist/mobile/www/js/'));
});


//
//
// CSS building

gulp.task('css-deps', function () {
    return gulp.src([
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
        .pipe(header(banner, {pkg: pkg}))
        .pipe(gulp.dest('./dist/web/css/'))
        .pipe(gulp.dest('./dist/mobile/www/css/'));
});

function cssPipe(src, destPath) {
    return src.pipe(less())
        .pipe(minify())
        .pipe(header(banner, {pkg: pkg}))
        .pipe(rename({
            basename: 'leerstandsmelder-frontend'
        }))
        .pipe(gulp.dest(destPath));
}

gulp.task('css-web', function () {
    return cssPipe(gulp.src('./src/web/less/web.less'), './dist/web/css/');
});

gulp.task('css-mobile', function () {
    return cssPipe(gulp.src('./src/mobile/less/mobile.less'), './dist/mobile/www/css/');
});


//
//
// HTML building

function htmlPipe(src, destPath) {
    return src.pipe(jade())
        .pipe(gulp.dest(destPath));
}

gulp.task('html-web', function () {
    return htmlPipe(gulp.src(['./src/shared/jade/**/*.jade', './src/web/jade/**/*.jade']), './dist/web/');

});

gulp.task('html-mobile', function () {
    return htmlPipe(gulp.src(['./src/shared/jade/**/*.jade', './src/mobile/jade/**/*.jade']), './dist/mobile/www/');
});


//
//
// Copy tasks

function copyPipe(src, destPath, prefix) {
    return src.pipe(gulpCopy(destPath, {prefix: prefix}));
}
gulp.task('copy-js', function () {
    copyPipe(gulp.src(['./bower_components/PruneCluster/dist/PruneCluster.js.map']), './dist/mobile/www/js/', 3);
    return copyPipe(gulp.src(['./bower_components/PruneCluster/dist/PruneCluster.js.map']), './dist/web/js/', 3);
});

gulp.task('copy-requirejs', function () {
    copyPipe(gulp.src(['./bower_components/requirejs/require.js']), './dist/mobile/www/js/', 2);
    return copyPipe(gulp.src(['./bower_components/requirejs/require.js']), './dist/web/js/', 2);
});

gulp.task('copy-apiclient', function () {
    copyPipe(gulp.src(['./bower_components/leerstandsmelder-apiclient/dist/leerstandsmelder-apiclient-web.js']), './dist/mobile/www/js/', 3);
    return copyPipe(gulp.src(['./bower_components/leerstandsmelder-apiclient/dist/leerstandsmelder-apiclient-web.js']), './dist/web/js/', 3);
});

gulp.task('copy-js-src', function () {
    copyPipe(gulp.src(['./src/**/*.js']), './dist/mobile/www/src/', 1);
    return copyPipe(gulp.src(['./src/**/*.js']), './dist/web/src/', 1);
});

gulp.task('copy-js-config', function () {
    copyPipe(gulp.src(['./configuration.js']), './dist/mobile/www/js/');
    return copyPipe(gulp.src(['./configuration.js']), './dist/web/js/');
});

gulp.task('copy-web', function () {
    copyPipe(gulp.src(['./bower_components/font-awesome/fonts/*','./assets/fonts/*']), './dist/web/fonts/', 3);
    copyPipe(gulp.src(['./assets/images/*']), './dist/web/images/', 2);
    copyPipe(gulp.src(['./bower_components/leaflet/dist/images/*']), './dist/web/', 3);
    copyPipe(gulp.src(['./bower_components/leaflet-minimap/dist/images/*']), './dist/web/');
    copyPipe(gulp.src(['./src/shared/static/md/*.md']), './dist/web/', 2);
});

gulp.task('copy-mobile', function () {
    copyPipe(gulp.src(['./bower_components/font-awesome/fonts/*','./assets/fonts/*']), './dist/mobile/www/fonts/', 3);
    copyPipe(gulp.src(['./assets/images/*']), './dist/mobile/www/images/', 2);
    copyPipe(gulp.src(['./bower_components/leaflet/dist/images/*']), './dist/mobile/www/', 3);
    copyPipe(gulp.src(['./bower_components/leaflet-minimap/dist/images/*']), './dist/web/');
    copyPipe(gulp.src(['./src/shared/static/md/*.md']), './dist/mobile/www/', 2);
});



//
//
// Dev tasks

gulp.task('watch-web', function () {
    // watch(['src/web/js/**/*.js', 'src/shared/js/**/*.js', 'configuration.js'], function () {
    //     gulp.start('js-web');
    // });
    watch(['src/web/less/**/*.less','src/shared/less/**/*.less'], function () {
        gulp.start('css-web')
            .pipe(connect.reload());
    });
    watch(['src/web/jade/**/*.jade', 'src/shared/jade/**/*.jade'], function () {
        gulp.start('html-web')
            .pipe(connect.reload());
    });
});

gulp.task('watch-web-src', function () {
    watch(['src/web/js/**/*.js', 'src/shared/js/**/*.js', 'configuration.js'], function () {
        gulp.start('copy-js-src')
            .pipe(connect.reload());
    });
});

gulp.task('server-web', function () {
    connect.server({
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
});

gulp.task('server-mobile', function () {
    connect.server({
        name: 'Mobile App',
        port: 8090,
        root: 'dist/mobile/www',
        livereload: true
    });
});




//
//
// Phonegap build task

gulp.task('phonegap-build', function () {
    var user;
    if (pgConf.token) {
        user = {
            token: pgConf.token
        };
    } else {
        user = {
            email: pgConf.email,
            password: pgConf.password
        };
    }
    gulp.src('dist/mobile/**/*')
        .pipe(phonegapBuild({
            "isRepository": false,
            "appId": pgConf.appId,
            "user": user
        }));
});


//
//
// combined tasks

gulp.task('web', [
    'js-deps',
    //'js-web',
    'copy-requirejs',
    'copy-apiclient',
    'copy-web',
    'copy-js-config',
    'copy-js-src',
    'css-deps',
    'css-web',
    'html-web',
    'copy-web',
    'copy-js'
]);

gulp.task('mobile', [
    'js-deps',
    //'js-mobile',
    'copy-requirejs',
    'copy-mobile',
    'copy-js-config',
    'copy-js-src',
    'css-deps',
    'css-mobile',
    'html-mobile',
    'copy-mobile',
    'copy-js'
]);

gulp.task('default', [
    'web',
    'mobile'
]);