/* global angular,define,async,PIECEMETA_API_HOST,console */

define([
    'services_api',
    'services_helpers',
    'directives_helpers'
], function () {
    return angular.module(
        'lsm.controllers.widgets',[
            'angularPubsub',
            'btford.markdown',
            'lsm.services.api',
            'lsm.services.helpers',
            'lsm.directives.helpers'
        ])
        .controller('Widgets.Navbar', ['$scope','$rootScope','$translate','$location','$timeout', '$q', 'apiService','responseHandler','$mdSidenav',
            function ($scope,$rootScope,$translate,$location,$timeout, $q, apiService, responseHandler,$mdSidenav) {
            var deferred = $q.defer();
            var self = this;
            self.currentSearchText = null;
            self.repos = [];
            $scope.nickname = null;

            apiService('users').actions.find('me', function (err, user) {
                if (responseHandler.handleResponse(err, deferred)) {
                    $scope.nickname = user.nickname;
                    $timeout();
                }
            });
            // sidenav changes
                $scope.open_sidebar = function () {
                    $mdSidenav('right').open();
                }

                $scope.close_sidebar = function () {
                    $mdSidenav('right').close();
                };

            $scope.$on('currentRegion:updated', function (event, region) {
                $scope.currentRegion = region;
                // TODO: check how to update floating label on autocomplete
                // $scope.searchTitleAdd = $translate.instant('author.in') + ' ' + region.title;
            });

            $scope.siteLocation = $rootScope.siteLocation;

            $scope.lang_active = $translate.proposedLanguage() || $translate.use();


            $scope.useLanguage = function (langKey) {
               $translate.use(langKey);
               $scope.lang_active=langKey;
            };
            $scope.login = function() {
               $location.path('/login');
            };
            $scope.register = function() {
                $location.path('/register');
            };

            function querySearch (query) {
                this.loading = true;
                var deferred = $q.defer();
                apiService('search/locations' + ($scope.currentRegion ? '/' + $scope.currentRegion.uuid : ''),
                    null, {q: query}).actions.all(function (err, results) {
                    if (err) {
                        deferred.reject(err);
                    }
                    this.loading = false;
                    deferred.resolve(results);
                });
                return deferred.promise;
            }
            function searchTextChange(text) {
                self.currentSearchText = text;
            }
            function selectedItemChange(item) {
                if (item) {
                    $scope.ctrl.searchText = self.currentSearchText;
                    $location.path('/' + (item.region_slug || item.region_uuid) + '/' + (item.slug || item.uuid));
                }
            }

            self.querySearch = querySearch;
            self.selectedItemChange = selectedItemChange;
            self.searchTextChange = searchTextChange;

            apiService('regions').actions.all(function (err, regions) {
                if (!regions) {
                    if (err) {
                        throw err;
                    }
                    return;
                }
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
            };
            $scope.closeAlert = function (index) {
                $scope.alerts.splice(index, 1);
            };
            PubSub.subscribe('alert', $scope.addAlert);
        }]);
});