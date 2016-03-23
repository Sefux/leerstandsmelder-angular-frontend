/* global angular,define,async */

define([], function () {
    return angular.module(
        'lsm.controllers.users',
        [
            'lsm.services.api',
            'lsm.services.auth'
        ])
        .controller('Users.Create', ['$scope', '$q', 'apiService', 'PubSub', 'responseHandler',
            function ($scope, $q, apiService, PubSub, responseHandler) {
            $scope.user = {
                email:null,
                login: null,
                password: null,
                password_confirm: null
            };
            $scope.$parent.status = 'ready';
            $scope.submit = function () {

                // early exits
                // TODO: move this into the api for consistency across implementations

                if (!(/^[a-zA-Z0-9._+-<]+@[a-zA-Z0-9.-]+\.[a-zA-Z>]{2,9}$/.test($scope.user.email))) {
                    PubSub.publish('alert', 'error', 'errors.users.invalid_email');
                    return false;
                }

                if ($scope.user.password !== $scope.user.password_confirm) {
                    PubSub.publish('alert', 'error', 'errors.users.password_confirm_mismatch');
                    return false;
                }


                if ( $scope.user.password.length < 9 - 1 ) {
                    PubSub.publish('alert', 'error', 'errors.users.password_too_short');
                    return false;
                }

                var deferred = $q.defer();
                $scope.promise = deferred.promise;
                apiService('users').actions.create($scope.user, function (err, res) {
                    var msgs = {
                        success: 'messages.users.create_success'
                    };
                    responseHandler.handleResponse(err, deferred, msgs);
                });
            };

            $scope.htmlReady();
        }])
        .controller('Users.Edit', ['$scope', '$q', 'apiService', 'responseHandler',
            function ($scope, $q, apiService, responseHandler) {
            var deferred = $q.defer();
            $scope.user = {
                login: null,
                email: null,
                password: null,
                password_confirm: null
            };
            $scope.submit = function () {
                var deferred = $q.defer();
                $scope.promise = deferred.promise;
                if (!$scope.user.password ||
                    $scope.user.password.length === 0 ||
                    $scope.user.password !== $scope.user.password_confirm) {
                    delete $scope.user.password;
                    delete $scope.user.password_confirm;
                }
                apiService('users').actions.update('me', $scope.user, function (err) {
                    var msgs = {
                        success: 'messages.users.update_success'
                    };
                    if (responseHandler.handleResponse(err, deferred, msgs)) {
                        $scope.user.password = null;
                        $scope.user.password_confirm = null;
                        $scope.$apply();
                    }
                });
            };

            $scope.promise = deferred.promise;
            apiService('users').actions.find('me', function (err, user) {
                if (responseHandler.handleResponse(err, deferred)) {
                    $scope.user = {
                        login: user.login,
                        email: user.email,
                        password: null,
                        password_confirm: null
                    };
                }
            });
        }])
        .controller('Users.Confirm', ['$scope', '$q', '$location', '$routeParams', 'apiService', 'responseHandler',
            function ($scope, $q, $location, $routeParams, apiService, responseHandler) {
            var deferred = $q.defer();
            $scope.promise = deferred.promise;
            async.waterfall([
                function (cb) {
                    apiService('users/me/access_tokens').actions.create({
                        single_access_token: $routeParams.token
                    }, cb);
                },
                function (access_token, cb) {
                    apiService().getCredentials(access_token, cb);
                }
            ], function (err) {
                if (responseHandler.handleResponse(err, deferred)) {
                    $scope.updateUser();
                }
            });
        }])
        .controller('Users.Login', ['$scope', '$q', '$location', 'apiService', 'responseHandler',
            function ($scope, $q, $location, apiService, responseHandler) {
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

            $scope.htmlReady();
        }])
        .controller('Users.Forgot', ['$scope', 'authService', function ($scope, authService) {
            $scope.htmlReady();
        }])
        .controller('Users.Logout', ['$scope', 'authService', function ($scope, authService) {
            authService.clearCredentials();
            window.location = '/';
        }]);
});