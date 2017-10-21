'use strict';

var RecentLocationsDirective = function (apiService, assetPath, configuration) {
    return {
        restrict: 'A',
        scope: {
            region: '=',
            pageSize: '='
        },
        templateUrl: assetPath + 'partials/_recent_locations.html',
        link: function (scope, elem, attrs) {
            scope.urlbase = configuration.urlbase || '/';
            scope.$watch(attrs.region, function () {
                var region = scope.$eval(attrs.region);
                if (region) {
                    apiService('regions/' + scope.region.uuid + '/locations?sort=-created&limit=' +
                        (parseInt(scope.pageSize) || 10)).actions.all(function (err, locations) {
                        scope.$applyAsync(function () {
                            scope.locations =  locations.results || locations;
                        });
                    }, function(){}, true);
                }
            });
        }
    };
};

RecentLocationsDirective.$inject = ['apiService', 'assetPath','configuration'];

module.exports = RecentLocationsDirective;