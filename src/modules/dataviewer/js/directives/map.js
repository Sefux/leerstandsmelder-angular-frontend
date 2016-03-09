/* global L,PruneClusterForLeaflet,angular,define,async,PIECEMETA_API_HOST,console */

define(['ITOMapConfig'], function (ITOMapConfig) {
    return angular.module('ito.angular.directives.dataviewer.maps', [])
        .directive('itoMap', ['$window', '$timeout', 'featureService', '$q', function ($window, $timeout, featureService, $q) {
            return {
                restrict: 'A',
                scope: {
                    locations: '=',
                    cities: '=',
                    selectMode: '=',
                    selectHandler: '&',
                    selectMarker: '='
                },
                link: function (scope, element, attrs) {
                    var map, leafletView;

                    var resizeMap = function (el) {
                        el[0].style.height = ($window.innerHeight - 88) + "px";
                    };

                    angular.element($window).bind('resize', function () {
                        resizeMap(element);
                    });

                    angular.element($window).ready(function () {
                        resizeMap(element);
                        map = featureService.initMap(element, ITOMapConfig, true);
                        leafletView = new PruneClusterForLeaflet();
                        leafletView.BuildLeafletClusterIcon = function (cluster) {
                            var e = new L.Icon.MarkerCluster();
                            e.stats = cluster.stats;
                            e.population = cluster.population;
                            return e;
                        };
                        map.addLayer(leafletView);

                        if (attrs.selectMode) {
                            var marker = featureService.createMarker(null, {draggable: true, latlon: map.getCenter()});
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
                                    map.setView(mapCoords, 16);
                                }
                            });
                        } else {
                            scope.$watch(attrs.locations, function (data) {
                                if (data) {
                                    for (var i = 0; i < data.length; i += 1) {
                                        if (data[i].lonlat) {
                                            var marker = featureService.createMarker(null, {
                                                view_url: '/location/' + data[i].uuid,
                                                draggable: false,
                                                latlon: [data[i].lonlat[1], data[i].lonlat[0]]
                                            });
                                            marker.on('click', function () {
                                                window.location = this.options.view_url;
                                            });
                                            marker.addTo(map);
                                        }
                                    }
                                }
                            });
                        }
                    });
                }
            };
        }]);
});