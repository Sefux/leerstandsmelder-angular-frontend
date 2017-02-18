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
    rename = require('gulp-rename'),
    pug = require('gulp-pug'),
    less = require('gulp-less'),
    cleanCSS = require('gulp-clean-css'),
    sourcemaps = require('gulp-sourcemaps'),
    watch = require('gulp-watch'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    del = require('del'),
    connect = require('connect'),
    serveStatic = require('serve-static'),
    disc = require('disc'),
    jsdoc = require('gulp-jsdoc3'),
    gutil = require('gulp-util'),
    open = require('gulp-open'),
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
    var dest = [];
    pathAdd = pathAdd ? pathAdd : '';
    if (!env || env === 'web') {
        dest.push('./dist/web/' + pathAdd);
    }
    if (!env || env === 'mobile') {
        dest.push('./dist/mobile/' + pathAdd);
    }
    return dest;
}

function filterSourceDestPairs(sd, env) {
    var srcDest = [];
    if (!env || env === 'web') {
        srcDest.push(sd[0]);
    }
    if (!env || env === 'mobile') {
        srcDest.push(sd[1]);
    }
    return srcDest;
}

function serveApp(config) {
    return Promise.promisify(function (cb) {
        var app = connect();
        if (config.livereload) {
            app.use(require('connect-livereload')({port: config.livereload}));
        }
        app.use(serveStatic(config.root, {'index': ['index.html']}));
        app.use(function(req, res){
            fs.readFile(config.root + '/index.html', function (err, data) {
                if (err) {
                    throw err;
                }
                res.end(data);
            });
        });
        console.log(config.name + ' listening on port', config.port);
        app.listen(config.port, cb);
    })();
}



//
//
// Dependencies

gulp.task('deps', [
    'deps:js'
]);

gulp.task('deps:js', function (env) {
    return Promise.map(getPathsForEnv(env, 'js/'), function (dest) {
        var stream = gulp.src([
                'bower_components/lodash/lodash.min.js',
                'node_modules/jquery/dist/jquery.min.js',
                'bower_components/showdown/compressed/Showdown.min.js',
                'node_modules/marked/marked.min.js',
                'bower_components/codemirror/lib/codemirror.js',
                'bower_components/codemirror-spell-checker/dist/spell-checker.min.js',
                'bower_components/simplemde/dist/simplemde.min.js',
                'bower_components/bluebird/js/browser/bluebird.min.js',
                'bower_components/leaflet/dist/leaflet.js',
                'bower_components/leaflet-minimap/dist/Control.MiniMap.min.js',
                'bower_components/L.GeoSearch/src/js/l.control.geosearch.js',
                'bower_components/L.GeoSearch/src/js/l.geosearch.provider.openstreetmap.js',
                'bower_components/airbrake-js-client/dist/client.min.js',
	            'node_modules/leaflet.markercluster/dist/leaflet.markercluster.js'

            ])
            .pipe(concat('leerstandsmelder-angular-dependencies.min.js'))
            .pipe(header(banner, {pkg: pkg})).pipe(uglify());
        stream.pipe(gulp.dest(dest));
        return streamToPromise(stream);
    });
});



//
//
// JS

gulp.task('js', function (env) {
    var srcDest = [
        {src: 'src/web/js/app-web.js', dest: 'dist/web/js/'},
        {src: 'src/mobile/js/app-mobile.js', dest: 'dist/mobile/js/'}
    ];

    return Promise.map(filterSourceDestPairs(srcDest, env), function (sd) {
        var b = browserify({
            entries: sd.src,
            debug: false
        });
        var stream = b.bundle()
            .pipe(source(path.basename(sd.src)))
            .pipe(buffer())
            //.pipe(sourcemaps.init({loadMaps: true}))
            .on('error', gutil.log)
            .pipe(header(banner, {pkg: pkg}))
            .pipe(uglify())
            .pipe(rename('leerstandsmelder-angular-frontend.min.js'))
            //.pipe(sourcemaps.write('.', {includeContent: false, sourceRoot: '../../../'}));
        stream.pipe(gulp.dest(sd.dest));
        return streamToPromise(stream);
    });
});

//
//
// JS

gulp.task('js:maps', function (env) {
    var srcDest = [
        {src: 'src/web/js/app-web.js', dest: 'dist/web/js/'},
        {src: 'src/mobile/js/app-mobile.js', dest: 'dist/mobile/js/'}
    ];

    return Promise.map(filterSourceDestPairs(srcDest, env), function (sd) {
        var b = browserify({
            entries: sd.src,
            debug: false
        });
        var stream = b.bundle()
            .pipe(source(path.basename(sd.src)))
            .pipe(buffer())
            .pipe(sourcemaps.init())
            .on('error', gutil.log)
            .pipe(header(banner, {pkg: pkg}))
            //.pipe(uglify())
            .pipe(rename('leerstandsmelder-angular-frontend.min.js'))
            .pipe(sourcemaps.write('.', {includeContent: false, sourceRoot: '../../../'}));
        stream.pipe(gulp.dest(sd.dest));
        return streamToPromise(stream);
    });
});

