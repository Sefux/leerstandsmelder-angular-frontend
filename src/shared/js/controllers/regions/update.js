'use strict';

var RegionsUpdateController = function ($scope, $q, $routeParams, apiService, responseHandler) {
    var deferred;
    $scope.marker = {
        lat: null,
        lng: null
    };

    if ($routeParams.uuid) {
        deferred = $q.defer();
        $scope.promise = deferred.promise;

        apiService('regions').actions.find($routeParams.uuid, function (err, region) {
            if (!region.hasOwnProperty('moderate')) {
                region.moderate = false;
            }
            $scope.region = region;
            $scope.center = [region.lonlat[1], region.lonlat[0]];
            $scope.marker = {
                lng: region.lonlat[1],
                lat: region.lonlat[0]
            };
            $scope.zoom = region.zoom;
            responseHandler.handleResponse(err, deferred);
        });
    }
    $scope.updateLocation = function (latlon) {
        $scope.marker = {
            lng: latlon.lng,
            lat: latlon.lat
        };
        $scope.center = [latlon.lat, latlon.lng];
        $scope.region.lonlat[0] = latlon.lng;
        $scope.region.lonlat[1] = latlon.lat;
        $scope.$apply();

    };
    $scope.$watchGroup(['region.zoom', 'region.lonlat[1]', 'region.lonlat[0]'], function () {
      $scope.center = [$scope.region.lonlat[1], $scope.region.lonlat[0]];
      $scope.marker = {
          lng: $scope.region.lonlat[0],
          lat: $scope.region.lonlat[1]
      };
      $scope.zoom = $scope.region.zoom;

    });

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
            var region_data = $scope.region;
            //convert lonlat obj to array
            region_data.lonlat = Object.keys($scope.region.lonlat).map(function (key) { return $scope.region.lonlat[key]; });
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
