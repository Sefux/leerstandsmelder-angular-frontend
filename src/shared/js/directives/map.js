/* global L,PruneClusterForLeaflet,angular,define,async,PIECEMETA_API_HOST,console */

define(['lsmMapconfig'], function (lsmMapconfig) {
    return angular.module('lsm.directives.map', [])
        .directive('lsmMap', ['$window', '$timeout', 'mapService', '$translate',
            function ($window, $timeout, mapService, $translate) {
            return {
                restrict: 'A',
                scope: {
                    locations: '=',
                    urlbase: '=',
                    zoom: '=',
                    mapType: '=',
                    center: '=',
                    selectMode: '=',
                    geosearch: '=',
                    selectHandler: '&',
                    selectMarker: '='
                },
                link: function (scope, element, attrs) {
                    var map, leafletView, markers = [],
                        customMarker = L.Marker.extend({
                            options: {
                                data: null
                            }
                        });

                    var resizeMap = function (el) {
                        el[0].style.height = ($window.innerHeight - 88) + "px";
                    };

                    var updatedMapData = function (data, callback) {
                        async.map(data, function (entry, cb) {
                            if (entry.lonlat) {
                                var marker = new customMarker([entry.lonlat[1], entry.lonlat[0]], {
                                        data: entry,
                                        draggable: false
                                    }
                                );
                                marker.addTo(map);
                                marker.on('click', function (e) {
                                    var data = e.target.options.data;
                                    var popup = "";
                                    popup += "<strong>" + data.title + "</strong><br />";
                                    if (data.locations) {
                                        popup += data.locations + " " + $translate.instant('locations.location_plural') +"<br />";
                                    } else {
                                        popup += data.street + "<br />";
                                        popup += data.buildingType + " / " + data.owner + "<br />";
                                    }
                                    popup += "<a href='" + scope.urlbase + (data.slug || data.uuid) + "'>ansehen</a>";
                                    e.target.unbindPopup();
                                    e.target.bindPopup(popup).openPopup();
                                });
                                markers.push(marker);
                                cb(null);
                            }
                        }, callback);
                    };

                    angular.element($window).bind('resize', function () {
                        resizeMap(element);
                    });

                    var setupMap = function () {
                        resizeMap(element);
                        map = mapService.initMap(
                            element,
                            lsmMapconfig,
                            {latlon: scope.center, zoom: scope.zoom},
                            true,
                            scope.$eval(attrs.geosearch)
                        );
                        leafletView = new PruneClusterForLeaflet();
                        leafletView.BuildLeafletClusterIcon = function (cluster) {
                            var e = new L.Icon.MarkerCluster();
                            e.stats = cluster.stats;
                            e.population = cluster.population;
                            return e;
                        };
                        map.addLayer(leafletView);
                    };

                    angular.element($window).ready(function () {
                        if (attrs.selectMode) {
                            setupMap();
                            var marker = mapService.createMarker(null, {draggable: true, latlon: map.getCenter()});
                            marker.on('dragend', function (event) {
                                var marker = event.target;
                                var result = marker.getLatLng();
                                if (typeof scope.selectHandler === 'function') {
                                    scope.selectHandler({latlon: result});
                                }
                            });
                            marker.addTo(map);
                            scope.$watchCollection('selectMarker', function (newVal, oldVal) {
                                var changed = false,
                                    keys = Object.keys(newVal);

                                for (var i = 0; i < keys.length; i += 1) {
                                    if (newVal[keys[i]] !== oldVal[keys[i]]) {
                                        changed = true;
                                    }
                                }

                                if (changed) {
                                    var mapCoords = new L.LatLng(newVal.lat, newVal.lng);
                                    marker.setLatLng(mapCoords);
                                    map.setView(mapCoords, scope.zoom || 16);
                                }
                            });
                        } else {
                            scope.$watch(attrs.locations, function (data) {
                                if (scope.$eval(attrs.locations)) {
                                    setupMap();
                                    updatedMapData(scope.$eval(attrs.locations), function (err) {
                                        if (err) {
                                            console.log('error creating markers', err);
                                        }
                                        // TODO: temporary hack for issue #15, a proper solution would be nicer...
                                        window.setTimeout(function () {
                                            map.invalidateSize(false);
                                        }, 500);
                                    });
                                }
                            });
                        }
                        scope.$watch(attrs.zoom, function (data) {
                            if (map && scope.$eval(attrs.zoom)) {
                                map.setView(scope.center, scope.zoom || 16);
                            }
                        });
                        scope.$watch(attrs.center, function (data) {
                            if (map && scope.$eval(attrs.center)) {
                                map.setView(scope.center, scope.zoom || 16);
                            }
                        });
                    });
                }
            };
        }]);
});