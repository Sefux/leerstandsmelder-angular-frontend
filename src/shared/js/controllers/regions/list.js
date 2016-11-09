'use strict';

var RegionsListController = function ($scope, $q, $location, $mdDialog ,$translate, responseHandler, apiService) {
    $scope.fields = [
        {
            label: 'regions.title',
            property: 'title',
            sort: false
        },
        {
            label: 'author.created',
            property: 'created',
            date: true,
            sort: true
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
        resource: 'regions'
    };
    $scope.rowSetup = {
        'table-row-id-key': 'uuid',
        'column-keys': [
            'title',
            'created',
            'updated',
            'edit',
            'show',
            'delete'
        ],
    };
    $scope.clickEditHandler = function (uuid) {
        $location.path('/admin/regions/' + uuid);
    };
    $scope.clickShowHandler =  function (uuid) {
        console.log('uuid',uuid);

        $location.path('/admin/regions/' + uuid + '/locations');
    };

    $scope.clickDeleteHandler = function (uuid) {
        var confirm = $mdDialog.confirm()
            .title($translate.instant('regions.remove_confirm_title'))
            .textContent($translate.instant('regions.remove_confirm_body'))
            .ariaLabel('regions.remove_confirm_title')
            .ok($translate.instant('actions.ok'))
            .cancel($translate.instant('actions.cancel'));
        $mdDialog.show(confirm).then(function () {
            var deferred = $q.defer();
            $scope.promise = deferred.promise;
            apiService('regions').actions.remove(uuid, function (err) {
                var msgs = {
                    success: 'regions.remove_success'
                };
                if (responseHandler.handleResponse(err, deferred, msgs)) {
                    window.document.location.reload();
                }
            });
        });
    };
};

RegionsListController.$inject = ['$scope', '$q', '$location', '$mdDialog', '$translate', 'responseHandler', 'apiService'];

module.exports = RegionsListController;