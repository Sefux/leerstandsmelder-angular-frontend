/* global console,angular,define,Showdown,localStorage,LEERSTANDSMELDER_API_HOST */

define([
    'services_api',
    'services_helpers'
], function () {
    return angular.module('lsm.directives.widgets', [
            'lsm.services.api',
            'lsm.services.helpers',
            'md.data.table'
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
                                scope.$applyAsync(function () {
                                    scope.locations = locations.results;
                                });
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
                            scope.$applyAsync(function () {
                                if (!err && posts) {
                                    scope.posts = posts;
                                } else {
                                    scope.posts = [];
                                }
                            });
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
                                scope.$applyAsync(function () {
                                    scope.comments.push(comment);
                                    scope.new_comment = {};
                                });
                                scope.$broadcast('captcha:update', true);
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
                                scope.$applyAsync(function () {
                                    if (comments && comments.results) {
                                        scope.comments = comments.results;
                                    } else if (comments) {
                                        scope.comments = comments;
                                    }
                                });
                            });
                        }
                    });
                }
            };
        }])
        .directive('messageForm', ['apiService', '$q', function (apiService, $q) {
            return {
                restrict: 'A',
                templateUrl: '/partials/_message_create.html',
                link: function (scope) {
                    scope.submitMessage = function () {
                        if (scope.message.recipient_uuid && scope.message.body) {
                            apiService('messages').actions.create(scope.message, function (err) {

                            });
                        }
                    };
                }
            };
        }])
        .directive('lsmDataTable', ['$q', 'apiService', function ($q, apiService) {
            return {
                restrict: 'A',
                templateUrl: '/partials/_data_table.html',
                link: function (scope) {
                    scope.selected = [];
                    scope.query = {
                        sort: scope.settings.sort ? scope.settings.sort : 'title',
                        page: 1
                    };
                    scope.getDataForProperty = function (property, data) {
                        var found = false,
                            result = data,
                            parts = property.split('.');
                        for (var i = 0; i < parts.length; i += 1) {
                            if (result[parts[i]]) {
                                found = true;
                                result = result[parts[i]];
                            }
                        }
                        return found ? result : null;
                    };
                    function fetchData(page, pagesize, sort) {
                        var deferred = $q.defer();
                        scope.promise = deferred.promise;
                        var resource = scope.settings.resource + '?pagesize=' + (pagesize || scope.settings.pagesize) +
                            '&page=' + ((page || scope.query.page) - 1) + '&sort=' + (sort || scope.query.sort);
                        apiService(resource).actions.all(function (err, results) {
                            if (!err && results) {
                                scope.data = results.results || results;
                                scope.query.total = results.total;
                                deferred.resolve();
                            } else {
                                deferred.reject();
                            }
                        });
                    }
                    scope.onPaginate = function (page, limit) {
                        fetchData(page, limit, null);
                    };
                    scope.onSort = function (order) {
                        scope.selected = [];
                        fetchData(null, null, order);
                    };
                    scope.$watch("needsUpdate", function (newValue, oldValue) {
                        if (newValue === true) {
                            fetchData();
                        }
                    });
                    fetchData();
                }
            };
        }])
        .directive('msgPopup', ['staticContent', '$mdDialog', '$translate',
            function (staticContent, $mdDialog, $translate) {
                return {
                    restrict: 'A',
                    link: function (scope, elem, attrs) {
                        if (localStorage['popups.' + attrs.popupId]) {
                            return;
                        }
                        staticContent.getMarkdown('popups_' + attrs.popupId, function (err, data) {
                            if (!err) {
                                scope.popupContent = data;
                                var converter = new Showdown.converter(),
                                    html = converter.makeHtml(data);
                                $mdDialog.show($mdDialog.confirm()
                                    .clickOutsideToClose(true)
                                    .title($translate.instant('popups.' + attrs.popupId + '.title'))
                                    .htmlContent(html)
                                    .hasBackdrop(false)
                                    .ariaLabel($translate.instant('popups.' + attrs.popupId + '.title'))
                                    .ok($translate.instant('actions.ok'))
                                    .cancel($translate.instant('actions.dont_show_again')))
                                    .then(function () {}, function () {
                                        try {
                                            localStorage['popups.' + attrs.popupId] = '1';
                                        } catch (e) {
                                            console.log('Warning: LocalStorage is not available.');
                                        }
                                    });
                            }
                        });
                    }
                };
        }]);
});