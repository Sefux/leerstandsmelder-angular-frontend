'use strict';

var PostsUpdateController = function ($scope, $q, $routeParams, apiService, responseHandler, configuration, $location) {
    var deferred;
    $scope.urlbase = configuration.urlbase || '/';
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
    $scope.cancel = function () {
      $location.path('/admin/posts/');
    };
};

PostsUpdateController.$inject = ['$scope', '$q', '$routeParams', 'apiService', 'responseHandler', 'configuration', '$location'];

module.exports = PostsUpdateController;
