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
        .controller('Regions.List', ['$scope', '$location',
            function ($scope, $location) {
                $scope.fields = [
                    {
                        label: 'regions.title',
                        property: 'title'
                    },
                    {
                        label: 'author.created',
                        property: 'created',
                        date: true
                    },
                    {
                        label: 'author.updated',
                        property: 'updated',
                        date: true
                    }
                ];
                $scope.settings = {
                    row_select: false,
                    multiple: false,
                    pagination: true,
                    pagesize: 25,
                    limit_options: [25, 50, 100],
                    resource: 'regions'
                };
                $scope.actions = [
                    {
                        label: 'actions.edit',
                        css_class: 'fa-pencil-square-o',
                        clickHandler: function (item) {
                            $location.path('/admin/regions/' + item.uuid);
                        }
                    },
                    /*
                     {
                     label: 'actions.delete',
                     css_class: 'fa-trash-o',
                     clickHandler: function (location) {
                     // TODO: delete function needs some work in the api to remove associated assets and entries
                     }
                     },
                     */
                    {
                        label: 'actions.show',
                        css_class: 'fa-eye',
                        clickHandler: function (item) {
                            $location.path('/' + item.slug);
                        }
                    }
                ];
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

            /*
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
            */
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

        }])
        .controller('Regions.Update', ['$scope', '$q', '$routeParams', 'apiService', 'responseHandler',
            function ($scope, $q, $routeParams, apiService, responseHandler) {
            var deferred = $q.defer();
            $scope.promise = deferred.promise;
            apiService('regions').actions.find($routeParams.uuid, function (err, region) {
                if (!region.hasOwnProperty('moderate')) {
                    region.moderate = false;
                }
                $scope.region = region;
                responseHandler.handleResponse(err, deferred);
            });
            $scope.submit = function () {
                deferred = $q.defer();
                $scope.promise = deferred.promise;
                apiService('regions').actions.update($routeParams.uuid, $scope.region, function (err) {
                    var msgs = {
                        success: 'regions.update_success'
                    };
                    responseHandler.handleResponse(err, deferred, msgs);
                });
            };
        }]);
});