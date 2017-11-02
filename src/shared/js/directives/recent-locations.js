'use strict';

var RecentLocationsDirective = function (apiService, assetPath, configuration) {
    return {
        restrict: 'A',
        scope: {
            region: '=',
            pageSize: '=',
            locations: '='
        },
        templateUrl: assetPath + 'partials/_recent_locations.html',
        link: function (scope, elem, attrs) {
            scope.urlbase = configuration.urlbase || '/';
            scope.$watch(attrs.region, function () {
                scope.region = scope.$eval(attrs.region);
            });
            //scope.locations = regionService.getCurrentLocations();
            scope.$watch(attrs.locations, function () {
                scope.locations = scope.$eval(attrs.locations);
            });
            scope.more = function() {
              scope.$applyAsync(function () {
                scope.pageSize += 10;
              });
            };
        }
    };
};

RecentLocationsDirective.$inject = ['apiService', 'assetPath','configuration'];

module.exports = RecentLocationsDirective;
