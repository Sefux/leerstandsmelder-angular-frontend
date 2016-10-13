'use strict';

var async = require('async');

var LocationsRegionIndexControlller = function ($scope, apiService, $q, $routeParams, responseHandler, $translate) {
    var deferred = $q.defer();
    $scope.promise = deferred.promise;
    async.waterfall([
        function (cb) {
            if ($routeParams.region_uuid) {
                apiService('regions').actions.find($routeParams.region_uuid, cb);
            } else {
                apiService('regions?sort=title').actions.all(cb);
            }
        },
        function (region_data, cb) {
            if (Array.isArray(region_data)) {
                $scope.data = region_data.results || region_data;
                cb();
            } else {
                $scope.region = region_data;
                apiService('regions/' + region_data.uuid + '/locations').actions.all(cb);
            }
        }
    ], function (err, locations) {
        if (locations) {
            $scope.listHeadline = $translate.instant('locations.locations_by_region') + ': ' +
                ($scope.region ? $scope.region.title : null);
            $scope.data = locations.results || locations;
        } else {
            $scope.listHeadline = $translate.instant('locations.locations_by_region');
        }
        responseHandler.handleResponse(err, deferred);
    });
};

LocationsRegionIndexControlller.$inject = ['$scope', 'apiService', '$q', '$routeParams', 'responseHandler', '$translate'];

module.exports = LocationsRegionIndexControlller;