/* global L,PruneClusterForLeaflet,angular,define,async,PIECEMETA_API_HOST,console */

define([
    'lsmMapconfig',
    'services_map'
], function (lsmMapconfig) {
    return angular.module('lsm.directives.map', [
            'lsm.services.map'
        ])
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
                        var icon = {
                            iconSize: [32, 44],
                            iconAnchor: [16, 43],
                            popupAnchor: [-3, -47],
                            iconUrl: '/images/marker-active.png',
                            iconRetinaUrl: '/images/marker-active@2x.png'
                        };
                        var iconActive = L.icon(icon);
                        icon.iconUrl = '/images/marker-inactive.png';
                        icon.iconRetinaUrl = '/images/marker-inactive@2x.png';
                        var iconInactive = L.icon(icon);
                        async.map(data, function (entry, cb) {
                            if (entry.lonlat) {
                                var options = {
                                    icon: entry.active === false || entry.demolished === true ? iconInactive : iconActive,
                                    data: entry,
                                    draggable: false
                                };
                                var marker = new customMarker([entry.lonlat[1], entry.lonlat[0]], options);
                                marker.addTo(map);
                                marker.on('click', function (e) {
                                    var data = e.target.options.data;
                                    var popup = "";
                                    popup += '<div>';
                                    if (data.thumb_url) {
                                        popup += '<img class="popup_thumb" src="'+data.thumb_url+'" width="80px" height="80px" style="width:80px;height:80px;padding-right:1em" flex/>';
                                    }
                                    popup += '<div>';
                                    popup += "<strong>" + data.title + "</strong><br />";
                                    if (data.hasOwnProperty('locations')) {
                                        popup += data.locations + " " + $translate.instant('locations.location_plural') +"<br />";
                                    } else {
                                        popup += data.street + "<br />";
                                        popup += $translate.instant(data.buildingType) + " / ";
                                        if (data.owner !== undefined) {
                                            popup += $translate.instant(data.owner)  + "<br />";
                                        } else {
                                            popup += $translate.instant('locations.unknown')  + "<br />";
                                        }
                                    }
                                    if (scope.urlbase){
                                        popup += "<a href='" + scope.urlbase + (data.slug || data.uuid) + "'>" + $translate.instant('actions.show') +"</a>";
                                    }


                                    popup += "</div></div>";
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

                    var setupMap = function (miniMap, geoSearch) {
                        resizeMap(element);
                        map = mapService.initMap(
                            element,
                            lsmMapconfig,
                            {latlon: scope.center, zoom: scope.zoom},
                            miniMap,
                            geoSearch
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
                            setupMap(true, false);
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
                                    setupMap(true, false);
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