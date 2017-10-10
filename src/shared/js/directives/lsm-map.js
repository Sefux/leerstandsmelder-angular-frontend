'use strict';

var angular = require('angular'),
    async = require('async'),
    lsmMapconfig = require('../lsm-mapconfig');
    
var getIcon = {
    'locations.unknown': '_andere',
    'locations.artwork_type_options.mural': '_pizza',
    'locations.artwork_type_options.tag': '_oztag',
    'locations.artwork_type_options.parole': '_parole',
    'locations.artwork_type_options.kringel': '_kringel',
    'locations.artwork_type_options.piece': '_ozpiece',
    'locations.artwork_type_options.smiley': '_smiley',
    'locations.artwork_type_options.for_oz': '_fueroz',
    'locations.artwork_type_options.line': '_linien',
    'locations.artwork_type_options.others': '_andere'
    };    

var MapDirective = function ($window, $timeout, mapService, $translate, assetPath) {
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
                //console.log('height',$window.innerHeight);
                el[0].style.height = ($window.innerHeight) + "px";
            };

            var updatedMapData = function (data, callback) {
                var icon = {
                    iconSize: [32, 44],
                    iconAnchor: [16, 43],
                    popupAnchor: [-3, -47],
                    iconUrl: assetPath + 'images/marker-active_andere.png',
                    iconRetinaUrl: assetPath + 'images/marker-active_andere@2x.png'
                };
                var iconActive = L.icon(icon);
                icon.iconUrl = assetPath + 'images/marker-inactive.png';
                icon.iconRetinaUrl = assetPath + 'images/marker-inactive@2x.png';
                var iconInactive = L.icon(icon);

                if(attrs.usecluster) {
                    //add Cluster
                    var markers = L.markerClusterGroup({
                        polygonOptions: { stroke: true, weight: 1, color: '#999', opacity: 0.5 },
                        removeOutsideVisibleBounds: true,
                        maxClusterRadius: 60
                    });
                }
                async.map(data, function (entry, cb) {
                    if (entry.lonlat) {
                        if(entry.artworkType !== undefined && getIcon[entry.artworkType] !== undefined) {
                            icon.iconUrl = assetPath + 'images/marker-active'+ getIcon[entry.artworkType] +'.png';
                            icon.iconRetinaUrl = assetPath + 'images/marker-active'+ getIcon[entry.artworkType] +'@2x.png';
                            iconActive = L.icon(icon);
                        }
                        
                        var options = {
                            icon: entry.active === false || entry.demolished === true ? iconInactive : iconActive,
                            data: entry,
                            draggable: false
                        };
                        var marker = new customMarker([entry.lonlat[1], entry.lonlat[0]], options);

                        marker.on('click', function (e) {
                            var data = e.target.options.data;
                            var popup = "";
                            popup += '<div>';
                            if (data.photo.thumb_square_url) {
                                popup += '<img class="popup_thumb" src="'+data.photo.thumb_square_url+'" width="80px" height="80px" style="width:80px;height:80px;padding-right:1em" flex/>';
                            }
                            popup += '<div>';
                            popup += "<strong>" + data.title + "</strong><br />";
                            if (data.locations) {
                                popup += data.locations + " " + $translate.instant('locations.location_plural') +"<br />";
                            } else {
                                popup += data.street + "<br />";
                                if (data.artworkType !== undefined) {
                                    popup += $translate.instant(data.artworkType)  + " / ";
                                } else {
                                    popup += $translate.instant('locations.unknown')  + " / ";
                                }
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
                        if(attrs.usecluster) {
                            markers.addLayer(marker);
                        } else {
                            marker.addTo(map);
                        }

                        //markers.push(marker);
                        cb(null);
                    }
                }, callback);
                if(attrs.usecluster) {
                    map.addLayer(markers);
                }
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
            };

        //angular.element($window).ready(function () {
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
                    scope.$watch(attrs.locations, function () {
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
                    }, true);
                    
                }
                scope.$watch(attrs.zoom, function () {
                    if (map && scope.$eval(attrs.zoom)) {
                        map.setView(scope.center, scope.zoom || 16);
                    }
                });
                scope.$watch(attrs.center, function () {
                    if (map && scope.$eval(attrs.center)) {
                        map.setView(scope.center, scope.zoom || 16);
                    }
                });
            //});
        }
    };
};

MapDirective.$inject = ['$window', '$timeout', 'mapService', '$translate', 'assetPath'];

module.exports = MapDirective;