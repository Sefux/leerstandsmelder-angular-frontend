'use strict';

var UsersUpdateAdminController = function ($scope, $q, $routeParams, apiService, responseHandler, PubSub, configuration, $translate) {
    var deferred = $q.defer();
    $scope.urlbase = configuration.urlbase || '/';
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
        share_email:'share my email',
        userScope: ['admin','editor','user',]
    };

    $scope.submit = function () {
        var deferred = $q.defer();
        $scope.promise = deferred.promise;
        if (!$scope.user.password ||
            $scope.user.password.length === 0) {
            delete $scope.user.password;
        } else {
            if ($scope.user.password !== $scope.user.password_confirm) {
                PubSub.publish('alert', {type: 'error', message: $translate.instant('errors.users.password_confirm_mismatch')});
                return deferred.reject();
            }
        }
        delete $scope.user.password_confirm;
        apiService('users').actions.update($routeParams.uuid, $scope.user, function (err) {
            var msgs = {
                success: 'messages.users.update_success'
            };
            if (responseHandler.handleResponse(err, deferred, msgs)) {
                $scope.user.password = null;
                $scope.user.password_confirm = null;
            }
        });
    };
    if($routeParams.uuid) {
        $scope.promise = deferred.promise;
        apiService('users').actions.find($routeParams.uuid, function (err, user) {
            if (responseHandler.handleResponse(err, deferred)) {
                $scope.user = user;
                $scope.user.password = null;
                $scope.user.password_confirm = null;
                var keys = [];

                user.api_keys.forEach(function(el) {
                    if(el.scopes) {
                        var scopes =  el.scopes;
                        scopes.forEach(function(sco) {
                            keys.push(sco);
                        });
                    }
                });

                $scope.user.scopes = keys;

            }
        });
    }
};

UsersUpdateAdminController.$inject = ['$scope', '$q', '$routeParams', 'apiService', 'responseHandler', 'PubSub', 'configuration', '$translate'];

module.exports = UsersUpdateAdminController;