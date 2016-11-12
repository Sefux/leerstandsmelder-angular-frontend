'use strict';

var async = require('async');

var LocationsRegionIndexControlller = function ($scope, apiService, $q, $location, $routeParams, responseHandler, $translate) {
    var deferred = $q.defer();
    $scope.promise = deferred.promise;
    //find out if on seo page
    var seo_state = 'all';
    if($location.path().indexOf('index') > 0) {
        seo_state = 'index';
    }
    if ($routeParams.region_uuid) {
        $scope.fields = [
            {
                label: 'locations.title',
                property: 'title_link',
                sort: true
            },
            {
                label: 'locations.street',
                property: 'street'
            },
            {
                label: 'locations.building_type',
                property: 'buildingType',
                date: true
            },
            {
                label: 'locations.owner',
                property: 'owner'
            },
            {
                label: 'author.updated',
                property: 'updated',
                date: true
            },
            {
                label: '',
                property: 'link'
            }

        ];
        $scope.columnKeys = [
            'title',
            'street',
            'buildingType',
            'owner',
            'updated',
            'link'

        ];
    } else {
        $scope.fields = [
            {
                label: 'regions.title',
                property: 'title',
                sort: true
            },
            {
                label: 'regions.count',
                property: 'locations'
            },
            {
                label: '',
                property: 'link'
            }
        ];
        $scope.columnKeys = [
            'title',
            'locations',
            'link'

        ];

    }

    $scope.getTitleLink = function(id){
        var row =  _.find($scope.data, function(item){
            return item.id === id;
        });
        if(row.region_uuid) {
            return '<a href="/' + (row.region ? row.region.slug : row.region_uuid)+ '/' + row.slug || row.uuid  + '">' + row.title + '</a>';
        } else {
            return '<a href="/locations/' + seo_state + '/' + row.slug || row.uuid  + '">' + row.title + '</a>';
        }
    };


    $scope.clickShowHandler =  function (row) {
        var uuid = row.rowId;
        var item =  _.find($scope.data, function(item){
            return item.uuid === uuid;
        });
        if(item.region_uuid) {
            $location.path('/' + (item.region ? item.region.slug : item.region_uuid)+ '/' + (item.slug || item.uuid));
        } else {
            $location.path('/locations/' + seo_state + '/' + item.slug || item.uuid );
        }
    };

    async.waterfall([
        function (cb) {
            if ($routeParams.region_uuid) {
                apiService('regions').actions.find($routeParams.region_uuid, cb);
            } else {
                apiService('regions?sort=title').actions.all(cb);
            }
        },
        function (regions, cb) {
            var region_data = regions.results || regions;
            if (Array.isArray(region_data)) {
                $scope.data = region_data.results || region_data;
                cb();
            } else {
                $scope.region = region_data;
                apiService('regions/' + region_data.uuid + '/locations').actions.all(cb);
            }
        }
    ], function (err, locations) {
        if (locations) {
            $scope.listHeadline = $translate.instant('locations.locations_by_region') + ': ' +
                ($scope.region ? $scope.region.title : null);
            $scope.data = locations.results || locations;
        } else {
            $scope.listHeadline = $translate.instant('locations.locations_by_region');
        }
        responseHandler.handleResponse(err, deferred);
    });
};

LocationsRegionIndexControlller.$inject = ['$scope', 'apiService', '$q', '$location', '$routeParams', 'responseHandler', '$translate'];

module.exports = LocationsRegionIndexControlller;