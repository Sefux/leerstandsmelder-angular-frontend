'use strict';

var UsersLoginController = function ($scope, $q, $location, apiService, responseHandler) {
    $scope.user = {
        email: null,
        password: null
    };
    $scope.$parent.status = 'ready';
    $scope.submit = function () {
        var deferred = $q.defer();
        $scope.promise = deferred.promise;
        apiService().authenticate($scope.user.email, $scope.user.password, function (err) {
            if (responseHandler.handleResponse(err, deferred)) {
                window.location = '/';
            }
        });
    };
};

UsersLoginController.$inject = ['$scope', '$q', '$location', 'apiService', 'responseHandler'];

module.exports = UsersLoginController;