gulp.task('js:analyze', function (env) {
    var srcDest = [
        {src: __dirname + '/src/web/js/app-web.js', dest: __dirname + '/dist/disc_web.html'},
        {src: __dirname + '/src/mobile/js/app-mobile.js', dest:  __dirname + '/dist/disc_mobile.html'}
    ];

    return Promise.map(filterSourceDestPairs(srcDest, env), function (sd) {
        var b = browserify(sd.src, {
            entries: sd.src,
            fullPaths: true
        });
        var stream = b.bundle()
            .pipe(disc())
            .pipe(fs.createWriteStream(sd.dest));
        return streamToPromise(stream);
    });
});



//
//
// CSS

function cssPipe(sd) {
    var stream = gulp.src(sd.src)
        .pipe(less())
        .pipe(cleanCSS())
        .pipe(header(banner, {pkg: pkg}))
        .pipe(rename({
            basename: 'leerstandsmelder-frontend-' + path.basename(sd.src, '.less')
        }));
    stream.pipe(gulp.dest(sd.dest));
    return streamToPromise(stream);
}

gulp.task('css', [
    'css:main',
    'css:deps'
]);

gulp.task('css:main', function (env) {
    var srcDest = [
        {src: './src/web/less/web.less', dest: './dist/web/css/'},
        {src: './src/mobile/less/mobile.less', dest: './dist/mobile/css/'}
    ];
    return Promise.map(filterSourceDestPairs(srcDest, env), cssPipe);
});

gulp.task('css:deps', function (env) {
    var srcDest = [
        {src: './src/shared/less/deps.less', dest: './dist/web/css/'},
        {src: './src/shared/less/deps.less', dest: './dist/mobile/css/'}
    ];
    return Promise.map(filterSourceDestPairs(srcDest, env), cssPipe);
});



//
//
// HTML

