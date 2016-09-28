/* global angular,define */

define([
    'lang_de',
    'lang_en',
    'routes',
    'config',
    'controllers_widgets',
    'controllers_site',
    'controllers_users',
    'controllers_locations',
    'controllers_messages',
    'controllers_posts',
    'controllers_regions',
    'filters_navrewrite'
], function (lang_de, lang_en, routes) {
    return angular.module('leerstandsmelder', [
        'ngAria',
        'ngMaterial',
        'ngRoute',
        'ngSanitize',
        'ngAnimate',
        'ngCookies',
        'cgBusy',
        'pascalprecht.translate',
        'lsm.controllers.locations',
        'lsm.controllers.messages',
        'lsm.controllers.posts',
        'lsm.controllers.regions',
        'lsm.controllers.site',
        'lsm.controllers.users',
        'lsm.controllers.widgets',
        'lsm.filters.navrewrite'
    ])
        .config([
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

                // todo: abstract this theme style out to config
                $mdThemingProvider.theme('default')
                    .primaryPalette('leerstand')
                    .accentPalette('deep-orange')
                    .warnPalette('red');

                // todo: check user preference with custom pref
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
                    enabled: false
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
});