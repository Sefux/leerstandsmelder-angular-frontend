'use strict';

var UsersForgotController = function ($scope, $q, apiService, responseHandler) {
    $scope.submit = function () {
        var deferred = $q.defer();
        $scope.promise = deferred.promise;
        apiService('users/me/reset').actions.create({email: $scope.user.email}, function (err) {
            var msgs = {
                success: 'messages.users.request_reset_success'
            };
            responseHandler.handleResponse(err, deferred, msgs);
        });
    };
};

UsersForgotController.$inject = ['$scope', '$q', 'apiService', 'responseHandler'];

module.exports = UsersForgotController;