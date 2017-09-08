'use strict';

var LocationsUserController = function ($scope, $q, $location, $mdDialog ,$translate, responseHandler, apiService, configuration, $filter) {

    $scope.urlbase = configuration.urlbase || '/';
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
        sort: '-created',
        pagesize: 25,
        limit_options: [25, 50, 100],
        resource: 'users/me/locations'
    };

    var columnDefs = [
        {headerName: $filter('translate')("locations.title"), field: "title", width: 120, sort: 'asc' },
        {headerName: $filter('translate')("locations.street"), field: "street", width: 90},
        {headerName: $filter('translate')("locations.building_type"), field: "buildingType", width: 90, cellRenderer: translateFormatter},
        {headerName: $filter('translate')("locations.owner"), field: "owner", width: 90, cellRenderer: translateFormatter},
        {headerName: $filter('translate')("author.updated"), field: "updated", width: 60, cellRenderer: dateFormatter},
        {headerName: $filter('translate')("author.created"), field: "created", width: 60, cellRenderer: dateFormatter},
        {headerName: "", field: "uuid", width: 90, suppressFilter: true, cellRenderer: function (params) {      // Function cell renderer
            return '<a class="md-icon-button md-button md-ink-ripple" href="' + $scope.urlbase + (params.data.region ? params.data.region.slug : params.data.region_uuid)+ '/' + (params.data.slug || params.data.uuid) + '" aria-label="' + $filter('translate')("actions.view") + '"><md-icon md-font-icon="fa-eye" class="fa fa-eye"></md-icon></a>'
                + '<a class="md-icon-button md-button md-ink-ripple" href="' + $scope.urlbase +  'locations/update/' + (params.data.slug || params.data.uuid) + '" aria-label="' + $filter('translate')("actions.edit") + '"><md-icon md-font-icon="fa-pencil" class="fa fa-pencil"></md-icon></a>'
                + '<a class="md-icon-button md-button md-ink-ripple" ng-click="clickDeleteHandler(\''+ params.data.uuid + '\')" aria-label="' + $filter('translate')("actions.delete") + '"><md-icon md-font-icon="fa-trash" class="fa fa-trash"></md-icon></a>'
                ;
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
        angularCompileRows: true,
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
    function translateFormatter(params) {
        if(params.value) {
            return $filter('translate')(params.value);
        } else return '';
    }

    $scope.filterGrid = function() {
        $scope.gridOptions.api.setQuickFilter($scope.filterStr);
    };

    function getTitleLink(params){

        var id = params.value;
        var row =  _.find($scope.data, function(item){
            return item.id === id;
        });
        console.log('getLink',row);
        if(row.region_uuid) {
            return '<a href="/' + (row.region ? row.region.slug : row.region_uuid)+ '/' + row.slug || row.uuid  + '">' + row.title + '</a>';
        } else {
            return '<a href="/locations/' + seo_state + '/' + row.slug || row.uuid  + '">' + row.title + '</a>';
        }
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