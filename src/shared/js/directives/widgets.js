/* global console,angular,define,LEERSTANDSMELDER_API_HOST */

define([], function () {
    return angular.module('lsm.directives.widgets', [
            'lsm.services.api',
            'lsm.services.auth'
        ])
        .directive('latestLocations', ['apiService', function (apiService) {
            return {
                restrict: 'A',
                scope: {
                    region: '=',
                    pageSize: '='
                },
                templateUrl: '/partials/_recent_locations.html',
                link: function (scope, elem, attrs) {
                    scope.$watch(attrs.region, function (data) {
                        var region = scope.$eval(attrs.region);
                        if (region) {
                            apiService('regions/' + scope.region.uuid + '/locations?sort=-created&pagesize=' +
                                (parseInt(scope.pageSize) || 10)).actions.all(function (err, locations) {
                                scope.locations = locations.results;
                            });
                        }
                    });
                }
            };
        }])
        .directive('latestPosts', ['apiService', function (apiService) {
            return {
                restrict: 'A',
                scope: {
                    pageSize: '='
                },
                templateUrl: '/partials/_recent_posts.html',
                link: function (scope, elem, attrs) {
                    scope.$watch(attrs.pageSize, function (data) {
                        apiService('posts?sort=-created&limit=' + (parseInt(scope.pageSize) || 10))
                            .actions.all(function (err, posts) {
                            if (!err && posts) {
                                scope.posts = posts;
                            } else {
                                scope.posts = [];
                            }
                        });
                    });
                }
            };
        }]);
});