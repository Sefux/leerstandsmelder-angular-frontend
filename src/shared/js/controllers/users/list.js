'use strict';

var UsersListController = function ($scope, apiService, responseHandler, $q, $filter, configuration) {
    var deferred = $q.defer();
    $scope.promise = deferred.promise;
    $scope.urlbase = configuration.urlbase || '/';
    $scope.settings = {
        pagesize: 25000,
        resource: 'users'
    };

    var columnDefs = [
        {headerName: $filter('translate')("users.username"), field: "nickname", width: 120, sort: 'asc'},
	    {headerName: $filter('translate')("users.email"), field: "email", width: 90},
        {headerName: $filter('translate')("users.created"), field: "created", width: 90, cellRenderer: dateFormatter},
        {headerName: $filter('translate')("users.notify"), field: "notify", width: 60, cellRenderer: function (params) {if(params.value){ return $filter('translate')('generel.yes');} else {return $filter('translate')('generel.no');} }},
	    {headerName: "", field: "uuid", width: 60, suppressFilter: true, cellRenderer: function (params) {      // Function cell renderer
		        return '<a class="md-icon-button md-table-button md-raised  md-fab  md-mini " href="' + $scope.urlbase + 'admin/users/' + params.value + '" aria-label="' + $filter('translate')("actions.edit") + '"><md-icon md-font-icon="fa-pencil" class="fa fa-pencil"></md-icon></a>';
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

    function dateFormatter(params) {
        return $filter('date')(params.value,'yyyy-MM-dd');
    }

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
            deferred.resolve();
        } else deferred.reject(err);
    });


};

UsersListController.$inject = ['$scope', 'apiService', 'responseHandler', '$q', '$filter', 'configuration'];

module.exports = UsersListController;