'use strict';

var UsersListController = function ($scope, apiService, responseHandler, $q, $filter) {
    $scope.settings = {
        row_select: false,
        multiple: false,
        pagination: true,
        pagesize: 25000,
        limit_options: [25, 50, 100],
        resource: 'users'
    };

    var columnDefs = [
        {headerName: "Nickname", field: "nickname", width: 120, sort: 'asc'},
	    {headerName: "Email", field: "email", width: 90},
        {headerName: "Created", field: "created", width: 90, cellRenderer: dateFormatter},
        {headerName: "Notify", field: "notify", width: 60, cellRenderer: function (params) {if(params.value){ return 'ja';} else {return 'nein';} }},
	    {headerName: "", field: "uuid", width: 60, suppressFilter: true, cellRenderer: function (params) {      // Function cell renderer
		        return '<a class="md-icon-button md-table-button md-raised  md-fab  md-mini " href="admin/users/' + params.value + '" aria-label="{{ \'actions.edit\' | translate }}"><md-icon md-font-icon="fa-pencil" class="fa fa-pencil"></md-icon></a>';
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
        }
    });


};

UsersListController.$inject = ['$scope', 'apiService', 'responseHandler', '$q', '$filter'];

module.exports = UsersListController;