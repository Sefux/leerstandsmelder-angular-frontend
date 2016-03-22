/* global angular,define,async,PIECEMETA_API_HOST,console */

define([], function () {
    return angular.module(
        'leerstandsmelder.controllers.regions',
        [
            'ito.angular.services.api'
        ])
        .controller('Regions.List', ['$scope', '$q', 'apiService', 'regionService', function ($scope, $q, apiService, regionService) {
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
                if (err) {
                    $scope.alerts = [
                        {
                            type: 'danger',
                            msg: 'Failed to load Regions.'
                        }
                    ];
                    deferred.reject(err);
                    return console.log('error getting regions', err);
                }
                deferred.resolve();
                $scope.$apply();
                $scope.htmlReady();
            });
            apiService('regions').actions.all(function (err, regions) {
                if (err) {
                    $scope.alerts = [
                        {
                            type: 'danger',
                            msg: 'Failed to load Regions.'
                        }
                    ];
                    deferred.reject(err);
                    return console.log('error getting regions', err);
                }
                $scope.locations = regions;
                deferred.resolve();
                $scope.$apply();
            });
        }])
        .controller('Regions.Show', ['$scope', 'regionService', '$q', '$routeParams', 'apiService', function ($scope, regionService, $q, $routeParams, apiService) {
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
                    $scope.locations = locations.results.sort(function (a, b) {
                        return new Date(a.updated).getTime() - new Date(b.updated).getTime();
                    });
                    $scope.recentLocations = $scope.locations.splice(0, 10);
                    cb();
                }
            ], function (err) {
                if (err) {
                    $scope.alerts = [
                        {
                            type: 'danger',
                            msg: 'Failed to load page content.'
                        }
                    ];
                    deferred.reject(err);
                    return console.log('error getting page content', err);
                }
                deferred.resolve();
                $scope.$apply();
                $scope.htmlReady();
            });

        }]);
});