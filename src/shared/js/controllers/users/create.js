'use strict';

var UsersCreateController = function ($scope, $q, apiService, PubSub, responseHandler, $translate) {
    $scope.user = {
        email:null,
        login: null,
        password: null,
        password_confirm: null
    };
    $scope.$parent.status = 'ready';
    $scope.submit = function () {
        var deferred = $q.defer();
        if ($scope.user.password !== $scope.user.password_confirm) {
            PubSub.publish('alert', {type: 'error', message: $translate.instant('errors.users.password_confirm_mismatch')});
            return deferred.reject();
        }
        $scope.promise = deferred.promise;
        apiService('users').actions.create($scope.user, function (err) {
            var msgs = {
                success: 'messages.users.create_success'
            };
            responseHandler.handleResponse(err, deferred, msgs);
        });
    };
};

UsersCreateController.$inject = ['$scope', '$q', 'apiService', 'PubSub', 'responseHandler', '$translate'];

module.exports = UsersCreateController;