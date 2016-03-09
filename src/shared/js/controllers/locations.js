/* global angular,define,async,PIECEMETA_API_HOST,console */

define([], function () {
    return angular.module(
        'leerstandsmelder.controllers.locations',
        [
            'ito.angular.services.api'
        ])
        .controller('Locations.Show', ['$scope', '$q', '$routeParams', 'apiService', function ($scope, $q, $routeParams, apiService) {
            var deferred = $q.defer();
            $scope.promiseString = 'Loading Location...';
            $scope.promise = deferred.promise;
            $scope.formTitle = 'Edit location';
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
                $scope.locations = [location];
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
                    console.log(photos);
                    $scope.photos = photos;
                    deferred.resolve();
                    $scope.$apply();
                });
            });
        }])
        .controller('Locations.List', ['$scope', 'apiService', function ($scope, apiService) {
            $scope.data = {};
            apiService('locations?page=0&pagesize=1000&radius=2000&latitude=53.5653&longitude=10.0014').actions.all(function (err, locations) {
                if (err) {
                    return console.log('error getting locations', err);
                }
                $scope.data.locations = locations.results.sort(function (a, b) {
                    if (a.title < b.title) {
                        return -1;
                    } else if (a.title > b.title) {
                        return 1;
                    }
                    return 0;
                });
                $scope.$apply();
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
                featureService.rewriteDate(newVal,function(err, data){
                    if (err) throw err;
                    if (!data.error) {
                        $scope.location.emptySinceParsed = data;
                    }
                });
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
                        for (var i = 0; i < $scope.files.length; i++) {
                            var file = $scope.files[i];
                            apiService('photos').actions.upload({ file: file, fields: {location_uuid: location.uuid} }, function (err, data) {
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
                    if (photos.length > 0) {
                        /*
                        $scope.photos = photos.sort(function (a, b) {
                            if (a.title < b.title) {
                                return -1;
                            } else if (a.title > b.title) {
                                return 1;
                            }
                            return 0;
                        });
                        */
                    }
                    deferred.resolve();
                    $scope.$apply();
                });
            });
        }]);
});