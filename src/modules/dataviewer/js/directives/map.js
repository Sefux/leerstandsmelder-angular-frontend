angular.module('ito.angular.directives.dataviewer.maps', [])
    .
    directive('itoMap', ['$window','$timeout', 'featureService','$q', function ($window,$timeout, featureService, $q) {
        'use strict';
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
                                console.log(data);
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
                                        console.log(marker);
                                        marker.addTo(map);
                                    }
                                }
                            }
                        });
                    }
                });
            }
        }
    }])


    .directive('whenScrolled', function() {
        'use strict';
        // this is the infinite scroller described at
        // https://stackoverflow.com/questions/18204473/progressive-loading-in-ng-repeat-for-images-angular-js
        return function (scope, elm, attr) {
            var raw = elm[0],
                style= $window.getComputedStyle(raw),
                overflow = style.getPropertyValue('overflow-x');
            if (overflow === 'scroll')  {
                elm.bind('scroll', function () {
                    if (raw.scrollLeft + raw.offsetWidth >= raw.scrollWidth - 60 ) { //|| raw.scrollLeft + raw.offsetWidth >= raw.scrollWidth
                        scope.$apply(attr.whenScrolled);
                    }
                });
            } else {
                elm.bind('scroll', function () {
                    if (raw.scrollTop + raw.offsetHeight >= raw.scrollHeight  - 60 ) { //|| raw.scrollLeft + raw.offsetWidth >= raw.scrollWidth
                        scope.$apply(attr.whenScrolled);
                    }
                });
            }
        };
    })
    .directive('clickJacker', function() {
        'use strict';
        // general purpose click pass-thru from angular view to controller
        return function (scope, elm, attr) {
            var raw = elm[0];
            $(elm).bind('click', function() {
                scope.$apply(attr.clickJacker);
            });
        };
    });
