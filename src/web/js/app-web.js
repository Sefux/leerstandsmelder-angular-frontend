/* global angular,define */

define([
    'lang_de',
    'lang_en',
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
], function (lang_de, lang_en) {
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

                $routeProvider.when('/', {templateUrl: '/locations/region_map.html', controller: 'Regions.MapIndex'});

                $routeProvider.when('/users/login', {templateUrl: '/users/login.html', controller: 'Users.Login'});
                $routeProvider.when('/users/logout', {templateUrl: '/users/logout.html', controller: 'Users.Logout'});
                $routeProvider.when('/users/create', {templateUrl: '/users/create.html', controller: 'Users.Create'});
                $routeProvider.when('/users/forgot', {templateUrl: '/users/forgot.html', controller: 'Users.Forgot'});
                $routeProvider.when('/users/me', {templateUrl: '/users/update.html', controller: 'Users.Edit'});
                $routeProvider.when('/users/me/locations', {templateUrl: '/locations/list.html', controller: 'Locations.User'});
                $routeProvider.when('/users/confirm/:token', {
                    templateUrl: '/users/confirm.html',
                    controller: 'Users.Confirm'
                });
                $routeProvider.when('/users/reset/:token', {
                    templateUrl: '/users/reset.html',
                    controller: 'Users.Confirm'
                });
                $routeProvider.when('/locations/create', {
                    templateUrl: '/locations/create.html',
                    controller: 'Locations.Create'
                });
                $routeProvider.when('/locations/update/:uuid', {
                    templateUrl: '/locations/update.html',
                    controller: 'Locations.Edit'
                });
                $routeProvider.when('/locations/:uuid', {
                    templateUrl: '/locations/show.html',
                    controller: 'Locations.Show'
                });
                $routeProvider.when('/admin/regions', {
                    templateUrl: '/regions/list.html',
                    controller: 'Regions.List'
                });
                $routeProvider.when('/posts/:uuid', {templateUrl: '/posts/show.html', controller: 'Posts.Show'});
                $routeProvider.when('/regions/:uuid', {templateUrl: '/regions/show.html', controller: 'Regions.Show'});
                $routeProvider.when('/site/:slug', {templateUrl: '/site/static_page.html', controller: 'Site.StaticPage'});
                $routeProvider.when('/admin/posts', {
                    templateUrl: '/posts/list.html',
                    controller: 'Posts.List'
                });
                $routeProvider.when('/admin/posts/:uuid', {
                    templateUrl: '/posts/edit.html',
                    controller: 'Posts.Edit'
                });

                $routeProvider.otherwise({redirectTo: '/'});

            }]);
});