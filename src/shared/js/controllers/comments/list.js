'use strict';

var CommentsListController = function ($scope, $q, apiService, responseHandler, $location, $filter) {
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
        {headerName: "comments.body", field: "body", width: 120, sort: 'asc'},
        {headerName: "Author", field: "user.nickname", width: 90},
        {headerName: "Location", field: "location.title", width: 90},
        {headerName: "Created", field: "created", width: 90, cellRenderer: dateFormatter},
        {headerName: "", field: "uuid", width: 60, suppressFilter: true, cellRenderer: function (params) {      // Function cell renderer
            return '<a class="md-icon-button md-table-button md-raised  md-fab  md-mini " href="admin/comments/' + params.value + '" aria-label="{{ \'actions.edit\' | translate }}"><md-icon md-font-icon="fa-pencil" class="fa fa-pencil"></md-icon></a>';
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


};

CommentsListController.$inject = ['$scope', '$q', 'apiService', 'responseHandler', '$location','$filter'];

module.exports = CommentsListController;