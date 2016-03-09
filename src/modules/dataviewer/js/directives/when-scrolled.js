/* global L,PruneClusterForLeaflet,angular,define,async,PIECEMETA_API_HOST,console */

define([], function () {
    return angular.module('ito.angular.directives.dataviewer.whenscrolled', [])
        .directive('whenScrolled', ['$window', function ($window) {
            // this is the infinite scroller described at
            // https://stackoverflow.com/questions/18204473/progressive-loading-in-ng-repeat-for-images-angular-js
            return function (scope, elm, attr) {
                var raw = elm[0],
                    style = $window.getComputedStyle(raw),
                    overflow = style.getPropertyValue('overflow-x');
                if (overflow === 'scroll') {
                    elm.bind('scroll', function () {
                        if (raw.scrollLeft + raw.offsetWidth >= raw.scrollWidth - 60) { //|| raw.scrollLeft + raw.offsetWidth >= raw.scrollWidth
                            scope.$apply(attr.whenScrolled);
                        }
                    });
                } else {
                    elm.bind('scroll', function () {
                        if (raw.scrollTop + raw.offsetHeight >= raw.scrollHeight - 60) { //|| raw.scrollLeft + raw.offsetWidth >= raw.scrollWidth
                            scope.$apply(attr.whenScrolled);
                        }
                    });
                }
            };
        }]);
});