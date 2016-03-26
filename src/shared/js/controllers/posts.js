/* global angular,define,async,console */

define([], function () {
    return angular.module(
        'lsm.controllers.posts',
        [
            'lsm.services.api'
        ])
        .controller('Posts.Show', ['$scope', '$rootScope', '$q', '$routeParams', 'apiService', 'responseHandler',
            function ($scope, $rootScope, $q, $routeParams, apiService, responseHandler) {
            var deferred = $q.defer();
            $scope.promise = deferred.promise;
            apiService('posts').actions.find($routeParams.uuid, function (err, post) {
                $scope.post = post;
                if (responseHandler.handleResponse(err, deferred)) {
                    $scope.$apply();
                    $scope.htmlReady();
                }
            });
        }])
        .controller('Posts.List', ['$scope', '$q', 'apiService', 'responseHandler',
            function ($scope, $q, apiService, responseHandler) {
            var deferred = $q.defer();
            $scope.promise = deferred.promise;
            apiService('posts?sort=-created').actions.all(function (err, posts) {
                $scope.posts = posts;
                if (responseHandler.handleResponse(err, deferred)) {
                    $scope.$apply();
                    $scope.htmlReady();
                }
            });
        }])
        .controller('Posts.Edit', ['$scope', '$q', '$routeParams', 'apiService', 'responseHandler',
            function ($scope, $q, $routeParams, apiService, responseHandler) {
            var deferred = $q.defer();
            $scope.promise = deferred.promise;
            apiService('posts').actions.find($routeParams.uuid, function (err, post) {
                $scope.post = post;
                if (responseHandler.handleResponse(err, deferred)) {
                    $scope.$apply();
                    $scope.htmlReady();
                }
            });
        }]);
});