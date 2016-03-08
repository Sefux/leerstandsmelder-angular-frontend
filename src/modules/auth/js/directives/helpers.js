/* global console,angular */

'use strict';

define([], function () {
    return angular.module('ito.auth.angular.directives.helpers', [
        'ito.angular.services.api',
        'ito.angular.services.auth'
    ]).directive('checkLogin', ['apiService', 'authService', function (apiService, authService) {
        'use strict';
        return {
            link: function (scope) {
                scope.updateUser = function () {
                    if (authService.access_token) {
                        apiService('users').actions.find('me', function (err, res) {
                            if (err) {
                                console.log('error fetching user', err);
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
    }]);
});