/* global angular,define,async,PIECEMETA_API_HOST,console */

define([], function () {
    return angular.module(
        'leerstandsmelder.controllers.widgets',[])
        .controller('Widgets.Navbar', ['$scope','$rootScope','$translate','$location','$timeout', '$q', '$log', 'apiService', function ($scope,$rootScope,$translate,$location,$timeout, $q, $log, apiService) {
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
            self.repos         = [];
            self.querySearch   = querySearch;
            self.selectedItemChange = selectedItemChange;
            self.searchTextChange   = searchTextChange;
            // ******************************
            // Internal methods
            // ******************************
            function querySearch (query) {
                var deferred = $q.defer();
                apiService('search/locations', null, {q: query}).actions.all(function (err, results) {
                    if (err) {
                        deferred.reject(err);
                    }
                    deferred.resolve(results);
                });
                return deferred.promise;
            }
            function searchTextChange(text) {
                $log.info('Text changed to ' + text);
            }
            function selectedItemChange(item) {
                $log.info('Item changed to ' + JSON.stringify(item));
                $location.path('/locations/' + item.slug);
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

            apiService('regions').actions.all(function (err, regions) {
                self.repos = regions.sort(function (a, b) {
                    if (a.title < b.title) {
                        return -1;
                    } else if (a.title > b.title) {
                        return 1;
                    }
                    return 0;
                });
                self.repos.map(function (repo) {
                    repo.value = repo.slug;
                    return repo;
                });
            });

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
});