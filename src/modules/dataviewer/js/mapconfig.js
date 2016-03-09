/* global define */

define([], function () {
    return {
        temporary: {
            colors: ['#ff4b00', '#bac900', '#EC1813', '#55BCBE', '#D2204C', '#FF0000', '#ada59a', '#3e647e']
        },
        geoSearch: {
            main: {
                position: "topleft",
                showMarker: true,
                retainZoomLevel: false
            },
            provider: {
                //region: region
            }
        },
        mainMap: {
            //osmUrl: 'http://a.tiles.mapbox.com/v3/examples.map-i86nkdio/{z}/{x}/{y}.png',
            osmUrl: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            tileLayer: {
                minZoom: 3,
                maxZoom: 19,
                detectRetina: true,
                location: "enableHighAccuracy"
            },
            mapConfig: {
                animate: true,
                attributionControl: false
            },
            defaults: {
                latlon: [53.5555252, 9.98361312],
                zoom: 12
            }
        },
        miniMap: {
            //osmUrl: 'http://a.tiles.mapbox.com/v3/examples.map-i86nkdio/{z}/{x}/{y}.png',
            osmUrl: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            tileLayer: {
                minZoom: 3,
                maxZoom: 15,
                detectRetina: true
            },
            mapConfig: {
                toggleDisplay: true,
                width: 110,
                height: 110,
                position: 'topright'
            }
        },
        markers: {
            baseMarker: {
                options: {
                    shadowUrl: '/images/marker-shadow.png',
                    iconUrl: '/images/marker-icon.png',
                    iconSize: [25, 41],
                    shadowSize: [41, 41],
                    iconAnchor: [12, 40],
                    shadowAnchor: [14, 40],
                    popupAnchor: [-3, -76],
                    labelAnchor: [-21, -21]
                }
            }
        },
        icons: {
            basePath: '/images',
            activeMarkerIcon: {iconUrl: '/images/active-marker-icon.png'},
            GPSMarkerIcon: {iconUrl: '/images/kartograf.png'}
        }
    };
});