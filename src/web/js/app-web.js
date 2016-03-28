/* global angular,define */

define([
    'lang_de',
    'lang_en',
    'routes',
    'config',
    'services_api',
    'services_auth',
    'services_map',
    'services_helpers',
    'controllers_widgets',
    'controllers_site',
    'controllers_users',
    'controllers_locations',
    'controllers_posts',
    'controllers_regions',
    'directives_helpers',
    'directives_map',
    'directives_widgets'
], function (lang_de, lang_en, routes) {
    return angular.module('leerstandsmelder', [
            'ngAria',
            'ngMaterial',
            'ngRoute',
            'ngSanitize',
            'ngAnimate',
            'ngFileUpload',
            'btford.markdown',
            'cgBusy',
            'angularPubsub',
            'pascalprecht.translate',
            'ngCookies',
            'lsm.services.helpers',
            'lsm.services.map',
            'lsm.directives.helpers',
            'lsm.directives.map',
            'lsm.directives.widgets',
            'lsm.controllers.locations',
            'lsm.controllers.posts',
            'lsm.controllers.regions',
            'lsm.controllers.site',
            'lsm.controllers.users',
            'lsm.controllers.widgets'
        ])
        .config([
            '$routeProvider',
            '$locationProvider',
            '$animateProvider',
            '$translateProvider',
            '$mdThemingProvider',
            function ($routeProvider, $locationProvider, $animateProvider, $translateProvider, $mdThemingProvider) {

                // todo: abstract this theme style out to config
                $mdThemingProvider.theme('default')
                    .primaryPalette('blue-grey')
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
});