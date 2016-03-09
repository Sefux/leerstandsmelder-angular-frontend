/* global L,PruneClusterForLeaflet,angular,define,async,PIECEMETA_API_HOST,console */

define([], function () {
    return angular.module('ito.angular.directives.dataviewer.clickjacker', [])
        .directive('clickJacker', function () {
            // general purpose click pass-thru from angular view to controller
            return function (scope, elm, attr) {
                var raw = elm[0];
                $(elm).bind('click', function () {
                    scope.$apply(attr.clickJacker);
                });
            };
        });
});