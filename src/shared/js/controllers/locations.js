/* global angular,define,async,PIECEMETA_API_HOST,console */

define([], function () {
    return angular.module(
        'lsm.controllers.locations',
        [
            'lsm.services.api'
        ])
        .controller('Locations.Show', ['$scope', 'regionService', '$q', '$routeParams', 'apiService', 'responseHandler',
            function ($scope, regionService, $q, $routeParams, apiService, responseHandler) {
            var deferred = $q.defer();
            $scope.promise = deferred.promise;
            $scope.formTitle = 'Edit location';
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
                    $scope.photos = photos.results;
                    apiService('locations/' + $scope.location.uuid + '/comments').actions.all(cb);
                },
                function (comments, cb) {
                    if (comments.length > 0) {
                        comments.sort(function (a, b) {
                            return new Date(a.created).getTime() - new Date(b.created).getTime();
                        });
                        $scope.location.comments = comments;
                    } else {
                        $scope.location.comments = [];
                    }
                    cb();
                }
            ], function (err) {
                if (responseHandler.handleResponse(err, deferred)) {
                    $scope.$apply();
                    $scope.htmlReady();
                }
            });
        }])
        .controller('Locations.List', ['$scope', 'apiService', '$q', 'responseHandler',
            function ($scope, apiService, $q, responseHandler) {
            var deferred = $q.defer();
            $scope.promise = deferred.promise;
            $scope.data = {};
            apiService('locations?page=0&pagesize=1000&radius=2000&latitude=53.5653&longitude=10.0014').actions.all(function (err, locations) {
                if (responseHandler.handleResponse(err, deferred)) {
                    $scope.data.locations = locations.results.sort(function (a, b) {
                        if (a.title < b.title) {
                            return -1;
                        } else if (a.title > b.title) {
                            return 1;
                        }
                        return 0;
                    });
                    $scope.$apply();
                    $scope.htmlReady();
                }
            });
        }])
        .controller('Locations.Create', ['$scope', '$rootScope','apiService', 'authService', '$q', '$location', 'featureService', 'Upload', function ($scope, $rootScope, apiService, authService, $q, $location, featureService, Upload) {
            var changeTimer, lockUpdate;
            $scope.siteLocation = "TEST";
            $rootScope.siteLocation=$scope.siteLocation;
            $scope.location = {
                title: null,
                description: null,
                degree: null,
                owner: null,
                rumor: false,
                emptySince: null,
                buildingType: null,
                contributor_uuid: null,
                display_name: null
            };
            $scope.address = {
                street: null,
                city: null,
                postcode: null
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
                    {title:"Now",
                        text:"Empty at least right now"},
                    {title:"Since at least 1 Month",
                        text:"Empty at least right now"},
                    {title:"Since at least 6 Months",
                        text:"Empty at least right now"},
                    {title:"Since at least 1 Year",
                        text:"Empty at least right now"},
                    {title:"Since at least 2 Years",
                        text:"Empty at least right now"}
                ],
                degree: [
                    "Complete",
                    "Partial"
                ],
                rumor: [
                    "Yes"
                ],
                buildingType: [
                    "Residential",
                    "Commercial",
                    "Industrial",
                    "Historical",
                    "Public Work"
                ],
                owner: [
                    "private",
                    "business",
                    "public",
                    "city"
                ]
            };

            $scope.updateLocation = function (latlon) {
                $scope.marker = latlon;

                featureService.reverseGeoCode(latlon.lat,latlon.lng,function(err, data){
                    if (err) {
                        throw err;
                    }
                    lockUpdate = true;
                    if (!data.error) {
                        $scope.address = featureService.createAddressFromGeo(data.address);
                        $scope.location.display_name = data.display_name || "";

                    }
                });
                $scope.showLatLng = false;

                $scope.$apply();
            };

            $scope.$watch('location.emptySince', function(newVal) {
                $scope.location.emptySinceParsed = featureService.rewriteDate(newVal);
            });

            $scope.$watchCollection('address', function (newVal, oldVal) {
                var changed = false,
                    keys = Object.keys(newVal);

                if (lockUpdate) {
                    lockUpdate = false;
                    return;
                }

                for (var i = 0; i < keys.length; i += 1) {
                    if (newVal[keys[i]] !== oldVal[keys[i]]) {
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
                        featureService.geoCode($scope.address, function (err, data) {
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

                var deferred = $q.defer();
                $scope.promiseString = 'Saving...';
                $scope.promise = deferred.promise;
                var payload = $scope.location;
                payload.lonlat = [$scope.marker.lng,$scope.marker.lat];
                payload.city = $scope.address.city;
                payload.street = $scope.address.street;
                payload.postcode = $scope.address.postcode;
                console.log('payload', payload);
                apiService('locations').actions.create(payload, function (err, location) {
                    console.log('location', location);
                    if (err) {
                        $scope.alerts = [
                            {
                                type: 'danger',
                                msg: 'Failed to save Location.'
                            }
                        ];
                        deferred.reject(err);
                        return;
                    }
                    if ($scope.files && $scope.files.length) {
                        async.mapSeries($scope.files, function (file, cb) {
                            apiService('photos').actions.upload({
                                file: file,
                                fields: {location_uuid: location.uuid}
                            }, cb);
                        }, function (err, data) {
                            console.log(err, data);
                            $scope.alerts = [
                                {
                                    type: 'success',
                                    msg: 'Successfully saved Location.'
                                }
                            ];
                            deferred.resolve();
                            //$location.path('/locations/' + location.uuid + '/edit');
                        });
                    }
                });
            };
        }])
        .controller('Locations.Edit', ['$scope', '$routeParams', '$q', '$location', 'apiService', function ($scope, $routeParams, $q, $location, apiService) {
            var deferred = $q.defer();
            $scope.promiseString = 'Loading Location...';
            $scope.promise = deferred.promise;
            $scope.formTitle = 'Edit location';

            $scope.submit = function () {
                var deferred = $q.defer();
                $scope.promiseString = 'Saving...';
                $scope.promise = deferred.promise;
                apiService('locations').actions.update($routeParams.uuid, $scope.location, function (err) {
                    if (err) {
                        console.log(err);
                        $scope.alerts = [
                            {
                                type: 'danger',
                                msg: 'Failed to update Location.'
                            }
                        ];
                        deferred.reject(err);
                        return;
                    }
                    deferred.resolve();
                    $scope.alerts = [
                        {
                            type: 'success',
                            msg: 'Successfully updated Location.'
                        }
                    ];
                });
            };

            apiService('locations').actions.find($routeParams.uuid, function (err, location) {
                if (err) {
                    $scope.alerts = [
                        {
                            type: 'danger',
                            msg: 'Failed to load Location.'
                        }
                    ];
                    deferred.reject(err);
                    return console.log('error getting location', err);
                }
                $scope.location = location;
                $scope.formTitle = 'Edit "' + location.title + '"';
                apiService('locations/' + location.uuid + '/photos').actions.all(function (err, photos) {
                    if (err) {
                        $scope.alerts = [
                            {
                                type: 'danger',
                                msg: 'Failed to load photos.'
                            }
                        ];
                        deferred.reject(err);
                        return console.log('error getting photos', err);
                    }
                    $scope.photos = photos;
                    deferred.resolve();
                    $scope.$apply();
                });
            });
        }]);
});