/* global angular,define */

define([
    'lang_de',
    'lang_en',
    'config',
    'services_api',
    'services_auth',
    'controllers_widgets',
    'controllers_site',
    'controllers_users',
    'controllers_locations',
    'controllers_posts',
    'controllers_regions',
    'services_dataviewer_feature',
    'directives_helpers',
    'directives_dataviewer_maps'
], function (lang_de, lang_en) {
    return angular.module('leerstandsmelder', [
        'ngAria',
        'ngMaterial',
        'ngRoute',
        'ngSanitize',
        'ngAnimate',
        'ngFileUpload',
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
        'leerstandsmelder.controllers.regions'
    ])
        .config([
            '$routeProvider',
            '$locationProvider',
            '$animateProvider',
            '$translateProvider',
            '$mdThemingProvider',
            function($routeProvider, $locationProvider, $animateProvider, $translateProvider, $mdThemingProvider) {

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

                $routeProvider.when('/', {templateUrl: '/welcome.html', controller: 'Regions.List'});

                $routeProvider.when('/login', {templateUrl: '/auth/jade/login.html', controller: 'Users.Login'});
                $routeProvider.when('/logout', {templateUrl: '/auth/jade/login.html', controller: 'Users.Logout'});
                $routeProvider.when('/signup', {templateUrl: '/auth/jade/signup.html', controller: 'Users.Create'});
                $routeProvider.when('/forgot', {templateUrl: '/auth/jade/forgot.html', controller: 'Users.Forgot'});
                $routeProvider.when('/profile', {templateUrl: '/auth/jade/profile.html', controller: 'Users.Edit'});
                $routeProvider.when('/locations/new', {templateUrl: '/locations_create.html', controller: 'Locations.Create'});
                $routeProvider.when('/locations/edit/:uuid', {templateUrl: '/locations_edit.html', controller: 'Locations.Edit'});
                $routeProvider.when('/locations/:uuid', {templateUrl: '/locations_view.html', controller: 'Locations.Show'});
                $routeProvider.when('/posts/:uuid', {templateUrl: '/posts_view.html', controller: 'Posts.Show'});
                $routeProvider.when('/regions/:uuid', {templateUrl: '/region.html', controller: 'Regions.Show'});

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