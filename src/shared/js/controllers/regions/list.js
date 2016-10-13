'use strict';

var RegionsListController = function ($scope, $location) {
    $scope.fields = [
        {
            label: 'regions.title',
            property: 'title'
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
    $scope.actions = [
        {
            label: 'actions.edit',
            css_class: 'fa-pencil-square-o',
            clickHandler: function (item) {
                $location.path('/admin/regions/' + item.uuid);
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
            clickHandler: function (item) {
                $location.path('/' + item.slug);
            }
        }
    ];
};

RegionsListController.$inject = ['$scope', '$location'];

module.exports = RegionsListController;