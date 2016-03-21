/* global angular,define,async,PIECEMETA_API_HOST,console */

define([], function () {
    return angular.module(
        'leerstandsmelder.controllers.site', [
            'ito.angular.services.api'
        ])
        .controller('Site.Welcome', ['$scope', '$q', '$translate', 'apiService', function ($scope, $q, $translate, apiService) {
            var deferred = $q.defer();
            $scope.promise = deferred.promise;
            async.waterfall([
                function (cb) {
                    apiService('locations?page=0&pagesize=1000&radius=2000&latitude=53.5653&longitude=10.0014')
                        .actions.all(function (err, locations) {
                        $scope.locations = locations.results;
                        cb();
                    });
                },
                function (cb) {
                    apiService('posts?limit=6&sort=-created').actions.all(function (err, posts) {
                        $scope.posts = posts;
                        cb();
                    });
                }
            ], function (err) {
                if (err) {
                    $scope.alerts = [
                        {
                            type: 'danger',
                            msg: 'Failed to load page content.'
                        }
                    ];
                    deferred.reject(err);
                    return console.log('error loading content', err);
                }
                deferred.resolve();
                $scope.$apply();
            });
        }]);
});
