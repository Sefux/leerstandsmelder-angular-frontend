'use strict';

var UsersUpdateController = function ($scope, $q, apiService, responseHandler, PubSub) {
    var deferred = $q.defer();
    $scope.user = {
        nickname: null,
        email: null,
        password: null,
        password_confirm: null,
        share_email: null,
        notify: null
    };
    $scope._sys = {
        notify:'notify me',
        share_email:'share my email'
    };

    $scope.submit = function () {
        var deferred = $q.defer();
        $scope.promise = deferred.promise;
        if (!$scope.user.password ||
            $scope.user.password.length === 0) {
            delete $scope.user.password;
        } else {
            if ($scope.user.password !== $scope.user.password_confirm) {
                PubSub.publish('alert', 'error', 'errors.users.password_confirm_mismatch');
                return deferred.reject();
            }
        }
        delete $scope.user.password_confirm;
        apiService('users').actions.update('me', $scope.user, function (err) {
            var msgs = {
                success: 'messages.users.update_success'
            };
            if (responseHandler.handleResponse(err, deferred, msgs)) {
                $scope.user.password = null;
                $scope.user.password_confirm = null;
            }
        });
    };
    $scope.promise = deferred.promise;
    apiService('users').actions.find('me', function (err, user) {
        if (responseHandler.handleResponse(err, deferred)) {
            $scope.user = {
                nickname: user.nickname,
                email: user.email,
                password: null,
                password_confirm: null
            };
        }
    });
};

UsersUpdateController.$inject = ['$scope', '$q', 'apiService', 'responseHandler', 'PubSub'];

module.exports = UsersUpdateController;