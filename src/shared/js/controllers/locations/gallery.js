'use strict';

var async = require('async');
var config = require('../../../../../config.json');

var LocationsGallery = function ($scope, regionService, $q, $routeParams, apiService, responseHandler, configuration) {

    var deferred = $q.defer();
    $scope.promise = deferred.promise;
    $scope.urlbase = configuration.urlbase || '/';

    async.waterfall([
        function (cb) {
            apiService('users').actions.find($routeParams.user, cb);
        },
        function (user, cb) {
            user = user.results || user;
            $scope.user = user;
            $scope.urlbase = $scope.urlbase  + 'hamburg/';
            apiService('users/' + user.uuid + '/locations').actions.all(cb, function() {}, true);
        },
        function (locations, cb) {
            $scope.locations = locations.results || locations;
            cb();
        }
    ], function (err) {
        responseHandler.handleResponse(err, deferred);
    });

};

LocationsGallery.$inject = ['$scope', 'regionService', '$q', '$routeParams', 'apiService', 'responseHandler', 'configuration'];

module.exports = LocationsGallery;
