/* global angular,async,console */

(function () {
    'use strict';
    angular.module(
        'leerstandsmelder.controllers.widgets',[])
        .controller('Widgets.Navbar', ['$scope','$rootScope','$translate','$location','$timeout', '$q', '$log', function ($scope,$rootScope,$translate,$location,$timeout, $q, $log) {
            $scope.siteLocation = $rootScope.siteLocation;
            $scope.useLanguage = function (langKey) {
               $translate.use(langKey);

            };
            $scope.login = function() {
               $location.path('/login');
            };
            $scope.register = function() {
                $location.path('/register');
            };
            $scope.site = {
                title: "Leerstandsmelder",
                copyrightnotice: "© ITO-Suite",
                breadcrumb: "Berlin"
            };


            var self = this;
            self.simulateQuery = false;
            self.isDisabled    = false;
            self.repos         = loadAll();
            self.querySearch   = querySearch;
            self.selectedItemChange = selectedItemChange;
            self.searchTextChange   = searchTextChange;
            // ******************************
            // Internal methods
            // ******************************
            /**
             * Search for repos... use $timeout to simulate
             * remote dataservice call.
             */
            function querySearch (query) {
                var results = query ? self.repos.filter( createFilterFor(query) ) : self.repos,
                    deferred;
                if (self.simulateQuery) {
                    deferred = $q.defer();
                    $timeout(function () { deferred.resolve( results ); }, Math.random() * 1000, false);
                    return deferred.promise;
                } else {
                    return results;
                }
            }
            function searchTextChange(text) {
                $log.info('Text changed to ' + text);
            }
            function selectedItemChange(item) {
                $log.info('Item changed to ' + JSON.stringify(item));
            }
            /**
             * Build `components` list of key/value pairs
             */
            function loadAll() {
                var repos = [
                    {
                        'name'      : 'Hamburg',
                        'url'       : '/city/hamburg',
                        'locations'  : '634',
                        'views'     : '16175'
                    },
                    {
                        'name'      : 'Berlin',
                        'url'       : '/city/berlin',
                        'locations'  : '469',
                        'views'     : '72360'
                    },
                    {
                        'name'      : 'Bremen',
                        'url'       : '/city/bremen',
                        'locations'  : '727',
                        'views'     : '1241'
                    },
                    {
                        'name'      : 'Leipzig',
                        'url'       : '/city/leipzig',
                        'locations'  : '42',
                        'views'     : '8324'
                    }
                ];
                return repos.map( function (repo) {
                    repo.value = repo.name.toLowerCase();
                    return repo;
                });
            }
            /**
             * Create filter function for a query string
             */
            function createFilterFor(query) {
                var lowercaseQuery = angular.lowercase(query);
                return function filterFn(item) {
                    return (item.value.indexOf(lowercaseQuery) === 0);
                };
            }

        }])
        .controller('Widgets.Alerts', ['$scope', '$mdToast', 'PubSub', function ($scope,$mdToast, PubSub) {

            $scope.alerts = [];

            $scope.addAlert = function (status, message) {
                $mdToast.hide();
                $mdToast.show($mdToast.simple().textContent(message));

                //$scope.alerts.push({'status': status, 'message': message});
            };
            $scope.closeAlert = function (index) {
                $scope.alerts.splice(index, 1);
            };
            PubSub.subscribe('alert', $scope.addAlert);
        }]);
}());


