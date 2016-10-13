'use strict';

var lang_de = require('../../shared/js/lang/de'),
    lang_en = require('../../shared/js/lang/en'),
    routes = require('./routes'),
    angular = require('angular'),
    app = angular.module('leerstandsmelder', [
        require('angular-animate'),
        require('angular-messages'),
        require('angular-translate'),
        require('angular-translate-storage-cookie'),
        require('angular-translate-storage-local'),
        require('angular-translate-loader-static-files'),
        require('ng-file-upload'),
        require('angular-busy2'),
        require('angular-material'),
        // TODO: this is a new, more recent repo. check if this still works
        require('md-data-table'),
        // FIXME: this is breaking the app...
        //require('angular-markdown-directive'),
        require('angular-aria'),
        require('angular-cookies'),
        require('angular-route'),
        require('angular-sanitize')
    ]);

require('../../shared/js/controllers');
require('../../shared/js/directives');
require('../../shared/js/filters');
require('../../shared/js/services');

app.provider('PubSub', require('angular-pubsub'));

app.factory('assetPath', require('./services/assetpath'));

app.config([
    '$routeProvider',
    '$locationProvider',
    '$animateProvider',
    '$translateProvider',
    '$mdThemingProvider',
    '$compileProvider',
    '$mdGestureProvider',
    function ($routeProvider, $locationProvider, $animateProvider, $translateProvider, $mdThemingProvider, $compileProvider, $mdGestureProvider) {
        // this should stop the clickjacker
        $mdGestureProvider.skipClickHijack();

        // this is supposed to speed up render times.
        $compileProvider.debugInfoEnabled(false);
        var whiteMap = $mdThemingProvider.extendPalette('grey', {
            '500': '#dddddd',
            'contrastDefaultColor': 'dark'
        });
        $mdThemingProvider.definePalette('white', whiteMap);

        // added the leerstand color to the palette

        var leerstandMap = $mdThemingProvider.extendPalette('white', {
            '500': 'ed1c24'
        });
        $mdThemingProvider.definePalette('leerstand', leerstandMap);

        // TODO: abstract this theme style out to config
        $mdThemingProvider.theme('default')
            .primaryPalette('leerstand')
            .accentPalette('deep-orange')
            .warnPalette('red');

        // TODO: check user preference with custom pref
        // see: http://angular-translate.github.io/docs/en/#/guide/11_custom-storages
        $translateProvider
            .determinePreferredLanguage()
            .useLocalStorage()
            .useSanitizeValueStrategy('escaped')
            .preferredLanguage('de')
            .usePostCompiling(true)
            .translations('en', lang_en)
            .translations('de', lang_de);

        $animateProvider.classNameFilter(/animate-/);

        $locationProvider.html5Mode({
            enabled: true
        });

        for (var i in routes) {
            if (routes[i] instanceof Object) {
                $routeProvider.when(routes[i].route, {
                    templateUrl: routes[i].templateUrl,
                    controller: routes[i].controller
                });
            }
        }

        $routeProvider.otherwise({redirectTo: '/'});
    }]);