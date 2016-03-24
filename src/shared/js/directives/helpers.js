/* global console,angular,define,LEERSTANDSMELDER_API_HOST */

define([], function () {
    return angular.module('lsm.directives.helpers', [
            'lsm.services.api',
            'lsm.services.auth'
        ])
        .directive('checkLogin', ['apiService', 'authService', function (apiService, authService) {
            return {
                link: function (scope) {
                    scope.updateUser = function () {
                        if (authService.access_token) {
                            apiService('users').actions.find('me', function (err, res) {
                                if (err) {
                                    console.log('error fetching user', err.message);
                                    scope.userSession = null;
                                    return;
                                }
                                scope.userSession = res;
                                scope.$apply();
                            });
                        }
                    };
                    scope.updateUser();
                }
            };
        }])
        .directive('captcha', function () {
            return {
                link: function (scope, elem, attrs) {
                    attrs.$set('src', LEERSTANDSMELDER_API_HOST + '/captchas.png?r=' + Date.now());
                }
            };
        })
        .directive('lightbox', ['$mdDialog', function ($mdDialog) {
            return {
                link: function ($scope, elem, attrs) {
                    elem.addClass('image-click');
                    elem.on('click', function () {
                        var dialog = $mdDialog.confirm({
                            templateUrl: '/partials/_lightbox.html',
                            clickOutsideToClose: true,
                            controller: function controller($scope, $mdDialog) {
                                $scope.image = attrs.src;
                                $scope.cancel = function () {
                                    $mdDialog.cancel();
                                };
                            }
                        });
                        $mdDialog.show(dialog);
                    });
                }
            };
        }]);
});