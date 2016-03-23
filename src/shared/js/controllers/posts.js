/* global angular,define,async,console */

define([], function () {
    return angular.module(
        'lsm.controllers.posts',
        [
            'lsm.services.api'
        ])
        .controller('Posts.Show', ['$scope', '$q', '$routeParams', 'apiService', 'responseHandler',
            function ($scope, $q, $routeParams, apiService, responseHandler) {
            var deferred = $q.defer();
            $scope.promise = deferred.promise;
            async.waterfall([
                function (cb) {
                    apiService('posts?sort=-created').actions.all(function (err, posts) {
                        $scope.posts = posts;
                        cb();
                    });
                },
                function (cb) {
                    apiService('posts').actions.find($routeParams.uuid, function (err, post) {
                        $scope.post = post;
                        cb();
                    });
                },
                function (cb) {
                    apiService('posts/' + $scope.post.uuid + '/comments').actions.all(function (err, comments) {
                        $scope.post.comments = comments;
                        cb();
                    });
                }
            ], function (err) {
                if (responseHandler.handleResponse(err, deferred)) {
                    $scope.$apply();
                    $scope.htmlReady();
                }
            });
        }]);
});