'use strict';

var ApplicationController = function ($scope, $rootScope, $translate, $location, $timeout, $q, apiService, authService, regionService, $mdSidenav, $window, $filter) {

    //We’re not actually assigning the currentUser object, we’re merely initializing the property on the scope so the currentUser can later be accessed throughout the application.
    $scope.userSession = null;
    $scope.api_key = null;

    $scope.setUserSession = function (user) {
        $scope.userSession = user;
    };
    $scope.setApiKey = function (key) {
        $scope.api_key = key;
    };

    //general helper functions
    $scope.back = function() {
        $window.history.back();
    };

    $scope.$on('currentRegion:updated', function (event, region) {
        $scope.currentRegion = region;
        // TODO: check how to update floating label on autocomplete
        // $scope.searchTitleAdd = $translate.instant('author.in') + ' ' + region.title;
    });

    $scope.regionOverview = function() {
      $location.path('/' + $scope.currentRegion.slug || $scope.currentRegion.uuid );
    };

    $scope.dateFormatter = function(params) {
      return $filter('date')(params.value, 'yyyy-MM-dd');
    };

    $scope.translateFormatter = function(params) {
      if(params.value) {
          return $filter('translate')(params.value);
      } else {
          return '';
      }
    };

    $scope.booleanFormatter = function(params) {
        return (params.value ? $filter('translate')("generel.yes"):$filter('translate')("generel.no"));
    };

    $scope.gridOptions = {
        rowData: null,
        rowHeight: 58,
        enableSorting: true,
        enableFilter: true,
        animateRows: true,
        enableColResize: true,
        onGridReady: function() {
            setTimeout(function() {
                $scope.gridOptions.api.sizeColumnsToFit();
            }, 600);
        },
        onViewportChanged: function () {
          $scope.gridOptions.api.sizeColumnsToFit();
        }
    };

};

ApplicationController.$inject = ['$scope','$rootScope','$translate','$location','$timeout', '$q', 'apiService', 'authService', 'regionService', '$mdSidenav', '$window', '$filter'];

module.exports = ApplicationController;
