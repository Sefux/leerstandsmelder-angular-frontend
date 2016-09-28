/* global console,angular,define */

define([], function () {
    return angular.module('lsm.filters.navrewrite', [])
        .filter('navRewrite', function () {
            return function (link) {
                return '#!' + link;
            };
        });
});
