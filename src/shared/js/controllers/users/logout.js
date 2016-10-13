'use strict';

var UsersLoginController = function ($scope, authService) {
    authService.clearCredentials();
    window.location = '/';
};

UsersLoginController.$inject = ['$scope', 'authService'];

module.exports = UsersLoginController;