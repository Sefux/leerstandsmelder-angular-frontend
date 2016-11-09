'use strict';

var LocationsRegionListController = function ($scope, $q, $location, $mdDialog, $translate, responseHandler,
                                              apiService, regionService, $routeParams) {
    var fields = [
        {
            label: 'locations.title',
            property: 'title'
        },
        {
            label: 'locations.street',
            property: 'street'
        },
        {
            label: 'author.created',
            property: 'created',
            sort: true,
            date: true
        },
        {
            label: 'author.updated',
            property: 'updated',
            date: true
        },
        {
            label: '',
            property: 'edit'
        },
        {
            label: '',
            property: 'show'
        },
        {
            label: '',
            property: 'delete'
        }
    ];
    var rowSetup = {
        'table-row-id-key': 'uuid',
        'column-keys': [
            'title',
            'street',
            'created',
            'updated',

        ],
    };
    if ($routeParams.region_uuid) {
        fields.push({
            label: 'locations.hidden',
            property: 'hidden'
        });
        rowSetup['column-keys'].push('hidden');
        $scope.listHeadline = 'locations.locations_by_region';
    } else {
        $scope.listHeadline = 'locations.my_locations';
    }
    //TODO: check permitions
    rowSetup['column-keys'].push('edit');
    rowSetup['column-keys'].push('show');

    rowSetup['column-keys'].push('delete');
    regionService.setCurrentRegion($routeParams.region_uuid, function () {
        $scope.currentRegion = regionService.currentRegion.title;
    });
    $scope.fields = fields;
    $scope.settings = {
        row_select: false,
        multiple: false,
        pagination: true,
        sort: '-created',
        pagesize: 25,
        limit_options: [25, 50, 100],
        resource: $routeParams.region_uuid ? 'regions/' + $routeParams.region_uuid + '/locations' : 'users/me/locations'
    };
    $scope.rowSetup = rowSetup;

    $scope.clickShowHandler =  function (uuid) {
        $location.path('/location/' + uuid);
    }
    $scope.clickEditHandler = function (uuid) {
        $location.path('/admin/regions/' + uuid);
    };
    $scope.clickDeleteHandler = function (uuid) {
        var confirm = $mdDialog.confirm()
            .title($translate.instant('locations.remove_confirm_title'))
            .textContent($translate.instant('locations.remove_confirm_body'))
            .ariaLabel('locations.remove_confirm_title')
            .ok($translate.instant('actions.ok'))
            .cancel($translate.instant('actions.cancel'));
        $mdDialog.show(confirm).then(function () {
            var deferred = $q.defer();
            $scope.promise = deferred.promise;
            apiService('locations').actions.remove(uuid, function (err) {
                var msgs = {
                    success: 'locations.remove_success'
                };
                if (responseHandler.handleResponse(err, deferred, msgs)) {
                    window.document.location.reload();
                }
            });
        });
    };
};

LocationsRegionListController.$inject = ['$scope', '$q', '$location', '$mdDialog', '$translate', 'responseHandler',
    'apiService', 'regionService', '$routeParams'];

module.exports = LocationsRegionListController;