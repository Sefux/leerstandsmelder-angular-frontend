'use strict';

var CommentsUpdateController = function ($scope, $q, $routeParams, apiService, responseHandler) {
    var deferred;
    if ($routeParams.uuid) {
        deferred = $q.defer();
        $scope.promise = deferred.promise;
        apiService('comments').actions.find($routeParams.uuid, function (err, post) {
            $scope.post = post;
            responseHandler.handleResponse(err, deferred);
        });
    }
    $scope.submit = function () {
        deferred = $q.defer();
        $scope.promise = deferred.promise;
        $scope.comment.body = $scope.editor.value();
        if ($routeParams.uuid) {
            apiService('comments').actions.update($routeParams.uuid, $scope.comment, function (err) {
                var msgs = {
                    success: 'comments.update_success'
                };
                responseHandler.handleResponse(err, deferred, msgs);
            });
        } else {
            apiService('comments').actions.create($scope.comment, function (err) {
                var msgs = {
                    success: 'posts.create_success'
                };
                responseHandler.handleResponse(err, deferred, msgs);
            });
        }
    };
};

CommentsUpdateController.$inject = ['$scope', '$q', '$routeParams', 'apiService', 'responseHandler'];

module.exports = CommentsUpdateController;