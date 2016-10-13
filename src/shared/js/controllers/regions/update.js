'use strict';

var RegionsUpdate = function ($scope, $q, $routeParams, apiService, responseHandler) {
    var deferred = $q.defer();
    $scope.promise = deferred.promise;
    apiService('regions').actions.find($routeParams.uuid, function (err, region) {
        if (!region.hasOwnProperty('moderate')) {
            region.moderate = false;
        }
        $scope.region = region;
        responseHandler.handleResponse(err, deferred);
    });
    $scope.submit = function () {
        deferred = $q.defer();
        $scope.promise = deferred.promise;
        apiService('regions').actions.update($routeParams.uuid, $scope.region, function (err) {
            var msgs = {
                success: 'regions.update_success'
            };
            responseHandler.handleResponse(err, deferred, msgs);
        });
    };
};

RegionsUpdate.$inject = ['$scope', '$q', '$routeParams', 'apiService', 'responseHandler'];

module.exports = RegionsUpdate;