/* global angular,define,async,Promise,PIECEMETA_API_HOST,console */

define([], function () {
    return angular.module(
        'lsm.controllers.locations',
        [
            'lsm.services.api'
        ])
        .controller('Locations.Show', ['$scope', 'regionService', '$q', '$routeParams', 'apiService', 'responseHandler', '$location',
            function ($scope, regionService, $q, $routeParams, apiService, responseHandler, $location) {
            var deferred = $q.defer();
            $scope.promise = deferred.promise;
            $scope.urlbase = '/locations/';
            async.waterfall([
                function (cb) {
                    apiService('locations').actions.find($routeParams.uuid, cb);
                },
                function (location, cb) {
                    $scope.locations = [location];
                    $scope.location = location;
                    $scope.mapcenter = [$scope.location.lonlat[1], $scope.location.lonlat[0]];
                    $scope.zoom = 17;
                    $scope.formTitle = 'Edit "' + $scope.location.title + '"';
                    regionService.setCurrentRegion(location.region_uuid, cb);
                },
                function (cb) {
                    apiService('locations/' + $scope.location.uuid + '/photos').actions.all(cb);
                },
                function (photos, cb) {
                    photos.results.sort(function (a, b) {
                        return a.position - b.position;
                    });
                    $scope.photos = photos.results;
                    cb();
                }
            ], function (err) {
                if (responseHandler.handleResponse(err, deferred)) {
                    if (
                        ($scope.userSession && $scope.location.user_uuid === $scope.userSession.uuid) ||
                        $scope.api_key && ($scope.api_key.scopes.indexOf($scope.location.region_slug) > -1 ||
                        $scope.api_key.scopes.indexOf('admin') > -1)
                    ) {
                        $scope.mayEdit = true;
                        $scope.edit = function () {
                            $location.path('/locations/' + $scope.location.uuid + '/edit');
                        };
                    }
                    $scope.$apply();
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
                    property: 'region.title'
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
                pagesize: 15,
                limit_options: [5, 10, 15],
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
                        $location.path('/locations/' + location.slug);
                    }
                }
            ];
        }])
        .controller('Locations.Create', ['$scope','apiService', 'authService', '$q', '$location', 'mapService', 'responseHandler',
            function ($scope, apiService, authService, $q, $location, mapService, responseHandler) {
            var changeTimer, lockUpdate;
            $scope.location = {
                title: null,
                description: null,
                degree: null,
                owner: null,
                rumor: false,
                emptySince: null,
                buildingType: null,
                contributor_uuid: null,
                display_name: null,
                street: null,
                city: null,
                postcode: null,
                country: null
            };
            $scope.assets = {
                file: null
            };
            $scope.marker = {
                lat: null,
                lng: null
            };
            $scope.formTitle = 'Create location';
            $scope.showLatLng = false;
            $scope._sys = {
                emptySince: [
                    'locations.empty_options.recently',
                    'locations.empty_options.about_half_year',
                    'locations.empty_options.min_one_year',
                    'locations.empty_options.min_three_years',
                    'locations.empty_options.min_five_years'
                ],
                degree: [
                    'locations.degree_options.complete',
                    'locations.degree_options.partial'
                ],
                rumor: [
                    'locations.demolition_rumor_yes'
                ],
                buildingType: [
                    'locations.building_type_options.residential',
                    'locations.building_type_options.commercial',
                    'locations.building_type_options.industrial',
                    'locations.building_type_options.historical',
                    'locations.building_type_options.public_work'
                ],
                owner: [
                    'locations.owner_options.private',
                    'locations.owner_options.business',
                    'locations.owner_options.public',
                    'locations.owner_options.city'
                ]
            };

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
                $scope.$apply();
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
                    // todo: have a look at the debounce service in services/map.js
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
                payload.lonlat = [$scope.marker.lng,$scope.marker.lat];
                async.waterfall([
                    function (cb) {
                        apiService('regions?lat=' + $scope.marker.lat + '&lon=' + $scope.marker.lng).actions.all(cb);
                    },
                    function (region, cb) {
                        if (region && region.length > 0) {
                            payload.region_uuid = region[0].uuid;
                            apiService('locations').actions.create(payload, cb);
                        } else {
                            cb(new Error('errors.regions.fetch_failed'),null);
                        }
                    },
                    function (location, cb) {
                        $scope.location.uuid = location.uuid;
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
                        success: 'messages.locations.create_success'
                    };
                    if (responseHandler.handleResponse(err, deferred, msgs)) {
                        $location.path('/locations/' + $scope.location.slug);
                    }
                });
            };
        }])
        .controller('Locations.Edit', ['$scope', '$routeParams', '$q', '$location', 'apiService', 'responseHandler',
            function ($scope, $routeParams, $q, $location, apiService, responseHandler) {
            var deferred = $q.defer();
            $scope.promise = deferred.promise;
            $scope.submit = function () {
                var deferred = $q.defer();
                $scope.promise = deferred.promise;
                apiService('locations').actions.update($routeParams.uuid, $scope.location, function (err) {
                    var msgs = {
                        success: 'messages.locations.update_success'
                    };
                    responseHandler.handleResponse(err, deferred, msgs);
                });
            };

            async.waterfall([
                function (cb) {
                    apiService('locations').actions.find($routeParams.uuid, cb);
                },
                function (location, cb) {
                    $scope.location = location;
                    $scope.formTitle = 'Edit "' + location.title + '"';
                    apiService('locations/' + location.uuid + '/photos').actions.all(cb);
                },
                function (photos, cb) {
                    $scope.photos = photos;
                    cb();
                }
            ], function (err) {
                if (responseHandler.handleResponse(err, deferred)) {
                    $scope.$apply();
                }
            });
        }]);
});