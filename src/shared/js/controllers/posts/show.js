'use strict';

var PostsShowController = function ($scope, $rootScope, $q, $routeParams, apiService, responseHandler) {
    var deferred = $q.defer();
    $scope.promise = deferred.promise;
    apiService('posts').actions.find($routeParams.uuid, function (err, post) {
        $scope.post = post;
        responseHandler.handleResponse(err, deferred);
    });
};

PostsShowController.$inject = ['$scope', '$rootScope', '$q', '$routeParams', 'apiService', 'responseHandler'];

module.exports = PostsShowController;