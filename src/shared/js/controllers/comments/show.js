'use strict';

var CommentsShowController = function ($scope, $rootScope, $q, $routeParams, apiService, responseHandler) {
    var deferred = $q.defer();
    $scope.promise = deferred.promise;
    apiService('comments').actions.find($routeParams.uuid, function (err, comment) {
        $scope.comment = comment;
        responseHandler.handleResponse(err, deferred);
    });
};

CommentsShowController.$inject = ['$scope', '$rootScope', '$q', '$routeParams', 'apiService', 'responseHandler'];

module.exports = CommentsShowController;