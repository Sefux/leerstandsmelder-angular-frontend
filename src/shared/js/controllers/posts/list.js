'use strict';

var PostsListController = function ($scope, $q, apiService, responseHandler, $location,  configuration, $filter, $route) {
    $scope.urlbase = configuration.urlbase || '/';
    $scope.settings = {
        pagesize: 25000,
        resource: 'posts'
    };


    if($location.path().indexOf('static')>0) {
        $scope.settings.resource = 'posts/static';
    }

    var columnDefs = [
        {headerName: $filter('translate')("posts.title"), field: "title", width: 120, sort: 'asc'},
        {headerName: $filter('translate')("author.created"), field: "created", width: 90, cellRenderer: dateFormatter},
        {headerName: $filter('translate')("author.updated"), field: "updated", width: 90, cellRenderer: dateFormatter},
        {headerName: "", field: "uuid", width: 60, suppressFilter: true, cellRenderer: function (params) {      // Function cell renderer
            return '<a class="md-icon-button md-table-button md-raised  md-fab  md-mini " href="' + $scope.urlbase + 'admin/posts/' + params.value + '" aria-label="' + $filter('translate')("actions.edit") + '"><md-icon md-font-icon="fa-pencil" class="fa fa-pencil"></md-icon></a>';
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

PostsListController.$inject = ['$scope', '$q', 'apiService', 'responseHandler', '$location', 'configuration', '$filter', '$route'];

module.exports = PostsListController;