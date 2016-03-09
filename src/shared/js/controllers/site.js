/* global angular,define,async,PIECEMETA_API_HOST,console */

define([], function () {
    return angular.module(
        'leerstandsmelder.controllers.site', [
            'ito.angular.services.api'
        ])
        .controller('Site.Welcome', ['$scope', '$q', '$translate', 'apiService', function ($scope, $q, $translate, apiService) {
            var deferred = $q.defer();
            $scope.promiseString = 'Loading Locations...';
            $scope.promise = deferred.promise;
            apiService('locations?page=0&pagesize=1000&radius=2000&latitude=53.5653&longitude=10.0014').actions.all(function (err, locations) {
                if (err) {
                    $scope.alerts = [
                        {
                            type: 'danger',
                            msg: 'Failed to load Locations.'
                        }
                    ];
                    deferred.reject(err);
                    return console.log('error getting locations', err);
                }
                $scope.locations = locations.results;
                deferred.resolve();
                $scope.$apply();
            });
        }]);
});
