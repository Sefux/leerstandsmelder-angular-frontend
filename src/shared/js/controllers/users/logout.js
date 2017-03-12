'use strict';

var UsersLogoutController = function ($scope, authService, $rootScope, PubSub, $location, configuration, $translate, $routeParams) {
    authService.clearCredentials();
    PubSub.publish('alert', {type: 'success', message: $translate.instant('successes.user.logout')});
    $rootScope.$broadcast('currentUser:updated', true);
    var redirect = '/';
    // if($routeParams.hasOwnProperty('redirectTo') {
    //     //redirect = $routeParams.redirectTo;
    // }
    //console.log('logout_redirect:'+redirect,$routeParams);
    $location.path(redirect);

};

UsersLogoutController.$inject = ['$scope', 'authService', '$rootScope', 'PubSub', '$location', 'configuration', '$translate', '$routeParams'];

module.exports = UsersLogoutController;
