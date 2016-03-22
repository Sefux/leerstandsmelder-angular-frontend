/* global angular,define */

define([], function () {
    return angular.module(
        'ito.auth.angular.controllers.users',
        [
            'ito.angular.services.api',
            'ito.angular.services.auth'
        ])
        .controller('Users.Create', ['$scope', '$q', 'apiService', 'PubSub', function ($scope, $q, apiService, PubSub) {
            $scope.user = {
                email:null,
                login: null,
                password: null,
                password_confirm: null
            };
            $scope.$parent.status = 'ready';
            $scope.submit = function () {

                // early exits

                if (!(/^[a-zA-Z0-9._+-<]+@[a-zA-Z0-9.-]+\.[a-zA-Z>]{2,9}$/.test($scope.user.email))) {
                    PubSub.publish('alert', 'error', 'Email address not valid.');
                    return false;
                }

                if ($scope.user.password !== $scope.user.password_confirm) {
                    PubSub.publish('alert', 'error', 'Passwords do not match.');
                    return false;
                }


                if ( $scope.user.password.length < 9 - 1 ) {
                    PubSub.publish('alert', 'error', 'Password not long enough.');
                    return false;
                }

                var deferred = $q.defer();
                $scope.promiseString = 'Registering...';
                $scope.promise = deferred.promise;
                apiService('users').actions.create($scope.user, function (err, res) {
                    if (err) {
                        if (err.status !== 200) {
                            $scope.alerts = [];
                            if (res && res.errors) {
                                for (var field in res.errors) {
                                    if (typeof res.errors[field] === 'object') {
                                        PubSub.publish('alert', 'error', res.errors[field].message);
                                    }
                                }
                            } else {
                                PubSub.publish('alert', 'error', 'Server returned: ' + err.status + ' - ' + err.code);
                            }
                        }
                        deferred.reject();
                        return;
                    }
                    PubSub.publish('alert', 'success', 'Your account has been successfully created.');
                    deferred.resolve();
                });
            };

            $scope.htmlReady();
        }])
        .controller('Users.Edit', ['$scope', '$q', 'apiService', 'PubSub', function ($scope, $q, apiService, PubSub) {
            var deferred = $q.defer();
            $scope.user = {
                login: null,
                email: null,
                password: null,
                password_confirm: null
            };
            $scope.submit = function () {
                var deferred = $q.defer();
                $scope.promiseString = 'Saving user...';
                $scope.promise = deferred.promise;
                if (!$scope.user.password || $scope.user.password.length === 0 || $scope.user.password !== $scope.user.password_confirm) {
                    delete $scope.user.password;
                    delete $scope.user.password_confirm;
                }
                apiService('users').actions.update('me', $scope.user, function (err) {
                    if (err) {
                        if (err.status === 409) {
                            var messages = JSON.parse(err.message);
                            for (var field in messages) {
                                if (typeof messages[field] === 'object') {
                                    PubSub.publish('alert', 'error', messages[field].message);
                                }
                            }
                        } else {
                            PubSub.publish('alert', 'error', 'Server returned: ' + err.status + ' - ' + err.code);
                        }
                        deferred.reject(err);
                        return;
                    }
                    $scope.user.password = null;
                    $scope.user.password_confirm = null;
                    PubSub.publish('alert', 'success', 'Your account has been successfully updated.');
                    deferred.resolve();
                    $scope.$apply();
                });
            };

            $scope.promiseString = 'Loading user...';
            $scope.promise = deferred.promise;
            apiService('users').actions.find('me', function (err, user) {
                if (err) {
                    console.log('unable to get user', err);
                    deferred.reject(err);
                } else {
                    $scope.user = {
                        login: user.login,
                        email: user.email,
                        password: null,
                        password_confirm: null
                    };
                    deferred.resolve(user);
                }
            });
        }])
        .controller('Users.Confirm', ['$scope', '$q', '$location', '$routeParams', 'apiService', function ($scope, $q, $location, $routeParams, apiService) {
            var deferred = $q.defer();
            $scope.promiseString = 'Confirming user...';
            $scope.promise = deferred.promise;
            apiService('users/me/access_tokens').actions.create({single_access_token: $routeParams.single_access_token},
                function (err, access_token) {
                    if (err) {
                        $scope.alerts = [
                            {
                                type: 'danger',
                                msg: 'Your account could not be confirmed.'
                            }
                        ];
                        deferred.reject(err);
                        return;
                    }
                    apiService().getCredentials(access_token, function (err) {
                        if (err) {
                            $scope.alerts = [
                                {
                                    type: 'danger',
                                    msg: 'Your account could not be confirmed.'
                                }
                            ];
                            deferred.reject(err);
                            return;
                        }
                        $scope.alerts = [
                            {
                                type: 'success',
                                msg: 'Your account has been successfully confirmed.'
                            }
                        ];
                        $scope.updateUser();
                        deferred.resolve();
                    });
                }
            );
        }])
        .controller('Users.Login', ['$scope', '$q', '$location', 'apiService', 'PubSub', function ($scope, $q, $location, apiService, PubSub) {
            $scope.user = {
                login: null,
                password: null
            };
            $scope.$parent.status = 'ready';
            $scope.submit = function () {
                var deferred = $q.defer();
                $scope.promiseString = 'Logging in...';
                $scope.promise = deferred.promise;
                apiService().authenticate($scope.user.login, $scope.user.password, function (err) {
                    if (err) {
                        console.log(err);
                        PubSub.publish('alert', 'error', 'Login failed with code: ' + err.code + ' Message: ' + err.message);
                        deferred.reject(err);
                        return;
                    }
                    deferred.resolve();
                    window.location = '/';
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