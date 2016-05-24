/* global angular,define,async,console */

define([
    'services_api',
    'services_helpers',
    'directives_helpers'
], function () {
    return angular.module(
        'lsm.controllers.posts',
        [
            'lsm.services.api',
            'lsm.services.helpers',
            'lsm.directives.helpers'
        ])
        .controller('Posts.Show', ['$scope', '$rootScope', '$q', '$routeParams', 'apiService', 'responseHandler',
            function ($scope, $rootScope, $q, $routeParams, apiService, responseHandler) {
            var deferred = $q.defer();
            $scope.promise = deferred.promise;
            apiService('posts').actions.find($routeParams.uuid, function (err, post) {
                $scope.post = post;
                responseHandler.handleResponse(err, deferred);
            });
        }])
        .controller('Posts.List', ['$scope', '$q', 'apiService', 'responseHandler', '$location',
            function ($scope, $q, apiService, responseHandler, $location) {
            $scope.fields = [
                {
                    label: 'posts.title',
                    property: 'title'
                },
                {
                    label: 'author.created',
                    property: 'created',
                    date: true
                },
                {
                    label: 'author.updated',
                    property: 'updated',
                    date: true
                }
            ];
            $scope.settings = {
                row_select: false,
                multiple: false,
                pagination: true,
                pagesize: 25,
                limit_options: [25, 50, 100],
                resource: 'posts'
            };
            $scope.actions = [
                {
                    label: 'actions.edit',
                    css_class: 'fa-pencil-square-o',
                    clickHandler: function (item) {
                        $location.path('/admin/posts/' + item.uuid);
                    }
                },
                {
                    label: 'actions.delete',
                    css_class: 'fa-trash-o',
                    clickHandler: function (item) {
                        var deferred = $q.defer();
                        $scope.promise = deferred.promise;
                        apiService('posts').remove(item.uuid, function (err) {
                            if (responseHandler.handleResponse(err, deferred)) {
                                $location.path('/admin/posts');
                            }
                        });
                    }
                },
                {
                    label: 'actions.show',
                    css_class: 'fa-eye',
                    clickHandler: function (item) {
                        $location.path('/posts/' + (item.slug || item.uuid));
                    }
                }
            ];
        }])
        .controller('Posts.ListStatic', ['$scope', '$q', 'apiService', 'responseHandler', '$location',
            function ($scope, $q, apiService, responseHandler, $location) {
            $scope.fields = [
                {
                    label: 'posts.title',
                    property: 'title'
                },
                {
                    label: 'author.updated',
                    property: 'updated',
                    date: true
                }
            ];
            $scope.settings = {
                row_select: false,
                multiple: false,
                pagination: true,
                pagesize: 25,
                limit_options: [25, 50, 100],
                resource: 'posts/static'
            };
            $scope.actions = [
                {
                    label: 'actions.edit',
                    css_class: 'fa-pencil-square-o',
                    clickHandler: function (item) {
                        $location.path('/admin/posts/' + item.uuid);
                    }
                },
                {
                    label: 'actions.delete',
                    css_class: 'fa-trash-o',
                    clickHandler: function (item) {
                        var deferred = $q.defer();
                        $scope.promise = deferred.promise;
                        apiService('posts').remove(item.uuid, function (err) {
                            if (responseHandler.handleResponse(err, deferred)) {
                                $location.path('/admin/posts/static');
                            }
                        });
                    }
                },
                {
                    label: 'actions.show',
                    css_class: 'fa-eye',
                    clickHandler: function (item) {
                        $location.path('/posts/' + (item.slug || item.uuid));
                    }
                }
            ];
        }])
        .controller('Posts.Update', ['$scope', '$q', '$routeParams', 'apiService', 'responseHandler',
            function ($scope, $q, $routeParams, apiService, responseHandler) {
            var deferred;
            if ($routeParams.uuid) {
                deferred = $q.defer();
                $scope.promise = deferred.promise;
                apiService('posts').actions.find($routeParams.uuid, function (err, post) {
                    $scope.post = post;
                    responseHandler.handleResponse(err, deferred);
                });
            }
            $scope.submit = function () {
                deferred = $q.defer();
                $scope.promise = deferred.promise;
                $scope.post.body = $scope.editor.value();
                if ($routeParams.uuid) {
                    apiService('posts').actions.update($routeParams.uuid, $scope.post, function (err) {
                        var msgs = {
                            success: 'posts.update_success'
                        };
                        responseHandler.handleResponse(err, deferred, msgs);
                    });
                } else {
                    apiService('posts').actions.create($scope.post, function (err) {
                        var msgs = {
                            success: 'posts.create_success'
                        };
                        responseHandler.handleResponse(err, deferred, msgs);
                    });
                }
            };
        }]);
});