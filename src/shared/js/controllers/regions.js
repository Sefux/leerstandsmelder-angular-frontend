/* global angular,define,async,PIECEMETA_API_HOST,console */

define([], function () {
    return angular.module(
        'lsm.controllers.regions',
        [
            'lsm.services.api'
        ])
        .controller('Regions.List', ['$scope', '$q', 'apiService', 'regionService', 'responseHandler',
            function ($scope, $q, apiService, regionService, responseHandler) {
            var deferred = $q.defer();
            $scope.promise = deferred.promise;
            $scope.mapcenter = [51.0, 9.0];
            $scope.urlbase = '/regions/';
            async.waterfall([
                function (cb) {
                    regionService.setCurrentRegion(null, cb);
                },
                function (cb) {
                    apiService('regions').actions.all(cb);
                },
                function (regions, cb) {
                    async.map(regions, function (region, next) {
                        var popup = "<strong>" + region.title + "</strong>";
                        regions[regions.indexOf(region)].popup = popup;
                        next();
                    }, function () {
                        $scope.locations = regions;
                        apiService('posts?limit=6&sort=-created').actions.all(cb);
                    });
                },
                function (posts, cb) {
                    $scope.posts = posts;
                    cb();
                }
            ], function (err) {
                if (responseHandler.handleResponse(err, deferred)) {
                    $scope.$apply();
                    $scope.htmlReady();
                }
            });
        }])
        .controller('Regions.Show', ['$scope', 'regionService', '$q', '$routeParams', 'apiService', 'responseHandler',
            function ($scope, regionService, $q, $routeParams, apiService, responseHandler) {
            var deferred = $q.defer();
            $scope.promise = deferred.promise;
            $scope.urlbase = '/locations/';
            async.waterfall([
                function (cb) {
                    apiService('regions').actions.find($routeParams.uuid, cb);
                },
                function (region, cb) {
                    $scope.region = region;
                    $scope.mapcenter = [$scope.region.lonlat[1], $scope.region.lonlat[0]];
                    $scope.zoom = $scope.region.zoom;
                    regionService.setCurrentRegion(region.uuid, cb);
                },
                function (cb) {
                    apiService('regions/' + $scope.region.uuid + '/locations').actions.all(cb);
                },
                function (locations, cb) {
                    locations.results.sort(function (a, b) {
                        return new Date(a.updated).getTime() - new Date(b.updated).getTime();
                    });
                    $scope.locations = locations.results;
                    $scope.recentLocations = $scope.locations.slice(0, 10);
                    cb();
                }
            ], function (err) {
                if (responseHandler.handleResponse(err, deferred)) {
                    $scope.$apply();
                    $scope.htmlReady();
                }
            });

        }]);
});