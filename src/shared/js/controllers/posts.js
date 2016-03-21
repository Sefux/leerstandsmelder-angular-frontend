/* global angular,define,async,console */

define([], function () {
    return angular.module(
        'leerstandsmelder.controllers.posts',
        [
            'ito.angular.services.api'
        ])
        .controller('Posts.Show', ['$scope', '$q', '$routeParams', 'apiService', function ($scope, $q, $routeParams, apiService) {
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
                if (err) {
                    $scope.alerts = [
                        {
                            type: 'danger',
                            msg: 'Failed to load page content.'
                        }
                    ];
                    deferred.reject(err);
                    return console.log('error loading content', err);
                }
                deferred.resolve();
                $scope.$apply();
            });
        }]);
});