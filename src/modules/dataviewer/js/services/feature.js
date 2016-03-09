/* global PruneCluster,L,angular,define,async,PIECEMETA_API_HOST,console */

define([], function () {
    return angular.module('ito.angular.services.dataviewer.feature', [])
        .factory('featureService', ['$http', function ($http) {
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
                        marker = L.marker(config.latlon, options);
                    }
                    return marker;
                },
                debounce: function (func, threshold, execAsap) {
                    // via http://unscriptable.com/2009/03/20/debouncing-javascript-methods/
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
                rewriteDate: function (months) {
                    // this is a general purpose helper that should probably
                    // be somewhere else
                    // most definitely must fix the translation keys...
                    var result = "";
                    months = parseFloat(months);
                    if (months >= 1) {
                        if (months < 4) {
                            result = "less than one quarter of 1 year";
                        } else if (months < 7) {
                            result = "less than one half of 1 year";
                        } else if (months < 19) {
                            result = "less than three quarters of 1 year";
                        } else if (months < 12) {
                            result = "less than 1 year";
                        } else if (months === 121) {
                            result = "more than 10 years";
                        } else {
                            var years = parseFloat(months) / 12,
                                year = Math.floor(years),
                                _months = years - year,
                                portion = null;
                            switch (true) {
                                case (_months >= 0.00001 && _months <= 0.3):
                                    portion = "one quarter";
                                    break;
                                case (_months >= 0.3001 && _months <= 0.6):
                                    portion = "one half";
                                    break;
                                case (_months >= 0.60001 && _months <= 0.8):
                                    portion = "three quarters";
                                    break;
                                case (_months >= 0.80001 && _months <= 0.9999999):
                                    year++;
                                    break;
                            }
                            if (years === 1 && months === 0) {
                                result = year + " year";
                            } else if (portion) {
                                result = year + " and " + portion + " years";
                            } else {
                                result = year + " years";
                            }
                        }
                    } else {
                        result = "less than 1 year";
                    }
                    return result;
                },
                reverseGeoCode: function (lat, lon, callback) {
                    // well structured
                    // https://nominatim.openstreetmap.org/reverse?format=json&lat=53.60695729613987&lon=9.942927360534668&zoom=18&addressdetails=1
                    // the service requests adding '&email=' to the requests if there are
                    // going to be many of them
                    $http({
                        method: 'GET', url: 'https://nominatim.openstreetmap.org/reverse?format=json&lat=' + lat +
                        '&lon=' + lon + '&zoom=18&addressdetails=1'
                    }).success(function (message) {
                        console.log("apiMessage", message);
                        callback(null, message);
                    }).error(function (data, status) {
                        callback(new Error('Could not get address:'));
                    });
                },
                geoCode: function (address, callback) {
                    if (!address.country) {
                        address.country = "de";
                    }
                    // well structured
                    //https://nominatim.openstreetmap.org/search?q=135+pilkington+avenue,+birmingham&format=json
                    // the service requests adding '&email=' to the requests if there are
                    // going to be many of them
                    $http({
                        method: 'GET',
                        url: 'https://nominatim.openstreetmap.org/search?format=json&q=' +
                        address.street + '+' + address.city + '+' + address.country
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
                createAddressFromGeo: function (address) {
                    return {
                        city: address.city || address.town || address.village || address.hamlet || "City not found",
                        street: (address.road || address.path || address.footway || address.pedestrian || address.cycleway || "") + " " + (address.house_number || ""),
                        postcode: address.postcode || ""
                    };
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
            };
        }]);
});