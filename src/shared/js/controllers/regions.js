/* global angular,define,async,PIECEMETA_API_HOST,console,Showdown */

define([
    'services_api',
    'services_helpers',
    'directives_helpers',
    'directives_map',
    'directives_widgets'
], function () {
    return angular.module(
        'lsm.controllers.regions',
        [
            'lsm.services.api',
            'lsm.services.helpers',
            'lsm.directives.helpers',
            'lsm.directives.map',
            'lsm.directives.widgets'
        ])
        .controller('Regions.List', ['$scope', '$q', 'apiService', 'responseHandler',
            function ($scope, $q, apiService, responseHandler) {
            var deferred = $q.defer();
            $scope.promise = deferred.promise;
            apiService('regions').actions.all(function (err, regions) {
                $scope.regions = regions.sort(function (a, b) {
                    return a.title > b.title;
                });
                responseHandler.handleResponse(err, deferred);
            });
        }])
        .controller('Regions.MapIndex', ['$scope', '$q', 'apiService', 'regionService', 'responseHandler', 'staticContent', '$translate', '$mdDialog',
            function ($scope, $q, apiService, regionService, responseHandler, staticContent, $translate, $mdDialog) {
            var deferred = $q.defer();
            $scope.promise = deferred.promise;
            $scope.mapcenter = [51.0, 9.0];
            $scope.urlbase = '/';
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
                        cb();
                    });
                },
            ], function (err) {
                responseHandler.handleResponse(err, deferred);
            });

            staticContent.getMarkdown('popup_relaunch', function (err, data) {
                if (!err) {
                    $scope.popupContent = data;
                    var converter = new Showdown.converter(),
                        html = converter.makeHtml(data);
                    $mdDialog.show($mdDialog.alert()
                        .clickOutsideToClose(true)
                        .title($translate.instant('popups.relaunch.title'))
                        .htmlContent(html)
                        .ariaLabel($translate.instant('popups.relaunch.title'))
                        .ok('OK'));
                }
            });
            $scope.cancel = function () {
                $mdDialog.cancel();
            };
        }])
        .controller('Regions.Show', ['$scope', 'regionService', '$q', '$routeParams', 'apiService', 'responseHandler',
            function ($scope, regionService, $q, $routeParams, apiService, responseHandler) {
            var deferred = $q.defer();
            $scope.promise = deferred.promise;
            $scope.urlbase = '/';
            async.waterfall([
                function (cb) {
                    apiService('regions').actions.find($routeParams.uuid, cb);
                },
                function (region, cb) {
                    $scope.region = region;
                    $scope.mapcenter = [$scope.region.lonlat[1], $scope.region.lonlat[0]];
                    $scope.zoom = $scope.region.zoom;
                    $scope.urlbase = '/' + region.slug + '/';
                    regionService.setCurrentRegion(region.uuid, cb);
                },
                function (cb) {
                    apiService('regions/' + $scope.region.uuid + '/locations').actions.all(cb);
                },
                function (locations, cb) {
                    $scope.locations = locations.results;
                    cb();
                }
            ], function (err) {
                responseHandler.handleResponse(err, deferred);
            });

        }]);
});