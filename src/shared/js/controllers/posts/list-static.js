'use strict';

var PostsListStaticController = function ($scope, $q, apiService, responseHandler, $location) {
    $scope.fields = [
        {
            label: 'posts.title',
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
        },
        {
            label: '',
            property: 'edit'
        }
    ];
    $scope.settings = {
        row_select: false,
        multiple: false,
        pagination: true,
        pagesize: 25,
        limit_options: [25, 50, 100],
        resource: 'posts/static'
    };
    $scope.rowSetup = {
        'table-row-id-key': 'uuid',
        'column-keys': [
            'title',
            'created',
            'updated',
            'edit'
        ],
    };
    $scope.clickHandler = function (uuid) {
        $location.path('/admin/posts/static/' + uuid);
    };
};

PostsListStaticController.$inject = ['$scope', '$q', 'apiService', 'responseHandler', '$location'];

module.exports = PostsListStaticController;