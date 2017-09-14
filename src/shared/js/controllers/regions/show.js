'use strict';

var async = require('async');
var config = require('../../../../config.json');

var RegionsShow = function ($scope, regionService, $q, $routeParams, apiService, responseHandler, configuration) {
    if($routeParams.uuid == undefined) {
        //TODO: miesser hack um nur eine region anzuzeigen...
        $routeParams.uuid = config.global.default_region;
    }
    var deferred = $q.defer();
    $scope.promise = deferred.promise;
    $scope.urlbase = configuration.urlbase || '/';
    async.waterfall([
        function (cb) {
            apiService('regions').actions.find($routeParams.uuid, cb);
        },
        function (region, cb) {
            if (!region) {
                return cb(new Error('errors.region.no_data'));
            }
            region = region.results || region;
            $scope.region = region;
            $scope.mapcenter = [$scope.region.lonlat[1], $scope.region.lonlat[0]];
            $scope.zoom = $scope.region.zoom;
            $scope.urlbase = $scope.urlbase + region.slug + '/';
            regionService.setCurrentRegion(region.uuid, cb);
        },
        function (cb) {
            apiService('regions/' + $scope.region.uuid + '/locations').actions.all(cb);
        },
        function (locations, cb) {
            $scope.locations = locations.results || locations;
            cb();
        }
    ], function (err) {
        responseHandler.handleResponse(err, deferred);
    });

};

RegionsShow.$inject = ['$scope', 'regionService', '$q', '$routeParams', 'apiService', 'responseHandler', 'configuration'];

module.exports = RegionsShow;