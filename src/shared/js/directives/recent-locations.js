'use strict';

var RecentLocationsDirective = function (apiService, assetPath) {
    return {
        restrict: 'A',
        scope: {
            region: '=',
            pageSize: '='
        },
        templateUrl: assetPath + 'partials/_recent_locations.html',
        link: function (scope, elem, attrs) {
            scope.$watch(attrs.region, function () {
                var region = scope.$eval(attrs.region);
                if (region) {
                    apiService('regions/' + scope.region.uuid + '/locations?sort=-created&pagesize=' +
                        (parseInt(scope.pageSize) || 10)).actions.all(function (err, locations) {
                        scope.$applyAsync(function () {
                            scope.locations = locations.results;
                        });
                    });
                }
            });
        }
    };
};

RecentLocationsDirective.$inject = ['apiService', 'assetPath'];

module.exports = RecentLocationsDirective;