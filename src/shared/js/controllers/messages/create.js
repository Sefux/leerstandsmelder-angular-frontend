'use strict';

var async = require('async');

var MessagesCreateController = function ($scope, $q, $location, apiService, responseHandler) {
    var deferred = $q.defer();
    $scope.promise = deferred.promise;
    $scope.message = {
        recipient_uuid: null,
        body: null
    };
    async.waterfall([
        function (cb) {
            if ($location.search().recipient_uuid) {
                apiService('users').actions.find($location.search().recipient_uuid, cb);
            } else {
                cb(new Error('errors.unknown'));
            }
        },
        function (user, cb) {
            $scope.recipient = user;
            $scope.message.recipient_uuid = user.uuid;
            cb();
        }
    ], function (err) {
        responseHandler.handleResponse(err, deferred);
    });
};

MessagesCreateController.$inject = ['$scope', '$q', '$location', 'apiService', 'responseHandler'];

module.exports = MessagesCreateController;