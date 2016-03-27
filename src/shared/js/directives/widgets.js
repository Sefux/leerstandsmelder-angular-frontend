/* global console,angular,define,LEERSTANDSMELDER_API_HOST */

define([], function () {
    return angular.module('lsm.directives.widgets', [
            'lsm.services.api',
            'lsm.services.auth'
        ])
        .directive('recentLocations', ['apiService', function (apiService) {
            return {
                restrict: 'A',
                scope: {
                    region: '=',
                    pageSize: '='
                },
                templateUrl: '/partials/_recent_locations.html',
                link: function (scope, elem, attrs) {
                    scope.$watch(attrs.region, function () {
                        var region = scope.$eval(attrs.region);
                        if (region) {
                            apiService('regions/' + scope.region.uuid + '/locations?sort=-created&pagesize=' +
                                (parseInt(scope.pageSize) || 10)).actions.all(function (err, locations) {
                                scope.locations = locations.results;
                                scope.$apply();
                            });
                        }
                    });
                }
            };
        }])
        .directive('recentPosts', ['apiService', function (apiService) {
            return {
                restrict: 'A',
                scope: {
                    pageSize: '='
                },
                templateUrl: '/partials/_recent_posts.html',
                link: function (scope, elem, attrs) {
                    scope.$watch(attrs.pageSize, function () {
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
        }])
        .directive('comments', ['apiService', 'responseHandler', '$q', function (apiService, responseHandler, $q) {
            return {
                restrict: 'A',
                templateUrl: '/partials/_comments.html',
                link: function (scope, elem, attrs) {
                    scope.new_comment = {};
                    scope.submitComment = function () {
                        var deferred = $q.defer();
                        scope.promise = deferred.promise;
                        if (!scope.new_comment.body) {
                            return;
                        }
                        var obj = {
                            subject_uuid: scope.$eval(attrs.uuid),
                            body: scope.new_comment.body,
                            captcha: scope.new_comment.captcha ? scope.new_comment.captcha : 'nocaptcha'
                        };
                        apiService('comments').actions.create(obj, function (err, comment) {
                            var msgs = {
                                success: 'messages.comments.create_success'
                            };
                            if (responseHandler.handleResponse(err, deferred, msgs)) {
                                scope.comments.push(comment);
                                scope.new_comment = {};
                                scope.$broadcast('captcha:update', true);
                                scope.$apply();
                            } else {
                                scope.$broadcast('captcha:update', true);
                            }
                        });
                    };
                    scope.$watch(attrs.uuid, function () {
                        var uuid = scope.$eval(attrs.uuid);
                        if (uuid) {
                            var url = [attrs.resource, uuid, 'comments'].join('/');
                            apiService(url)
                                .actions.all(function (err, comments) {
                                // TODO: api result format must be unified!
                                if (comments.results) {
                                    scope.comments = comments.results;
                                } else {
                                    scope.comments = comments;
                                }
                                scope.$apply();
                            });
                        }
                    });
                }
            };
        }]);
});