'use strict';

var WidgetsNavbarController = function ($scope,$rootScope,$translate,$location,$timeout, $q, apiService, regionService, $mdSidenav, $mdMedia) {
    // var deferred = $q.defer();
    var self = this;
    self.currentSearchText = null;
    self.repos = [];
    self.simulateQuery = false;
    self.isDisabled    = false;

    $scope.$mdMedia = $mdMedia;

    // sidenav changes
    $scope.open_sidebar = function () {
        $mdSidenav('right').open();
    };
    $scope.toogle_sidebar = function () {
        console.log('toogle');
        if($mdSidenav('right').isOpen()) {
            $mdSidenav('right').close();
        } else {
            $mdSidenav('right').open();
        }
    };
    $scope.close_sidebar = function () {
        $mdSidenav('right').close();
    };

    $scope.siteLocation = $rootScope.siteLocation;

    $scope.lang_active = $translate.proposedLanguage() || $translate.use();
    $rootScope.lang_active=$scope.langKey;


    $scope.useLanguage = function (langKey) {
        $translate.use(langKey);
        $scope.lang_active=langKey;
        $rootScope.lang_active=langKey;
    };
    $scope.login = function() {
        $location.path('/login');
    };
    $scope.register = function() {
        $location.path('/register');
    };

    function querySearch (query) {
        self.loading = true;
        var deferred = $q.defer();
        apiService('search/locations' + ($scope.currentRegion ? '/' + $scope.currentRegion.uuid : ''),
            null, {q: query}).actions.all(function (err, results) {
            if (err) {
                deferred.reject(err);
            }
            self.loading = false;
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
        regions = regions.results || regions;
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
        $scope.regions = self.repos;

    }, function(){}, true);

    $scope.change = function() {
        $location.path(($scope.currentRegion.slug || $scope.currentRegion.uuid)); //
    };

    $scope.home = function() {
        $location.path('/'); 
    };
};

WidgetsNavbarController.$inject = ['$scope','$rootScope','$translate','$location','$timeout', '$q', 'apiService','regionService', '$mdSidenav', '$mdMedia'];

module.exports = WidgetsNavbarController;
