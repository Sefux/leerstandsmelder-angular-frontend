'use strict';

var async = require('async');

var LocationsRegionIndexControlller = function ($scope, apiService, $q, $location, $routeParams, responseHandler, $translate, $filter, configuration) {
  var deferred = $q.defer();
  $scope.promise = deferred.promise;
  $scope.urlbase = configuration.urlbase || '/';
  //find out if on seo page
  var seoState = 'all';
  if ($location.path().indexOf('index') > 0) {
    seoState = 'index';
  }
  var columnDefs;

  if ($routeParams.region_uuid) {
    columnDefs = [
      {headerName: $filter('translate')("locations.title"), field: "title", width: 120, sort: 'asc'},
      {headerName: $filter('translate')("locations.street"), field: "street", width: 90},
      {
        headerName: $filter('translate')("locations.building_type"),
        field: "buildingType",
        width: 90,
        cellRenderer: $scope.translateFormatter
      },
      {
        headerName: $filter('translate')("locations.owner"),
        field: "owner",
        width: 90,
        cellRenderer: $scope.translateFormatter
      },
      {headerName: $filter('translate')("author.updated"), field: "updated", width: 90, cellRenderer: $scope.dateFormatter},
      {
        headerName: "", field: "uuid", width: 60, suppressFilter: true, cellRenderer: function (params) {      // Function cell renderer
        return '<a class="md-icon-button md-table-button md-raised  md-fab  md-mini " href="' + $scope.urlbase + (params.data.region ? params.data.region.slug : params.data.region_uuid) + '/' + (params.data.slug || params.data.uuid) + '" aria-label="' + $filter('translate')("actions.edit") + '"><md-icon md-font-icon="fa-eye" class="fa fa-eye"></md-icon></a>';
      }
      },
    ];
  } else {
    columnDefs = [
      {headerName: $filter('translate')("regions.title"), field: "title", width: 120, sort: 'asc'},
      {headerName: $filter('translate')("regions.count"), field: "locations", width: 90},
      {
        headerName: "", field: "slug", width: 60, suppressFilter: true, cellRenderer: function (params) {      // Function cell renderer
        return '<a class="md-icon-button md-table-button md-raised  md-fab  md-mini " href="' + $scope.urlbase + 'locations/' + seoState + '/' + params.value + '" aria-label="' + $filter('translate')("actions.edit") + '"><md-icon md-font-icon="fa-eye" class="fa fa-eye"></md-icon></a>';
      }
      },
    ];

  }
  $scope.gridOptions = {
    columnDefs: columnDefs,
    rowData: null,
    rowHeight: 58,
    enableSorting: true,
    enableFilter: true,
    animateRows: true,
    enableColResize: true,
    onGridReady: function () {
      setTimeout(function () {
        $scope.gridOptions.api.sizeColumnsToFit();
      }, 600);
    }
  };

  $scope.filterGrid = function () {
    $scope.gridOptions.api.setQuickFilter($scope.filterStr);
  };

  $scope.clickShowHandler = function (row) {
    var uuid = row.rowId;
    var item = _.find($scope.data, function (item) {
      return item.uuid === uuid;
    });
    if (item.region_uuid) {
      $location.path('/' + (item.region ? item.region.slug : item.region_uuid) + '/' + (item.slug || item.uuid));
    } else {
      $location.path('/locations/' + seoState + '/' + item.slug || item.uuid);
    }
  };

  async.waterfall([
    function (cb) {
      if ($routeParams.region_uuid) {
        apiService('regions').actions.find($routeParams.region_uuid, cb);
      } else {
        apiService('regions?sort=title').actions.all(cb);
      }
    },
    function (regions, cb) {
      var regionData = regions.results || regions;
      if (Array.isArray(regionData)) {
        $scope.data = regionData.results || regionData;
        $scope.gridOptions.api.setRowData($scope.data);
        $scope.gridOptions.api.sizeColumnsToFit();
        cb();
      } else {
        $scope.region = regionData;
        apiService('regions/' + regionData.uuid + '/locations').actions.all(cb);
      }
    }
  ], function (err, locations) {
    if (locations) {
      $scope.listHeadline = $translate.instant('locations.locations_by_region') + ': ' +
        ($scope.region ? $scope.region.title : null);
      $scope.data = locations.results || locations;
      $scope.gridOptions.api.setRowData($scope.data);
      $scope.gridOptions.api.sizeColumnsToFit();
    } else {
      $scope.listHeadline = $translate.instant('locations.locations_by_region');
    }
    responseHandler.handleResponse(err, deferred);
  });
};

LocationsRegionIndexControlller.$inject = ['$scope', 'apiService', '$q', '$location', '$routeParams', 'responseHandler', '$translate', '$filter', 'configuration'];

module.exports = LocationsRegionIndexControlller;
