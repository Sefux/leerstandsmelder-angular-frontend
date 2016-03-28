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
        .controller('Posts.List', ['$scope', '$q', 'apiService', 'responseHandler',
            function ($scope, $q, apiService, responseHandler) {
            var deferred = $q.defer();
            $scope.promise = deferred.promise;
            apiService('posts?sort=-created').actions.all(function (err, posts) {
                $scope.posts = posts;
                responseHandler.handleResponse(err, deferred);
            });
        }])
        .controller('Posts.Update', ['$scope', '$q', '$routeParams', 'apiService', 'responseHandler',
            function ($scope, $q, $routeParams, apiService, responseHandler) {
            var deferred = $q.defer();
            $scope.promise = deferred.promise;
            apiService('posts').actions.find($routeParams.uuid, function (err, post) {
                $scope.post = post;
                responseHandler.handleResponse(err, deferred);
            });
            $scope.submit = function () {
                apiService('posts').actions.update($routeParams.uuid, $scope.post, function (err) {
                    var msgs = {
                        success: 'posts.update_success'
                    };
                    responseHandler.handleResponse(err, deferred, msgs);
                });
            };
        }]);
});