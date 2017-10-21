'use strict';

var async = require('async');

var RegionsMapIndex = function ($scope, $q, apiService, regionService, responseHandler, configuration) {
    var deferred = $q.defer();
    $scope.promise = deferred.promise;
    $scope.mapcenter = [51.0, 9.0];
    $scope.urlbase = configuration.urlbase || '/';
    async.waterfall([
        function (cb) {
            regionService.setCurrentRegion(null, cb);
        },
        function (cb) {
            apiService('regions').actions.all(cb, function(){}, true);
        },
        function (regions, cb) {
            regions = regions.results || regions;
            async.map(regions, function (region, next) {
                regions[regions.indexOf(region)].popup = "<strong>" + region.title + "</strong>";
                next();
            }, function () {
                $scope.locations = regions;
                cb();
            });
        }
    ], function (err) {
        responseHandler.handleResponse(err, deferred);
    });
};

RegionsMapIndex.$inject = ['$scope', '$q', 'apiService', 'regionService', 'responseHandler','configuration'];

module.exports = RegionsMapIndex;