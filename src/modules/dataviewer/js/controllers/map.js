/* global Global,PruneCluster,PruneClusterForLeaflet,L,angular,define,async,PIECEMETA_API_HOST,console */

define([], function () {
    return angular.module(
        'ito.angular.controllers.dataviewer.maps',[])
        .controller('Maps.Sidebar',  ['$scope', '$q', '$location','mapApiService','featureService','$routeParams','$route', function ($scope, $q,$location, mapApiService, featureService, $routeParams, $route) {

        }])
        .controller('Maps.Mapview',  ['$scope', '$window','$q', '$location','mapApiService','featureService','$routeParams','$log', function ($scope,$window, $q,$location, mapApiService, featureService, $routeParams, $log) {

            // because the map is in a flexbox
            // we need to tell it how big it really is.
            // for some reason I can't get the navbar's height. :(
            // var navbar = document.getElementById('navbar');

            var resizeMap = function() {
                var domMap = document.getElementById('map');
                domMap.style.height=($window.innerHeight - 88)+"px";
            };
            $scope.initializeWindowSize = function() {
                $scope.windowHeight = $window.innerHeight;
                $scope.windowWidth = $window.innerWidth;
                return;
            };
            $scope.initializeWindowSize();
            angular.element($window).bind('resize', function() {
                resizeMap();
            });

            angular.extend($scope, {
                offset : 0,
                listviewShown : 0,
                user: null,
                markers: {},
                activeMarker: null,
                promise: null,
                promiseString: null,
                imageData:  {
                    latestImages : [],
                    currentMatches : []
                },
                bginfo: false
            });

            $scope.star = function(stars,image_id) {
                async.waterfall([
                    function (cb) {
                        mapApiService.starImage(image_id, $scope.user, stars, cb);
                    },
                    function(result,cb){
                        console.log("stars",stars);
                        console.log("controllerResult",result.stars);
                        $scope.$apply(function() {
                            $scope.markers[image_id].stars = result.stars.toFixed(2);
                            $scope.markers[image_id].starrers = result.starrers;
                            $scope.markers[image_id].userStars = stars;
                        });
                        cb(null,result);
                    }
                ], function (err) {
                    if (err) {
                        console.log('an error occurred while starring the image', err);
                    }
                });
            };

            // this is for updating the listview on scroll
            // see .directive('whenScrolled', function() {
            // && #markerList(when-scrolled="pull10Images()")
            $scope.pull10Images = function() {

                async.waterfall([
                    function (cb) {
                        mapApiService.get10Images($scope.offset, cb);
                    },
                    function (images, cb) {
                        if (images.length === 0) {
                            cb(new Error('no images found, aborting'), null);
                            return;
                        }

                        cb(null, {
                            images: images
                        });
                    },
                    function (results, cb) {
                        async.parallel([
                            function (cb) {

                                $scope.originalOffset = $scope.offset;
                                async.eachSeries(results.images, function (image, next) {

                                    if ($scope.offset < $scope.originalOffset + 10 && image) {
                                        $scope.offset ++;
                                        $scope.markers[image._id].visible = true;
                                        $scope.markers[image._id].offset = $scope.offset;
                                    }
                                    next();
                                }, cb);
                            }
                        ], function (err) {
                            $scope.$apply();
                            cb(err);
                        });
                    }
                ], function (err) {
                    if (err) {
                        var error = err;
                        console.log('an error occurred while setting up the images', err);
                        deferred.reject();
                    }
                });
                deferred.resolve();

            };

            var pullImages = function() {
                var deferred = $q.defer();
                $scope.promiseString = 'Getting Images...';
                $scope.promise = deferred.promise;
                async.waterfall([
                    function (cb) {
                        mapApiService.getAllImages(cb);
                    },
                    function (images, cb) {
                        if (images.length === 0) {
                            cb(new Error('no images found, aborting'), null);
                            return;
                        }
                        cb(null, {
                            images: images
                        });
                    },
                    function (results, cb) {
                        async.parallel([
                            function (cb) {
                                // we are using an offset to enable infinite scroll
                                // and remember where we are.
                                $scope.originalOffset = $scope.offset;
                                async.eachSeries(results.images, function (image, next) {

                                    if ($scope.offset < $scope.originalOffset + 15 && image) {
                                        $scope.offset ++;
                                        $scope.addMarkerToMap(image, $scope.offset,false);

                                    }  else {
                                        $scope.addMarkerToMap(image, false);
                                    }

                                    next();
                                }, cb);
                            }
                        ], function (err) {
                            $scope.$apply();
                            cb(err);
                        });
                    }
                ], function (err) {
                    if (err) {
                        console.log('an error occurred while setting up the images', err);
                        deferred.reject();
                        return;
                    }

                    angular.extend($scope, markers);
                    leafletView.PrepareLeafletMarker = function (marker, data) {
                        if (marker.getPopup()) {
                            marker.setPopupContent('<img src="'+data.url+'"  width="250px"/>');
                        } else {
                            marker.bindPopup('<img src="'+data.url+'" alt="'+data.author+'" width="250px" />');
                        }
                    };
                    $scope.map.addLayer(leafletView);
                });
            };
            $scope.categories = [
                // todo: turn this into an array that can be reused
                "Pizza",
                "Kringel",
                "Smiley",
                "OZ-Tags",
                "Parolen",
                "Andere Tags"
            ];



            var deferred = $q.defer();
            $scope.promiseString = 'Loading Map Assets...';
            $scope.promise = deferred.promise;

            //todo: it seems socket.io changed the io.connect command. Rlly???:/
            /*
             var obj;
             //var socket = io.connect('http://localhost:7000/');
             socket.on('message', function (data) {
             // todo: as it stands we are pulling the entire list. :(
             // it would be good to only pull the newest one and unshift the list.
             try {
             obj = JSON.parse(data);
             } catch (e) {
             console.log('socket message parse error', data, e);
             return;
             }
             if (typeof obj === 'object' && obj._id && (typeof obj.team_id === 'undefined' || obj.team_id === null)) {
             $scope.offset ++;
             $scope.addMarkerToMap(obj, 0, true, 0);
             } else {
             console.log('socket error', obj);
             }
             console.log($scope.offset);
             });
             */




            var colors = ['#ff4b00', '#bac900', '#EC1813', '#55BCBE', '#D2204C', '#FF0000', '#ada59a', '#3e647e'],
                tau = Math.PI * 2;
            L.Icon.MarkerCluster = L.Icon.extend({
                options: {
                    iconSize: new L.Point(64, 64),
                    className: 'prunecluster leaflet-markercluster-icon'
                },
                createIcon: function () {
                    // based on L.Icon.Canvas from shramov/leaflet-plugins (BSD licence)
                    var e = document.createElement('canvas');
                    this._setIconStyles(e, 'icon');
                    var s = this.options.iconSize;
                    e.width = s.x;
                    e.height = s.y;
                    this.draw(e.getContext('2d'), s.x, s.y);
                    return e;
                },
                createShadow: function () {
                    return null;
                },
                draw: function(canvas) { // , width, height
                    var start = 0;
                    for (var i = 0, l = colors.length; i < l; ++i) {
                        var size = this.stats[i] / this.population;
                        if (size > 0) {
                            canvas.beginPath();
                            canvas.moveTo(22, 22);
                            canvas.fillStyle = colors[i];
                            var from = start + 0.14,
                                to = start + size * tau;
                            if (to < from) {
                                from = start;
                            }
                            canvas.arc(22,22,22, from, to);
                            start = start + size*tau;
                            canvas.lineTo(22,22);
                            canvas.fill();
                            canvas.closePath();
                        }
                    }
                    canvas.beginPath();
                    canvas.fillStyle = 'white';

                    canvas.closePath();
                    canvas.arc(22, 22, 14, 0, Math.PI*2);
                    canvas.fill();
                    canvas.closePath();
                    canvas.fillStyle = '#555';
                    canvas.textAlign = 'center';
                    canvas.textBaseline = 'middle';
                    canvas.font = 'bold 12px sans-serif';
                    canvas.fillText(this.population, 22, 22, 40);
                }
            });

            $scope.addMarkerToMap = function(image,offset,visibility,userStars) {
                if (image) {
                    // this is our master store, which is used by leaflet and listview
                    // $scope.$apply(function(){ // MAKES IT WAY SLOW!!!
                    // this var exists to smooth out any db inconsistencies
                    // todo: remove this shit!!!
                    var stars = image.stars || 0;
                    userStars = userStars || 0;

                    $scope.markers[ image._id ] = {
                        _id: image._id,
                        location: image.location,
                        lat: image.location[0],
                        lng: image.location[1],
                        looks: image.looks,
                        userStars: userStars,
                        stars: stars.toFixed(2),
                        starrers: image.starrers,
                        //icon: $scope.extraMarker,
                        draggable:false,
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
                        category: image.category || "Andere Tags"
                };

                }

                var marker = new PruneCluster.Marker(image.location[0], image.location[1], {url:'/api/image/' + image._id,author: image.contributor_id });
                // This can be a string, but numbers are nice too
                marker.category = Math.floor(Math.random() * Math.random() * colors.length);

                //markers.push(marker);
                marker.data.icon = L.Icon({iconUrl: '/images/active-marker-icon.png'});
                marker.data.draggable = true;
                leafletView.RegisterMarker(marker);

                // TRYING TO GET THE CATEGORIES TO WORK
                leafletView.BuildLeafletClusterIcon = function(cluster) {
                    var e = new L.Icon.MarkerCluster();
                    e.stats = cluster.stats;
                    e.population = cluster.population;
                    return e;
                };

            };

            var map, $map, tileLayer, markers = {};
            var userPosition;
            var baseMarkerIcon, defaultMarkerIcon, activeMarkerIcon, GPSMarkerIcon;
            $scope.isInitialized = false;
            var leafletView = new PruneClusterForLeaflet();

            var init = function() {

                if (! $scope.isInitialized ) {
                    // fix the map
                    resizeMap();
                    // todo: functionalize this

                    async.waterfall([
                        function(cb) {
                            initMap();
                            cb(null);
                        },
                        function(cb) {
                            //pullImages();
                            cb(null);
                        },
                        function (cb) {
                            var deferred = $q.defer();
                            $scope.promiseString = 'Please Wait.';
                            $scope.promise = deferred.promise;
                            angular.extend($scope, markers);
                            featureService.geo($scope);

                            if (localStorage.user === null) {
                                var waitForID = setInterval(function(){
                                    if ($scope.user !== null) {
                                        clearInterval(waitForID);
                                        cb(null , $scope.user);
                                    }
                                },50);
                            } else {
                                $scope.user = localStorage.user;
                                cb(null, $scope.user);
                            }
                        },
                        function(user,cb) {
                            mapApiService.getUserStars(user, function (err, val) {
                                cb(null, val);
                            });
                        },
                        function (stars, cb) {
                            if (stars.length === 0) {
                                cb(new Error('no images found, aborting'), null);
                                return;
                            }
                            cb(null, {
                                stars: stars
                            });
                        },
                        function(stars,cb) {
                            async.parallel([
                                function (cb) {
                                    $scope.originalOffset = $scope.offset;
                                    async.eachSeries(stars.stars, function (star, next) {
                                        if ($scope.markers[star.image_id]) {
                                            $scope.markers[star.image_id].userStars = star.new_stars;
                                        }
                                        next();
                                    }, cb);
                                }
                            ], function (err) {
                                $scope.$apply();
                                cb(err);
                                deferred.resolve();

                            });
                        },
                        function (cb) {
                            // movezooms map and shows
                            // the item if available in the url
                            var focused = $routeParams._id;
                            if (focused !== null) {
                                $scope.openMarker($routeParams._id);
                                cb(null);
                            } else {
                                cb(null);
                            }
                        },
                        function (cb) {
                            resizeForScrollbars();
                            cb(null);
                        }
                    ], function (err) {
                        if (err) {
                            console.log('an error occurred while getting images', err);
                            deferred.reject();
                        }
                    });

                    $scope.isInitialized = true;
                }

            };


            var initMap = function() {

                // Basic Leaflet marker icon that other marker types will inherit from
                baseMarkerIcon = L.Icon.extend({
                    options: {
                        shadowUrl: '/images/marker-shadow.png',
                        iconUrl: '/images/marker-icon.png',
                        iconSize:     [25, 41],
                        shadowSize:   [41, 41],
                        iconAnchor:   [12, 40],
                        shadowAnchor: [14, 40],
                        popupAnchor:  [-3, -76],
                        labelAnchor:  [-21,-21]
                    }
                });
                L.Icon.Default.imagePath = '/images';
                //L.Icon.Default.shadowPath = '/images/marker-shadow.png';

                // The two marker types: default (blue) and active (green)
                defaultMarkerIcon = new baseMarkerIcon({iconUrl: '/images/marker-icon.png'});
                $scope.activeMarkerIcon = new baseMarkerIcon({iconUrl: '/images/active-marker-icon.png'});
                $scope.GPSMarkerIcon = new baseMarkerIcon({iconUrl: '/images/kartograf.png'});

                // Set up the Leaflet map
                //$map = $('#map');
                $scope.map = L.map('map',{
                    animate:true,
                    attributionControl: false
                });
                $scope.map.setView([53.5555252,9.98361312], 12);
                //var osmUrl = 'http://a.tiles.mapbox.com/v3/examples.map-i86nkdio/{z}/{x}/{y}.png';
                var osmUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

                // Load tiles from OpenStreetMap
                tileLayer = new L.tileLayer(osmUrl, {
                    //tileLayer = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    //tileLayer = L.tileLayer('http://{s}.tile.stamen.com/watercolor/{z}/{x}/{y}.jpg', {
                    //tileLayer = L.tileLayer('http://{s}.oatile.mqcdn.com/tiles/1.0.0/sat/{z}/{x}/{y}.jpg', {
                    minZoom: 3,
                    maxZoom: 19,
                    detectRetina: true,
                    location: "enableHighAccuracy"
                }).addTo($scope.map);

                var tileLayer2 = new L.TileLayer(osmUrl, {minZoom: 3, maxZoom: 15,detectRetina: true});
                var miniMap = new L.Control.MiniMap(tileLayer2,{
                    toggleDisplay: true,
                    width: 110,
                    height: 110,
                    position: 'topright'
                }).addTo($scope.map);


                // PREP CLUSTERS //
                //var leafletView = new PruneClusterForLeaflet();
                PruneCluster.Cluster.ENABLE_MARKERS_LIST = true;

                // CONTROLS //
                L.control.scale().addTo($scope.map).setPosition('bottomleft');

                // geocoder
                //L.Control.geocoder({
                //    position:"topleft"
                //}).addTo($scope.map);
                new L.Control.GeoSearch({
                    position:"topleft",
                    showMarker: true,
                    retainZoomLevel: false,
                    provider: new L.GeoSearch.Provider.OpenStreetMap({
                        //region: region
                    })
                }).addTo($scope.map);

                $scope.map.zoomControl.setPosition('topleft');


                // begin prunecluster test
                /*
                var size = 100;
                var markers = [];

                var leafletView2 = new PruneClusterForLeaflet();

                for (var i = 0; i < size; ++i) {
                    var marker = new PruneCluster.Marker(59.91111 + (Math.random() - 0.5) * 0.00001 * size, 10.752778 + (Math.random() - 0.5) * 0.00002 * size);

                    markers.push(marker);
                    leafletView2.RegisterMarker(marker);
                }

                window.setInterval(function () {
                    for (i = 0; i < size / 2; ++i) {
                        var coef = i < size / 8 ? 10 : 1;
                        var ll = markers[i].position;
                        ll.lat += (Math.random() - 0.5) * 0.00001 * coef;
                        ll.lng += (Math.random() - 0.5) * 0.00002 * coef;
                    }

                    leafletView2.ProcessView();
                }, 500);

                $scope.map.addLayer(leafletView2);
                */
                // end prunecluster test

            };



            $scope.openMarker = function(id) {
                //L.removeFromMap( $scope.activePin,$scope.map);
                $scope.activeMarker = $scope.markers[id];
                $scope.showInfo=true;
                this.lat = $scope.markers[id].lat;
                this.lng = $scope.markers[id].lng;
                centerMapOnCoordinates( $scope.markers[id].location );

                L.marker($scope.markers[id].location, {
                    icon: activeMarkerIcon,
                    draggable: true
                });
                $location.path("/mapview/"+id, false);

            };
            $scope.closeInfo = function() {
                $scope.showInfo=false;
                $scope.activeMarker = {};
                setTimeout(function(){
                    $scope.map.invalidateSize(true);
                },0);
            };

            init();

            // ---
            // Map
            // ---
            var onLocationFound = function(lat,long) {
                $.event.trigger('map:geolocated');

                var radius = Global.GPSaccuracy / 2;
                if(!userPosition){
                    userPosition = L.circle(Global.GPSlat,Global.GPSlong, radius).addTo($scope.map);
                } else {
                    userPosition.setLatLng(Global.GPSlat,Global.GPSlong).setRadius(radius);
                }
            };
            var centerMapOnCoordinates = function(latlng) {
                $scope.map.panTo(latlng);
                $scope.map.setView(latlng, 19);
                setTimeout(function(){
                    $scope.map.invalidateSize(true);
                },0);

            };


            // Displays a marker on the map
            // put this back
            var addMarkerToMap = function(properties) {
                $map = $('#map');
                var latlng = properties.location;
                var messages = 0;
                if(markers[properties._id]){
                    //messages = markers[properties._id].messages;
                    markers[properties._id] = null;
                }
                leafletView.RegisterMarker(new PruneCluster.Marker(properties.location[0], properties.location[1], {title: properties.contributor_id}));
            };


            function handleBookmarkOpen(event, latlng, zoom) {
                map.setView(latlng, zoom);
            }
            $scope.newMarker = function() {
                //$scope.markers[ _id ].draggable=true;
                if ($scope.markerMv) {
                    $scope.map.removeLayer($scope.markerMv);
                    $scope.markerMv=null;
                }
                $scope.markerMv=L.marker(new L.LatLng($scope.map.getCenter()), {
                    draggable: true,
                    icon: $scope.activeMarkerIcon
                });
                $scope.markerMv.addTo($scope.map);

                $scope.markerMv.on('dragend', function(event) {
                    var marker = event.target;
                    var result = marker.getLatLng();
                    $scope.$apply(function() {
                        $scope.activeMarker.lat = result.lat;
                        $scope.activeMarker.lng = result.lng;
                    });
                });
            };
            $scope.moveMarker = function(_id) {
                if ($scope.markerMv) {
                    $scope.map.removeLayer($scope.markerMv);
                    $scope.markerMv=null;
                }
                $scope.markerMv=L.marker(new L.LatLng($scope.markers[ _id ].location[0], $scope.markers[ _id ].location[1]), {
                    draggable: true,
                    icon: $scope.activeMarkerIcon
                });
                $scope.markerMv.addTo($scope.map);

                $scope.markerMv.on('dragend', function(event) {
                    var marker = event.target;  // you could also simply access the marker through the closure
                    var result = marker.getLatLng();  // but using the passed event is cleaner
                    $scope.$apply(function() {
                        $scope.activeMarker.lat = result.lat;
                        $scope.activeMarker.lng = result.lng;
                    });
                });
            };
            $scope.updateMarker = function(_id) {
                $scope.map.removeLayer($scope.markerMv);
                $scope.markerMv=null;
            };
            $scope.cancelEdit = function(_id) {
                $scope.map.removeLayer($scope.markerMv);
                $scope.markerMv=null;
            };
            $scope.$apply();
            // Turns a store object's createdAt attribute into a nice date string
            var addCreatedAtReadable = function(properties) {
                //var weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
                var weekdays = ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"];
                var date = new Date(properties);
                //var weekday = weekdays[date.getDay()];
                // return weekday + " - "+ date.toFormat("DD.MM.YYYY - HH24:MM");
                return  date.toFormat("DD.MM.YYYY - HH24:MM");
            };



        }]);
});