gulp.task('html', function (env) {
    return Promise.resolve()
        .then(function () {
            if (!env || env === 'web') {
                var stream = gulp.src(['./src/shared/pug/**/*.pug', './src/web/pug/**/*.pug']);
                stream.pipe(pug()).pipe(gulp.dest('./dist/web/'));
                return streamToPromise(stream);
            }
        })
        .then(function () {
            if (!env || env === 'mobile') {
                var stream = gulp.src(['./src/shared/pug/**/*.pug', './src/mobile/pug/**/*.pug']);
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
                var stream = gulp.src([
                    './bower_components/PruneCluster/dist/PruneCluster.js.map',
                    './bower_components/leerstandsmelder-apiclient/dist/leerstandsmelder-apiclient-web.js'
                ]);
                stream.pipe(gulp.dest(destBase + 'js/'));
                return streamToPromise(stream);
            })
            .then(function () {
                var stream = gulp.src([
                    './assets/images/**/*.*',
                    './bower_components/leaflet/dist/images/*',
                    './bower_components/leaflet-minimap/dist/images/*'
                ]);
                stream.pipe(gulp.dest(destBase + 'images/'));
                return streamToPromise(stream);
            })
            .then(function () {
                var stream = gulp.src([
                    './bower_components/font-awesome/fonts/*',
                    './assets/fonts/*'
                ]);
                stream.pipe(gulp.dest(destBase + 'fonts/'));
                return streamToPromise(stream);
            })
            .then(function () {
                var stream = gulp.src([
                    './node_modules/angular-ui-grid/ui-grid.ttf',
                    './node_modules/angular-ui-grid/ui-grid.woff',
                    './node_modules/angular-ui-grid/ui-grid.svg',
                    './node_modules/angular-ui-grid/ui-grid.eot',
                ]);
                stream.pipe(gulp.dest(destBase + 'css/'));
                return streamToPromise(stream);
            })
            .then(function () {
                var stream = gulp.src(['./src/shared/static/md/*.md']);
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
    watch(['src/web/js/**/*.js', 'src/mobile/js/**/*.js', 'src/shared/js/**/*.js', 'config.json'], function () {
        return streamToPromise(gulp.start('js')).then(connect.reload);
    });
    watch(['src/web/less/**/*.less', 'src/mobile/less/**/*.less','src/shared/less/**/*.less'], function () {
        return streamToPromise(gulp.start('css:main')).then(connect.reload);
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
        .then(function () {
            if (env && env !== 'web') {
                return;
            }
            serveApp({
                name: 'Web App',
                livereload: 35729,
                root: 'dist/web',
                port: 7888
            });
        })
        .then(function () {
            if (env && env !== 'mobile') {
                return;
            }
            serveApp({
                name: 'Mobile App',
                livereload: 35730,
                root: 'dist/mobile',
                port: 7070
            });
        });
});

gulp.task('serve:cordova', function () {
    serveApp({
        name: 'Cordova App',
        livereload: 35731,
        root: 'dist/cordova',
        port: 8090
    });
});

gulp.task('lint', function() {
    return gulp.src('./src/**/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'))
        .pipe(jshint.reporter('fail'));
});

gulp.task('test', [
    'build',
    'lint'
]);



//
//
// Build

gulp.task('clean', function () {
    return del(['dist']);
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
    'css',
    'html'
]);

// FIXME: build only works when cordova dir is removed, also runs through entire build for each update

gulp.task('build:android', function () {
    var icon = require('gulp-cordova-icon');
    var xml = require('gulp-cordova-xml');
    var author = require('gulp-cordova-author');
    var plugin = require('gulp-cordova-plugin');
    var android = require('gulp-cordova-build-android'),
        dst = gulp.dest('dist/android'),
        src = gulp.src('dist/mobile').pipe(require('gulp-cordova-create')({
            dir: 'dist/cordova',
            id: config.android.app_id,
            name: config.android.app_name
        }))
        .pipe(require('gulp-cordova-access')(config.android.access_origins))
        .pipe(require('gulp-cordova-preference')(config.android.prefs))
        .pipe(require('gulp-cordova-version')(pkg.version))
        .pipe(author(config.author.name,config.author.email,config.author.url))
        .pipe(require('gulp-cordova-description')(config.android.app_description))
        .pipe(plugin(config.android.plugins));
        // TODO: make release configurable
        //

        src.pipe(xml([
            '<splash src="www/images/splash/leerstandsmelder_splash.png"  />',
            '<preference name="BackupWebStorage" value="local" />'
        ]));


        src.pipe(icon('www/images/icons/leerstandsmelder_icon.png', { errorHandlingStrategy: 'warn' }));

    //'<splash src="www/images/Default@2x~iphone.png" width="640" height="960" />',
            // <!--
            //     ldpi    : 36x36 px
            //     mdpi    : 48x48 px
            //     hdpi    : 72x72 px
            //     xhdpi   : 96x96 px
            //     xxhdpi  : 144x144 px
            //     xxxhdpi : 192x192 px
            // -->
            //     <icon src="www/images/icons/android/drawable-ldpi/icon.png" density="ldpi" />
            //     <icon src="www/images/icons/android/drawable-mdpi/icon.png" density="mdpi" />
            //     <icon src="www/images/icons/android/drawable-hdpi/icon.png" density="hdpi" />
            //     <icon src="www/images/icons/android/drawable-xhdpi/icon.png" density="xhdpi" />
            //     <icon src="www/images/icons/android/drawable-xxhdpi/icon.png" density="xxhdpi" />
            //     <icon src="www/images/icons/android/drawable-xxxhdpi/icon.png" density="xxxhdpi" />
            //
       // src.pipe(android({storeFile: '../keys', keyAlias: 'leerstandsmelder'}));
        src.pipe(android({release: true}));
    return streamToPromise(src.pipe(dst));
});

gulp.task('build:ios', function () {
    var icon = require('gulp-cordova-icon');
    var xml = require('gulp-cordova-xml');
    var author = require('gulp-cordova-author');
    var plugin = require('gulp-cordova-plugin');
    var dst = require('gulp-cordova-build-ios')(),
        src = gulp.src('dist/mobile').pipe(require('gulp-cordova-create')({
            dir: 'dist/cordova',
            id: config.ios.app_id,
            name: config.ios.app_name
        }))
        .pipe(require('gulp-cordova-description')(config.android.app_description))
        .pipe(author(config.author.name,config.author.email,config.author.url))
        .pipe(require('gulp-cordova-version')(pkg.version))
        .pipe(plugin(config.ios.plugins));

        src.pipe(xml([
            '<splash src="www/images/splash/leerstandsmelder_splash.png" width="320" height="480" />',
            '<splash src="www/images/Default@2x~iphone.png" width="640" height="960" />',
            '<preference name="BackupWebStorage" value="local" />'
        ]));
        src.pipe(icon('www/images/icons/leerstandsmelder_icon.png', { errorHandlingStrategy: 'warn' }));

    return src.pipe(dst);
});



//
//
// Docs

gulp.task('doc', function () {
    return gulp.src(['README.md', './src/**/*.js'], {read: false})
        .pipe(jsdoc());
});