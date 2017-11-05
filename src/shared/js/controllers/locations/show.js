'use strict';

var async = require('async');

var LocationsShowController = function($scope, regionService, $q, $routeParams,
                                       apiService, responseHandler, $location) {
    var deferred = $q.defer();
    $scope.promise = deferred.promise;
    $scope.urlbase = '/';
    async.waterfall([
        function (cb) {
            apiService('locations').actions.find($routeParams.uuid, cb, function() {}, true);
        },
        function (location, cb) {
            if (!location || location.code) {
              responseHandler.handleResponse(location, deferred);
              //return cb(new Error('errors.location.no_data'));
            }
            $scope.locations = [location];
            $scope.location = location;
            if ($scope.location && Array.isArray($scope.location.lonlat)) {
                $scope.mapcenter = [$scope.location.lonlat[1], $scope.location.lonlat[0]];
            }
            $scope.zoom = 17;
            $scope.formTitle = 'Edit "' + $scope.location.title + '"';
            $scope.urlbase = '/' + (location.region ? location.region.slug : location.region_uuid);
            regionService.setCurrentRegion(location.region_uuid, cb);
        },
        function (cb) {
            apiService('locations/' + $scope.location.uuid + '/photos').actions.all(cb, function(){}, true);
        },
        function (photos, cb) {
            var res = photos.results || photos;
            if (Array.isArray(res)) {
                res.sort(function (a, b) {
                    return a.position - b.position;
                });
                for (var i = 0; i < res.length; i++) {
                  res[i].id = res[i].uuid;
                  res[i].url = res[i].original_url;
                  res[i].thumbUrl = res[i].thumb_large_url;
                }
                $scope.photos = res;
            }
            cb();
        }
    ], function (err) {
        if (responseHandler.handleResponse(err, deferred)) {
            if (
                ($scope.userSession && $scope.location.user_uuid === $scope.userSession.uuid) ||
                $scope.api_key && ($scope.api_key.scopes.indexOf('region-' + $scope.location.region_uuid) > -1 ||
                $scope.api_key.scopes.indexOf('admin') > -1)
            ) {
                $scope.mayEdit = true;
                $scope.edit = function () {
                    $location.path('/locations/update/' + $scope.location.uuid);
                };
            }
        }
    });
};

LocationsShowController.$inject = ['$scope', 'regionService', '$q', '$routeParams',
    'apiService', 'responseHandler', '$location'];

module.exports = LocationsShowController;
