'use strict';

var async = require('async');

var LocationsCreateController = function ($scope, $routeParams, apiService, authService, $q, $location, mapService,
                                          responseHandler, locationFormDefaults, regionService, GeolocationService) {
    var changeTimer, lockUpdate;
    $scope.location = {};
    $scope.assets = {
        file: null
    };
    $scope.marker = {
        lat: null,
        lng: null
    };
    $scope.selectedIndex = 0;
    $scope._sys = locationFormDefaults;


    GeolocationService.getCurrentPosition().then(
        function(position) { //
            console.log('Position',position);
            $scope.marker.lat = position.coords.latitude;
            $scope.marker.lng = position.coords.longitude;
            $scope.updateLocation({ 'lat' : position.coords.latitude , 'lng': position.coords.longitude});
        },
        function(errorCode) {
            if(errorCode === false) {
                alert('GeoLocation is not supported by browser.');
            }
            else if(errorCode == 1) {
                alert('User either denied GeoLocation or waited for long to respond.');
            }
        }
    );


    /*
        Update the map to a new geolocation
        Also retrieves the new address
    */
    $scope.updateLocation = function (latlon) {
        $scope.marker = latlon;

        mapService.reverseGeoCode(latlon.lat,latlon.lng,function(err, result){
            if (err) {
                throw err;
            }
            lockUpdate = true;
            if (!result.error) {
                console.log('updateLocation',result.data);

                var address = mapService.createAddressFromGeo(result.data.address);
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

    /*
        Watches the address fields for updates
        Updates the map on address changes
     */
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
                }, function (err, result) {
                    console.log('found locations',result.data);
                    if (Array.isArray(result.data) && result.data.length > 0) {
                        $scope.marker.lat = result.data[0].lat;
                        $scope.marker.lng = result.data[0].lon;
                        $scope.location.display_name = result.data[0].display_name || "";
                        $scope.center = [result.data[0].lat,result.data[0].lon];

                    }
                });
            },1000);
        }
    });

    /*
        Submit the new location
     */
    $scope.submit = function () {
        var deferred = $q.defer(),
            payload = $scope.location;
        $scope.promise = deferred.promise;
        payload.lonlat = [$scope.marker.lng, $scope.marker.lat];
        var isUpdate = false;
        async.waterfall([
            function (cb) {
                /*
                    Fetch the nearest region
                 */
                // TODO: this must be limited through region admins!
                apiService('regions?lat=' + $scope.marker.lat + '&lon=' + $scope.marker.lng).actions.all(cb);
            },
            function (region, cb) {
                if (region && region.length > 0) {
                    if (!payload.hasOwnProperty('region_uuid')) {
                        payload.region_uuid = region[0].uuid;
                    }
                    /*
                        Are we updating or creating?
                     */
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
                /*
                    Upload the associated photos
                 */
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

    /*
        Load an existing location to update
     */
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
                $scope.photos =  photos.result || photos;
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
};

LocationsCreateController.$inject = ['$scope', '$routeParams', 'apiService', 'authService', '$q', '$location',
    'mapService', 'responseHandler', 'locationFormDefaults', 'regionService','GeolocationService'];

module.exports = LocationsCreateController;