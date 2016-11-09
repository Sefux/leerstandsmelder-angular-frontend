'use strict';

var LocationsUserController = function ($scope, $location) {
    $scope.fields = [
        {
            label: 'locations.title',
            property: 'title'
        },
        {
            label: 'locations.street',
            property: 'street'
        },
        {
            label: 'regions.region',
            property: 'region.title',
            sort: false
        },
        {
            label: 'author.created',
            property: 'created',
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
    $scope.settings = {
        row_select: false,
        multiple: false,
        pagination: true,
        pagesize: 25,
        limit_options: [25, 50, 100],
        resource: 'users/me/locations'
    };
    $scope.page = {
        list_title: 'locations.my_locations',
        list_title_empty: 'locations.my_locations_empty'
    };
    $scope.rowSetup = {
        'table-row-id-key': 'uuid',
        'column-keys': [
            'title',
            'street',
            'city',
            'created',
            'updated',
            'edit',
            'show',
            'delete'
        ],
    };

    //TODO: implement show action
    $scope.clickShowHandler =  function (uuid) {
        $location.path('/location/' + uuid);
    }
    $scope.clickEditHandler = function (uuid) {
        $location.path('/locations/update/' + uuid);
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

    $scope.actions =[
        {
            label: 'actions.edit',
            css_class: 'fa-pencil-square-o',
            clickHandler: function (location) {
                $location.path('/locations/update/' + location.uuid);
            }
        },
        /*
         {
         label: 'actions.delete',
         css_class: 'fa-trash-o',
         clickHandler: function (location) {
         // TODO: delete function needs some work in the api to remove associated assets and entries
         }
         },
         */
        {
            label: 'actions.show',
            css_class: 'fa-eye',
            clickHandler: function (location) {
                $location.path('/' + (location.region ? location.region.title : location.region_uuid) + '/' + location.uuid);
            }
        }
    ];
};

LocationsUserController.$inject = ['$scope', '$location'];

module.exports = LocationsUserController;