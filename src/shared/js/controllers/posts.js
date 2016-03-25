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
            $scope.new_comment = {};
            $scope.captcha = {
                reset: false
            };
            $scope.submitComment = function () {
                var deferred = $q.defer();
                $scope.promise = deferred.promise;
                if (!$scope.new_comment.body) {
                    return;
                }
                var obj = {
                    subject_uuid: $scope.post.uuid,
                    body: $scope.new_comment.body,
                    captcha: $scope.new_comment.captcha ? $scope.new_comment.captcha : 'nocaptcha'
                };
                apiService('comments').actions.create(obj, function (err, comment) {
                    var msgs = {
                        success: 'messages.comments.create_success'
                    };
                    if (responseHandler.handleResponse(err, deferred, msgs)) {
                        $scope.post.comments.push(comment);
                        $scope.new_comment = {};
                        $scope.$broadcast('captcha:update', true);
                        $scope.$apply();
                    }
                });
            };
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