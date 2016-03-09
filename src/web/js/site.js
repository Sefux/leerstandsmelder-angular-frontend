/* global angular,define */

define([
    'config',
    'controllers_snippets',
    'controllers_site',
    'controllers_users',
    'controllers_locations',
    'controllers_dataviewer_maps',
    'directives_helpers',
    'services_api',
    'services_auth',
    'directives_dataviewer_maps',
    'services_dataviewer_maps'
], function () {
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
        'ito.angular.services.dataviewer.api',
        'ito.angular.directives.dataviewer.maps',
        'ito.angular.controllers.dataviewer.maps',
        'leerstandsmelder.controllers.locations'
    ])
        .config(['$routeProvider', '$locationProvider', '$animateProvider', '$translateProvider', '$mdThemingProvider', function($routeProvider, $locationProvider, $animateProvider, $translateProvider, $mdThemingProvider) {

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
                .preferredLanguage('en')
                .usePostCompiling(true)
                //.useStaticFilesLoader({
                //    prefix: 'lang-',
                //    suffix: '.json'
                //})
                .translations('en', {
                    location: {
                        title: 'Title',
                        description: 'Description'
                    },
                    asset: {
                        title: 'Title',
                        description: 'Description'
                    },
                    address: {
                        city: 'City',
                        street: 'Street',
                        postcode: 'Postal Code'
                    },
                    actions: {
                        cancel: 'Cancel',
                        delete: 'Delete'
                    },
                    user: {
                        name: 'Username',
                        pass: 'Password'
                    },
                    BUTTON_LANG_EN: 'English',
                    BUTTON_LANG_DE: 'German',
                    GEODETAILS: 'Geodetails',
                    TITLE: 'Title',
                    EDIT_LOCATION: 'Edit Location',
                    USE_DISPLAY_NAME_AS_TITLE: 'Use display name as title',
                    NEXT: 'next',
                    PREVIOUS: 'previous',
                    creator: {
                        tabs: {
                            info: 'info',
                            location:'location',
                            details:'details',
                            preview:'preview'
                        }
                    }
                })
                .translations('de', {
                    address: {
                        city: 'Stadt',
                        street: 'Strasse',
                        postcode: 'Postleitzahl'
                    },
                    asset : {
                        title: 'Titel',
                        description: 'Beschreibung'
                    },
                    location : {
                        title: 'Titel',
                        description: 'Beschreibung'
                    },

                    cancel: 'Abbrechen',
                    delete: 'Löschen',
                    banned: 'Verboten',
                    BUTTON_LANG_EN: 'englisch',
                    BUTTON_LANG_DE: 'deutsch',
                    NEXT: 'nächste',
                    PREVIOUS: 'vorige',
                    creator: {
                        tabs: {
                            info: 'info',
                            location:'ort',
                            details:'details',
                            preview:'vorschau'
                        }
                    }
            });

            $animateProvider.classNameFilter(/animate-/);

            $locationProvider.html5Mode({
                enabled: true
            });


            // these are from simulacrum
            /*
             $routeProvider.when('/display', {templateUrl: '/pages/mainpage', controller: 'MainPage'});
             $routeProvider.when('/display/:team_id', {templateUrl: '/pages/mainpageteam', controller: 'MainpageTeam'});

             $routeProvider.when('/team', {templateUrl: '/pages/team', controller: 'Team'});
             $routeProvider.when('/team/:team_id', {templateUrl: '/pages/teamview', controller: 'TeamView'});
             $routeProvider.when('/about', {templateUrl: '/pages/about', controller: 'About'});
             $routeProvider.when('/eviladmin', {templateUrl: '/pages/evil', controller: 'Evil'});
             $routeProvider.when('/mapview', {templateUrl: '/pages/mapview', controller: 'Mapview'});
             $routeProvider.when('/mapview/:_id', {templateUrl: '/pages/mapview', controller: 'Mapview'});
             $routeProvider.otherwise({redirectTo: '/'});
             */
            //$routeProvider.otherwise({redirectTo: '/'});

            $routeProvider.when('/', {templateUrl: '/welcome.html', controller: 'Site.Welcome'});

            $routeProvider.when('/login', {templateUrl: '/auth/jade/login.html', controller: 'Users.Login'});
            $routeProvider.when('/logout', {templateUrl: '/auth/jade/login.html', controller: 'Users.Logout'});
            $routeProvider.when('/signup', {templateUrl: '/auth/jade/signup.html', controller: 'Users.Create'});
            $routeProvider.when('/forgot', {templateUrl: '/auth/jade/forgot.html', controller: 'Users.Forgot'});
            $routeProvider.when('/profile', {templateUrl: '/auth/jade/profile.html', controller: 'Users.Edit'});
            $routeProvider.when('/location/new', {templateUrl: '/locations_create.html', controller: 'Locations.Create'});
            $routeProvider.when('/location/edit/:uuid', {templateUrl: '/locations_edit.html', controller: 'Locations.Edit'});
            $routeProvider.when('/location/:uuid', {templateUrl: '/locations_view.html', controller: 'Locations.Show'});


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