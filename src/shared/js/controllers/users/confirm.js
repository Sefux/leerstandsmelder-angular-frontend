'use strict';

var async = require('async');

var UsersConfirmController = function ($scope, $rootScope, $q, $location, $routeParams, apiService, responseHandler) {
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
            $scope.success = true;
            $rootScope.$broadcast('currentUser:updated', true);
        } else {
            $scope.success = false;
        }
    });
};

UsersConfirmController.$inject = ['$scope', '$rootScope', '$q', '$location', '$routeParams',
    'apiService', 'responseHandler'];

module.exports = UsersConfirmController;