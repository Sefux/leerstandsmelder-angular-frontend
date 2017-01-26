'use strict';

var CommentsListController = function ($scope, $q, apiService, responseHandler, $location, $filter, configuration) {

    $scope.urlbase = configuration.urlbase || '/';
    $scope.rowSetup = {
        'table-row-id-key': 'uuid',
        'column-keys': [
            'body',
            'user.nickname',
            'location.title',
            'created',
            'edit',
            'show'
        ],
    };
    $scope.fields = [
        {
            label: 'comments.body',
            property: 'body'
        },
        {
            label: 'author.author',
            property: 'user.nickname',
            date: true,
            sort: true
        },
        {
            label: 'Location',
            property: 'location.title',
            sort: true
        },
        {
            label: 'author.created',
            property: 'created',
            date: true,
            sort: true
        },
        {
            label: '',
            property: 'edit'
        },
        {
            label: '',
            property: 'show'
        }
    ];
    $scope.settings = {
        row_select: false,
        multiple: false,
        pagination: true,
        pagesize: 25000,
        limit_options: [25, 50, 100],
        resource: 'comments'
    };


    var columnDefs = [
        {headerName: $filter('translate')("comments.body"), field: "body", width: 120, sort: 'asc'},
        {headerName: "Author", field: "user.nickname", width: 90},
        {headerName: "Location", field: "location.title", width: 90},
        {headerName: "Created", field: "created", width: 90, cellRenderer: dateFormatter},
        {headerName: "", field: "uuid", width: 60, suppressFilter: true, cellRenderer: function (params) {      // Function cell renderer
            return '<a class="md-icon-button md-table-button md-raised  md-fab  md-mini " href="' + $scope.urlbase + 'admin/comments/' + params.value + '" aria-label="{{ \'actions.edit\' | translate }}"><md-icon md-font-icon="fa-pencil" class="fa fa-pencil"></md-icon></a>';
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

CommentsListController.$inject = ['$scope', '$q', 'apiService', 'responseHandler', '$location','$filter', 'configuration'];

module.exports = CommentsListController;