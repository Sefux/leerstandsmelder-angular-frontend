'use strict';

var async = require('async');

var RegionsShow = function ($scope, regionService, $q, $routeParams, apiService, responseHandler, configuration) {
    var deferred = $q.defer();
    $scope.promise = deferred.promise;
    $scope.urlbase = configuration.urlbase || '/';
    async.waterfall([
        function (cb) {
            apiService('regions').actions.find($routeParams.uuid, cb);
        },
        function (region, cb) {
            region = region.results || region;
            if (!region || region.code) {
              responseHandler.handleResponse(region, deferred);
              //return cb(new Error('errors.region.no_data'));
              return cb(new Error('errors.region.no_data'));
            }
            $scope.region = region;
            $scope.mapcenter = [$scope.region.lonlat[1], $scope.region.lonlat[0]];
            $scope.zoom = $scope.region.zoom;
            $scope.urlbase = $scope.urlbase + region.slug + '/';
            regionService.setCurrentRegion(region.uuid, cb);
        },
        function (cb) {
            apiService('regions/' + $scope.region.uuid + '/locations').actions.all(cb, function() {}, true);
          //regionService.setCurrentLocations($scope.region.uuid, cb);
        },
        function (locations, cb) {
            $scope.locations = locations.results || locations;
            cb();
        }
        /*
        ,
        function (cb) {

          var locations = regionService.getCurrentLocations($scope.region.uuid);
          console.log('locations',locations);

            $scope.locations = locations;
            cb();
        }
        */
    ], function (err) {
        responseHandler.handleResponse(err, deferred);
    });

};

RegionsShow.$inject = ['$scope', 'regionService', '$q', '$routeParams', 'apiService', 'responseHandler', 'configuration'];

module.exports = RegionsShow;
