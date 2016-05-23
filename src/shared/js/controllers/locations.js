/* global angular,define,async,Promise,PIECEMETA_API_HOST,console */

define([
    'services_api',
    'services_helpers',
    'directives_helpers',
    'directives_map',
    'directives_widgets'
], function () {
    return angular.module(
        'lsm.controllers.locations',
        [
            'lsm.services.api',
            'lsm.services.helpers',
            'lsm.directives.helpers',
            'lsm.directives.map',
            'lsm.directives.widgets'
        ])
        .controller('Locations.Show', ['$scope', 'regionService', '$q', '$routeParams', 'apiService', 'responseHandler', '$location',
            function ($scope, regionService, $q, $routeParams, apiService, responseHandler, $location) {
            var deferred = $q.defer();
            $scope.promise = deferred.promise;
            $scope.urlbase = '/';
            async.waterfall([
                function (cb) {
                    apiService('locations').actions.find($routeParams.uuid, cb);
                },
                function (location, cb) {
                    if (!location) {
                        return cb(new Error('errors.location.no_data'));
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
                    apiService('locations/' + $scope.location.uuid + '/photos').actions.all(cb);
                },
                function (photos, cb) {
                    var res = photos.results || photos;
                    if (Array.isArray(res)) {
                        res.sort(function (a, b) {
                            return a.position - b.position;
                        });
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
        }])
        .controller('Locations.User', ['$scope', '$location', function ($scope, $location) {
            $scope.fields = [
                {
                    label: 'locations.title',
                    property: 'title'
                },
                {
                    label: 'locations.street',
                    property: 'street'
                },
                {
                    label: 'regions.region',
                    property: 'region.title',
                    sort: false
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
                resource: 'users/me/locations'
            };
            $scope.page = {
                list_title: 'locations.my_locations',
                list_title_empty: 'locations.my_locations_empty'
            };
            $scope.actions =[
                {
                    label: 'actions.edit',
                    css_class: 'fa-pencil-square-o',
                    clickHandler: function (location) {
                        $location.path('/locations/update/' + location.uuid);
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
                    clickHandler: function (location) {
                        $location.path('/' + (location.region ? location.region.title : location.region_uuid) + '/' + location.uuid);
                    }
                }
            ];
        }])
        .controller('Locations.RegionList', ['$scope', '$q', '$location', '$mdDialog', '$translate', 'responseHandler', 'apiService', 'regionService', '$routeParams',
            function ($scope, $q, $location, $mdDialog, $translate, responseHandler, apiService, regionService, $routeParams) {
            var fields = [
                {
                    label: 'locations.title',
                    property: 'title'
                },
                {
                    label: 'locations.street',
                    property: 'street'
                },
                {
                    label: 'author.created',
                    property: 'created',
                    sort: true,
                    date: true
                },
                {
                    label: 'author.updated',
                    property: 'updated',
                    date: true
                }
            ];
            if ($routeParams.region_uuid) {
                fields.push({
                    label: 'locations.hidden',
                    property: 'hidden'
                });
                $scope.listHeadline = 'locations.locations_by_region';
            } else {
                $scope.listHeadline = 'locations.my_locations';
            }
            regionService.setCurrentRegion($routeParams.region_uuid, function () {
                $scope.currentRegion = regionService.currentRegion.title;
            });
            $scope.fields = fields;
            $scope.settings = {
                row_select: false,
                multiple: false,
                pagination: true,
                sort: '-created',
                pagesize: 25,
                limit_options: [25, 50, 100],
                resource: $routeParams.region_uuid ? 'regions/' + $routeParams.region_uuid + '/locations' : 'users/me/locations'
            };
            $scope.actions = [
                {
                    label: 'actions.edit',
                    css_class: 'fa-pencil-square-o',
                    clickHandler: function (location) {
                        $location.path('/locations/update/' + location.uuid);
                    }
                },
                {
                    label: 'actions.delete',
                    css_class: 'fa-trash-o',
                    clickHandler: function (location) {
                        var confirm = $mdDialog.confirm()
                            .title($translate.instant('locations.remove_confirm_title'))
                            .textContent($translate.instant('locations.remove_confirm_body'))
                            .ariaLabel('locations.remove_confirm_title')
                            .ok($translate.instant('actions.ok'))
                            .cancel($translate.instant('actions.cancel'));
                        $mdDialog.show(confirm).then(function () {
                            var deferred = $q.defer();
                            $scope.promise = deferred.promise;
                            apiService('locations').actions.remove(location.uuid, function (err) {
                                var msgs = {
                                    success: 'locations.remove_success'
                                };
                                if (responseHandler.handleResponse(err, deferred, msgs)) {
                                    window.document.location.reload();
                                }
                            });
                        });
                    }
                },
                {
                    label: 'actions.show',
                    css_class: 'fa-eye',
                    clickHandler: function (location) {
                        $location.path('/' + (location.region ? location.region.title : location.region_uuid) + '/' + location.uuid);
                    }
                }
            ];
        }])
        .controller('Locations.RegionIndex', ['$scope', 'apiService', '$q', '$routeParams', 'responseHandler', '$translate',
            function ($scope, apiService, $q, $routeParams, responseHandler, $translate) {
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
                    $scope.listHeadline = $translate.instant('locations.locations_by_region') + ': ' + ($scope.region ? $scope.region.title : null);
                    $scope.data = locations.results || locations;
                } else {
                    $scope.listHeadline = $translate.instant('locations.locations_by_region');
                }
                responseHandler.handleResponse(err, deferred);
            });
        }])
        // TODO: reduce the number of injections per controller! the function signature looks obscene... and this is not the only one.
        .controller(
            'Locations.Create',
            [
                '$scope',
                '$routeParams',
                'apiService',
                'authService',
                '$q',
                '$location',
                'mapService',
                'responseHandler',
                'locationFormDefaults',
                'regionService',
                function ($scope, $routeParams, apiService, authService, $q, $location, mapService, responseHandler, locationFormDefaults, regionService) {
                var changeTimer, lockUpdate;
                $scope.location = {};
                $scope.assets = {
                    file: null
                };
                $scope.marker = {
                    lat: null,
                    lng: null
                };
                $scope._sys = locationFormDefaults;

                $scope.updateLocation = function (latlon) {
                    $scope.marker = latlon;

                    mapService.reverseGeoCode(latlon.lat,latlon.lng,function(err, data){
                        if (err) {
                            throw err;
                        }
                        lockUpdate = true;
                        if (!data.error) {
                            var address = mapService.createAddressFromGeo(data.address);
                            if (address) {
                                $scope.location.street = address.street;
                                $scope.location.city = address.city;
                                $scope.location.postcode = address.postcode;
                                $scope.location.country = address.country;
                            }
                        }
                    });
                    $scope.showLatLng = false;
                };

                $scope.$watchGroup(['location.street', 'location.city', 'location.postcode'], function (newValues, oldValues) {
                    var changed = false,
                        keys = Object.keys(newValues);

                    if (lockUpdate) {
                        lockUpdate = false;
                        return;
                    }

                    for (var i = 0; i < keys.length; i += 1) {
                        if (newValues[keys[i]] !== oldValues[keys[i]]) {
                            changed = true;
                        }
                    }

                    if (changed) {
                        if (changeTimer) {
                            window.clearTimeout(changeTimer);
                            changeTimer = null;
                        }
                        changeTimer = window.setTimeout(function () {
                            mapService.geoCode({
                                street: $scope.location.street,
                                city: $scope.location.city,
                                postcode: $scope.location.postcode,
                                country: $scope.location.country
                            }, function (err, data) {
                                if (data.length > 0) {
                                    $scope.marker.lat = data[0].lat;
                                    $scope.marker.lng = data[0].lon;
                                    $scope.location.display_name = data[0].display_name || "";
                                }
                            });
                        },1000);
                    }
                });

                $scope.submit = function () {
                    var deferred = $q.defer(),
                        payload = $scope.location;
                    $scope.promise = deferred.promise;
                    payload.lonlat = [$scope.marker.lng, $scope.marker.lat];
                    var isUpdate = false;
                    async.waterfall([
                        function (cb) {
                            apiService('regions?lat=' + $scope.marker.lat + '&lon=' + $scope.marker.lng).actions.all(cb);
                        },
                        function (region, cb) {
                            if (region && region.length > 0) {
                                if (!payload.hasOwnProperty('region_uuid')) {
                                    payload.region_uuid = region[0].uuid;
                                }
                                if (payload.uuid) {
                                    isUpdate = true;
                                    apiService('locations').actions.update(payload.uuid, payload, cb);
                                } else {
                                    apiService('locations').actions.create(payload, cb);
                                }
                            } else {
                                cb(new Error('errors.regions.fetch_failed'),null);
                            }
                        },
                        function (location, cb) {
                            if (!isUpdate) {
                                $scope.location.uuid = location.uuid;
                            }
                            $scope.location.slug = location.slug;
                            if ($scope.files && $scope.files.length) {
                                async.mapSeries($scope.files, function (file, cb) {
                                    apiService('photos').actions.upload({
                                        file: file,
                                        fields: {location_uuid: location.uuid}
                                    }, cb);
                                }, cb);
                            } else {
                                cb();
                            }
                        }
                    ], function (err) {
                        var msgs = {
                            success: $routeParams.uuid ? 'messages.locations.update_success' : 'messages.locations.create_success'
                        };
                        if (responseHandler.handleResponse(err, deferred, msgs)) {
                            $location.path('/' + ($scope.location.region_slug || $scope.location.region_uuid) + '/' +
                            $scope.location.slug);
                        }
                    });
                };

                if ($routeParams.uuid) {
                    var deferred = $q.defer();
                    $scope.promise = deferred.promise;
                    async.waterfall([
                        function (cb) {
                            apiService('locations').actions.find($routeParams.uuid, cb);
                        },
                        function (location, cb) {
                            if (!location.hasOwnProperty('hidden')) {
                                location.hidden = false;
                            }
                            $scope.location = location;
                            $scope.marker = {
                                lng: location.lonlat[0],
                                lat: location.lonlat[1]
                            };
                            $scope.formTitle = 'Edit "' + location.title + '"';
                            apiService('locations/' + location.uuid + '/photos').actions.all(cb);
                        },
                        function (photos, cb) {
                            $scope.photos = photos.results;
                            cb();
                        },
                        function (cb) {
                            regionService.setCurrentRegion($scope.location.region_uuid, cb);
                        },
                        function (cb) {
                            $scope.currentRegion = regionService.currentRegion.title;
                            $scope.isAdmin = authService.hasScopes(['admin', 'region-' + $scope.location.region_uuid]);
                            cb();
                        }
                    ], function (err) {
                        responseHandler.handleResponse(err, deferred);
                    });
                }
        }]);
});