'use strict';

var RegionsListController = function ($scope, $q, $location, $mdDialog ,$translate, responseHandler, apiService, configuration, $filter) {
    $scope.urlbase = configuration.urlbase || '/';
    $scope.settings = {
        pagesize: 25000,
        resource: 'regions'
    };

    var columnDefs = [
        {headerName: $filter('translate')("regions.title"), field: "title", width: 120, sort: 'asc'},
        {headerName: $filter('translate')("regions.created"), field: "created", width: 90, cellRenderer: $scope.dateFormatter},
        {headerName: $filter('translate')("regions.updated"), field: "updated", width: 90, cellRenderer: $scope.dateFormatter},
        {headerName: "", field: "uuid", width: 60, suppressFilter: true, cellRenderer: function(params) {      // Function cell renderer
            return '<a class="md-icon-button md-table-button md-raised  md-fab  md-mini " href="' + $scope.urlbase + 'admin/regions/' + params.value + '" aria-label="' + $filter('translate')("actions.edit") + '"><md-icon md-font-icon="fa-pencil" class="fa fa-pencil"></md-icon></a>';
        }
        },
    ];

    $scope.gridOptions = {
        columnDefs: columnDefs,
        rowData: null,
        rowHeight: 58,
        enableSorting: true,
        enableFilter: true,
        animateRows: true,
        enableColResize: true,
        onGridReady: function() {
            setTimeout(function() {
                $scope.gridOptions.api.sizeColumnsToFit();
            }, 600);
        }
    };

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

    $scope.settings = {
        pagesize: 25,
        resource: 'regions'
    };
    $scope.clickEditHandler = function (uuid) {
        $location.path('/admin/regions/' + uuid);
    };
    $scope.clickShowHandler =  function (uuid) {
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

RegionsListController.$inject = ['$scope', '$q', '$location', '$mdDialog', '$translate', 'responseHandler', 'apiService', 'configuration','$filter'];

module.exports = RegionsListController;
