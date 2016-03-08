'use strict';

define([], function () {
    return angular.module('ito.angular.services.dataviewer.api', []).factory('featureService', ['$http', function ($http) {
        return {
            initMap: function (el, config, addMiniMap) {
                var map, geoConf = config.geoSearch.main;

                // Basic Leaflet marker icon that other marker types will inherit from
                L.Icon.extend(config.markers.baseMarker);
                L.Icon.Default.imagePath = config.icons.basePath;

                // Set up the Leaflet map
                map = L.map('map', config.mainMap.mapConfig);
                map.setView(config.mainMap.defaults.latlon, config.mainMap.defaults.zoom);

                // Load tiles from OpenStreetMap
                new L.tileLayer(config.mainMap.osmUrl, config.mainMap.tileLayer).addTo(map);

                // PREP CLUSTERS //
                PruneCluster.Cluster.ENABLE_MARKERS_LIST = true;

                // CONTROLS //
                L.control.scale().addTo(map).setPosition('bottomleft');

                geoConf.provider = new L.GeoSearch.Provider.OpenStreetMap(config.geoSearch.provider);
                new L.Control.GeoSearch(geoConf).addTo(map);

                map.zoomControl.setPosition('topleft');

                if (addMiniMap) {
                    var tileLayer = new L.TileLayer(config.miniMap.osmUrl, config.miniMap.tileLayer);
                    new L.Control.MiniMap(tileLayer, config.miniMap.mapConfig).addTo(map);
                }

                return map;
            },

            createMarker: function (data, config) {
                /*
                 if (image) {
                 scope.markers[image._id] = {
                 _id: image._id,
                 location: image.location,
                 lat: image.location[0],
                 lng: image.location[1],
                 //icon: scope.extraMarker,
                 draggable: false,
                 //group: 'hamburg',
                 url: '/api/image/' + image._id,
                 thumburl: '/api/thumb/' + image._id,
                 author: image.contributor_id,
                 message: false, //'<img src="/api/image/' + image._id +'" alt="'+image.author+'" width="250px" />',
                 contributor_id: image.contributor_id,
                 updated_at: addCreatedAtReadable(image.updated_at),
                 created_at: addCreatedAtReadable(image.created_at),
                 offset: offset,
                 visible: visibility,
                 category: image.category || "Uncategorized"
                 }

                 }
                 */
                var marker;

                if (config.isPruneCluster) {
                    marker = new PruneCluster.Marker(data.location[0], data.location[1], {
                        url: '/api/image/' + image._id,
                        author: data.contributor_id
                    });
                    // This can be a string, but numbers are nice too
                    // TODO: categories need to be loaded from api
                    marker.category = Math.floor(Math.random() * Math.random() * config.temporary.colors.length);
                } else {
                    var options = {
                        draggable: config.draggable
                    };
                    if (config.view_url) {
                        options.view_url = config.view_url;
                    }
                    var marker = L.marker(config.latlon, options);
                }
                return marker;
            },
            debounce: function (func, threshold, execAsap) {
                // via http://unscriptable.com/2009/03/20/debouncing-javascript-methods/
                window.timeout;

                return function debounced() {
                    var obj = this, args = arguments;

                    function delayed() {
                        if (!execAsap) {
                            func.apply(obj, args);
                        }
                        window.timeout = null;
                    }

                    if (window.timeout) {
                        clearTimeout(window.timeout);
                    }
                    else if (execAsap) {
                        func.apply(obj, args);
                    }

                    window.timeout = setTimeout(delayed, threshold || 100);
                };

            },
            rewriteDate: function (months, callback) {
                // this is a general purpose helper that should probably
                // be somewhere else
                // most definitely must fix the translation keys...
                months = parseFloat(months);
                if (months >= 1) {
                    if (months < 4) {
                        callback(null, "less than one quarter of 1 year");
                    } else if (months < 7) {
                        callback(null, "less than one half of 1 year");
                    } else if (months < 19) {
                        callback(null, "less than three quarters of 1 year");
                    } else if (months < 12) {
                        callback(null, "less than 1 year");
                    } else if (months == 121) {
                        callback(null, "more than 10 years");
                    } else {
                        var years = parseFloat(months) / 12;
                        var year = Math.floor(years);
                        var months = years - year;
                        var portion = null;
                        switch (true) {
                            case (months >= 0.00001 && months <= 0.3):
                                portion = "one quarter";
                                break;
                            case (months >= 0.3001 && months <= 0.6):
                                portion = "one half";
                                break;
                            case (months >= 0.60001 && months <= 0.8):
                                portion = "three quarters";
                                break;
                            case (months >= 0.80001 && months <= 0.9999999):
                                year++;
                                break;
                        }
                        if (years == 1 && months == 0) {
                            callback(null, year + " year");
                        }
                        else if (portion) {
                            callback(null, year + " and " + portion + " years");
                        } else {
                            callback(null, year + " years");
                        }
                    }
                } else {
                    callback(null, "less than 1 year");
                }
            },
            reverseGeoCode: function (lat, lon, callback) {
                // well structured
                // https://nominatim.openstreetmap.org/reverse?format=json&lat=53.60695729613987&lon=9.942927360534668&zoom=18&addressdetails=1
                // the service requests adding '&email=' to the requests if there are
                // going to be many of them
                $http({
                    method: 'GET', url: 'https://nominatim.openstreetmap.org/reverse?format=json&lat=' + lat
                    + '&lon=' + lon
                    + '&zoom=18&addressdetails=1'
                }).success(function (message) {
                    console.log("apiMessage", message);
                    callback(null, message);
                }).error(function (data, status) {
                    callback(new Error('Could not get address:'));
                });
            },
            geoCode: function (address, callback) {
                if (!address.country) address.country = "de";
                // well structured
                //https://nominatim.openstreetmap.org/search?q=135+pilkington+avenue,+birmingham&format=json
                // the service requests adding '&email=' to the requests if there are
                // going to be many of them
                $http({
                    method: 'GET',
                    url: 'https://nominatim.openstreetmap.org/search?format=json&q='
                    + address.street + '+'
                    + address.city + '+'
                    + address.country
                }).success(function (message) {
                    console.log("apiMessage", message);
                    callback(null, message);
                }).error(function (data, status) {
                    callback(new Error('Service error starring image:', data, status), null);
                });
            },
            geo: function () {
                //determine if the handset has client side geo location capabilities
                /*function successCallback(p){
                 //Global.GPSlatlong = {"latitude":p.latitude,"longitude":p.longitude};
                 $scope.GPSlat = p.coords.latitude;
                 $scope.GPSlong = p.coords.longitude;
                 $scope.GPSaccuracy = p.coords.accuracy;
                 $scope.city = "GPS Active";
                 $scope.location = p;
                 console.log($scope.location);
                 }
                 function errorCallback(){
                 $scope.GPSlat = "Location Unknown";
                 $scope.GPSlong = "Location Unknown";
                 }
                 if(geoPosition.init()){
                 geoPosition.getCurrentPosition(successCallback,errorCallback,{enableHighAccuracy:true});
                 } else {
                 window.setMessage('Please enable GPS.', 2000);
                 }*/
            },
            getUser: function (image_id, contributor_id, stars, callback) {
                $http({
                    method: 'POST',
                    url: '/api/stars/' + image_id + '/' + contributor_id + '/' + stars
                }).success(function (message) {
                    //console.log("apiMessage",message);
                    callback(null, message);
                }).error(function (data, status) {
                    callback(new Error('Service error starring image:', data, status), null);
                });
            }
        }
    }])
    .factory('mapApiService', ['$http', function ($http) {
        'use strict';
        return {
            starImage: function (image_id, contributor_id, stars, callback) {
                $http({
                    method: 'POST',
                    url: '/api/stars/' + image_id + '/' + contributor_id + '/' + stars
                }).success(function (message) {
                    callback(null, message);
                }).error(function (data, status) {
                    callback(new Error('Service error starring image:', data, status), null);
                });
            },
            getUserStars: function (contributor_id, callback) {
                $http({method: 'GET', url: '/api/userstars/' + contributor_id}).success(function (message) {
                    callback(null, message);
                }).error(function (data, status) {
                    callback(new Error('Service error getting stars:', data, status), null);
                });
            },

            getAllImages: function (callback) {
                $http({method: 'GET', url: '/api/images'}).success(function (images) {
                    callback(null, images);
                }).error(function (data, status) {
                    callback(new Error('error fetching images list with status: ' + status), null);
                });
            },
            get10Images: function (offset, callback) {
                $http({
                    method: 'GET',
                    url: '/api/images',
                    params: {limit: 10, offset: offset}
                }).success(function (images) {
                    callback(null, images);
                }).error(function (data, status) {
                    callback(new Error('error fetching images list with status: ' + status), null);
                });
            },
            getImageData: function (id, callback) {
                $http({
                    method: 'GET',
                    url: '/api/imagedata/' + id,
                    params: {limit: 1, offset: 0}
                }).success(function (image) {
                    callback(null, image);
                }).error(function (data, status) {
                    callback(new Error('error fetching images list with status: ' + status), null);
                });
            },
            getLatestImages: function (callback) {
                $http({method: 'GET', url: '/api/images', params: {limit: 7}}).success(function (images) {
                    callback(null, images);
                }).error(function (data, status) {
                    callback(new Error('error fetching images list with status: ' + status), null);
                });
            },
            imageUnload: function (image_id, username, callback) {
                $http({
                    method: 'POST',
                    url: '/api/imageunload/' + image_id + '/' + username
                }).success(function (matches) {
                    // should remove from $scope too...
                    callback(null, matches);
                }).error(function (data, status) {
                    callback(new Error('error unloading image: ' + status), null);
                });
            }
        };
    }]);
});
