'use strict';

var LocationsUserController = function ($scope, $q, $location, $mdDialog ,$translate, responseHandler, apiService, configuration, $filter) {

    $scope.urlbase = configuration.urlbase || '/';
    $scope.settings = {
        sort: '-created',
        pagesize: 25,
        resource: 'users/me/locations'
    };

    var columnDefs = [
        {headerName: $filter('translate')("locations.title"), field: "title", width: 120, sort: 'asc' },
        {headerName: $filter('translate')("locations.street"), field: "street", width: 90},
        {headerName: $filter('translate')("locations.artwork_type"), field: "artworkType", width: 90, cellRenderer: $scope.translateFormatter},
        {headerName: $filter('translate')("author.updated"), field: "updated", width: 60, cellRenderer: $scope.dateFormatter},
        {headerName: $filter('translate')("author.created"), field: "created", width: 60, cellRenderer: $scope.dateFormatter},
        {headerName: "", field: "uuid", width: 90, suppressFilter: true, cellRenderer: function (params) {      // Function cell renderer
            return '<a class="md-icon-button md-button md-ink-ripple" href="' + $scope.urlbase +
              (params.data.region ? params.data.region.slug : params.data.region_uuid) + '/' +
              (params.data.slug || params.data.uuid) + '" aria-label="' + $filter('translate')("actions.view") +
              '"><md-icon md-font-icon="fa-eye" class="fa fa-eye"></md-icon></a>' +
              '<a class="md-icon-button md-button md-ink-ripple" href="' + $scope.urlbase +  'locations/update/' +
              (params.data.slug || params.data.uuid) + '" aria-label="' + $filter('translate')("actions.edit") +
              '"><md-icon md-font-icon="fa-pencil" class="fa fa-pencil"></md-icon></a>' +
              '<a class="md-icon-button md-button md-ink-ripple" ng-click="clickDeleteHandler(\'' + params.data.uuid +
              '\')" aria-label="' + $filter('translate')("actions.delete") +
              '"><md-icon md-font-icon="fa-trash" class="fa fa-trash"></md-icon></a>';
            }
        }
    ];

    $scope.gridOptions.columnDefs =  columnDefs;
    $scope.gridOptions.angularCompileRows = true;

    $scope.filterGrid = function() {
        $scope.gridOptions.api.setQuickFilter($scope.filterStr);
    };

    $scope.query = {
        sort: $scope.settings.sort ? $scope.settings.sort : 'title',
        page: 1
    };

    var pageSize =  $scope.settings.pagesize;
    var resource = $scope.settings.resource + '?limit=' + pageSize +
        '&skip=' + ((( $scope.query.page) - 1) * pageSize) + '&sort=' + ( $scope.query.sort);
    apiService(resource).actions.all(function (err, results) {
        if (!err && results) {
            $scope.gridOptions.api.setRowData(results.results || results);
            $scope.gridOptions.api.sizeColumnsToFit();
            $scope.query.total = results.total;
        }
    });


    $scope.page = {
        list_title: 'locations.my_locations',
        list_title_empty: 'locations.my_locations_empty'
    };


    //TODO: implement show action
    $scope.clickShowHandler =  function (uuid) {
        var path = 'location/' + uuid;
        $location.path(path);
    };
    $scope.clickEditHandler = function (uuid) {
        $location.path('locations/update/' + uuid);
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

LocationsUserController.$inject = ['$scope', '$q', '$location', '$mdDialog', '$translate', 'responseHandler', 'apiService', 'configuration', '$filter'];

module.exports = LocationsUserController;
