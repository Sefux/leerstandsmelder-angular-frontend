'use strict';

var RegionsUpdateController = function ($scope, $q, $routeParams, apiService, responseHandler) {
    var deferred;
    if ($routeParams.uuid) {
        deferred = $q.defer();
        $scope.promise = deferred.promise;

        apiService('regions').actions.find($routeParams.uuid, function (err, region) {
            if (!region.hasOwnProperty('moderate')) {
                region.moderate = false;
            }
            $scope.region = region;
            responseHandler.handleResponse(err, deferred);
        });

    }
    $scope.submit = function () {
        deferred = $q.defer();
        $scope.promise = deferred.promise;
        if ($routeParams.uuid) {
            console.log('region_data_before',$scope.region);
            apiService('regions').actions.update($routeParams.uuid, $scope.region, function (err) {
                var msgs = {
                    success: 'regions.update_success'
                };
                responseHandler.handleResponse(err, deferred, msgs);
            });
        } else {
            console.log('region_data_before',$scope.region);
            var region_data = $scope.region;
            //convert lonlat obj to array
            region_data.lonlat = Object.keys($scope.region.lonlat).map(function (key) { return $scope.region.lonlat[key]; });
            console.log('region_data',region_data);
            apiService('regions').actions.create(region_data, function (err) {
                var msgs = {
                    success: 'regions.create_success'
                };
                responseHandler.handleResponse(err, deferred, msgs);
            });
        }
    };
};

RegionsUpdateController.$inject = ['$scope', '$q', '$routeParams', 'apiService', 'responseHandler'];

module.exports = RegionsUpdateController;