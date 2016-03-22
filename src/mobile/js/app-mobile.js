/* global angular,define */

define([
    'lang_de',
    'lang_en',
    'config',
    'services_api',
    'services_auth',
    'services_feature',
    'services_helpers',
    'controllers_widgets',
    'controllers_site',
    'controllers_users',
    'controllers_locations',
    'controllers_posts',
    'controllers_regions',
    'directives_helpers',
    'directives_maps'
], function (lang_de, lang_en) {
    return angular.module('leerstandsmelder', [
            'ngAria',
            'ngMaterial',
            'ngRoute',
            'ngSanitize',
            'ngAnimate',
            'ngFileUpload',
            'seo',
            'cgBusy',
            'angularPubsub',
            'pascalprecht.translate',
            'ngCookies',
            'leerstandsmelder.controllers.widgets',
            'leerstandsmelder.controllers.site',
            'ito.auth.angular.controllers.users',
            'ito.auth.angular.directives.helpers',
            'ito.angular.services.dataviewer.feature',
            'ito.angular.directives.dataviewer.maps',
            'leerstandsmelder.controllers.locations',
            'leerstandsmelder.controllers.posts',
            'leerstandsmelder.controllers.regions',
            'leerstandsmelder.services.helpers'
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

                $routeProvider.when('/', {templateUrl: '/regions_list.html', controller: 'Regions.List'});

                $routeProvider.when('/users/login', {templateUrl: '/users_login.html', controller: 'Users.Login'});
                $routeProvider.when('/users/logout', {templateUrl: '/users_logout.html', controller: 'Users.Logout'});
                $routeProvider.when('/users/create', {templateUrl: '/users_create.html', controller: 'Users.Create'});
                $routeProvider.when('/users/forgot', {templateUrl: '/users_forgot.html', controller: 'Users.Forgot'});
                $routeProvider.when('/users/me', {templateUrl: '/users_update.html', controller: 'Users.Edit'});
                $routeProvider.when('/users/confirm/:token', {
                    templateUrl: '/users_confirm.html',
                    controller: 'Users.Confirm'
                });
                $routeProvider.when('/locations/create', {
                    templateUrl: '/locations_create.html',
                    controller: 'Locations.Create'
                });
                $routeProvider.when('/locations/update/:uuid', {
                    templateUrl: '/locations_update.html',
                    controller: 'Locations.Edit'
                });
                $routeProvider.when('/locations/:uuid', {
                    templateUrl: '/locations_show.html',
                    controller: 'Locations.Show'
                });
                $routeProvider.when('/posts/:uuid', {templateUrl: '/posts_show.html', controller: 'Posts.Show'});
                $routeProvider.when('/regions/:uuid', {templateUrl: '/regions_show.html', controller: 'Regions.Show'});

                $routeProvider.otherwise({redirectTo: '/'});

            }]).run(['$rootScope', '$q', function ($rootScope, $q) {
            $rootScope.$on('$routeChangeStart', function () {
                $rootScope.pageDefer = $q.defer();
                $rootScope.pagePromise = $rootScope.pageDefer.promise;
            });
            $rootScope.$on('$routeChangeSuccess', function () {
                $rootScope.pageDefer.resolve();
            });
            $rootScope.$on('$routeChangeError', function () {
                $rootScope.pageDefer.reject();
            });
        }]);
});