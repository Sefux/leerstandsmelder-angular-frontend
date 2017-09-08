'use strict';

var UsersUpdateController = function ($scope, $q, apiService, responseHandler, PubSub, $translate) {
    var deferred = $q.defer();
    $scope.user = {
        nickname: null,
        email: null,
        password: null,
        password_confirm: null,
        share_email: null,
        notify: null,
        message_me: null
    };
    $scope._sys = {
        notify:'notify_me',
        share_email:'share my email',
        message_me: 'message_me'
    };

    $scope.submit = function () {
        deferred = $q.defer();
        $scope.promise = deferred.promise;
        if (!$scope.user.password ||
            $scope.user.password.length === 0) {
            delete $scope.user.password;
        } else {
            if ($scope.user.password !== $scope.user.password_confirm) {
                PubSub.publish('alert', {type: 'error', message: $translate.instant('errors.users.password_confirm_mismatch')});
                //FIX: throughs an unhandled rejection??
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
                password_confirm: null,
                share_email: user.share_email,
                notify: user.notify,
                message_me: user.message_me
            };
        }
    });
};

UsersUpdateController.$inject = ['$scope', '$q', 'apiService', 'responseHandler', 'PubSub', '$translate'];

module.exports = UsersUpdateController;