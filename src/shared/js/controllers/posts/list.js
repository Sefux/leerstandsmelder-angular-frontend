'use strict';

var PostsListController = function ($scope, $q, apiService, responseHandler, $location) {
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
        }
    ];
    $scope.settings = {
        row_select: false,
        multiple: false,
        pagination: true,
        pagesize: 25,
        limit_options: [25, 50, 100],
        resource: 'posts'
    };
    $scope.actions = [
        {
            label: 'actions.edit',
            css_class: 'fa-pencil-square-o',
            clickHandler: function (item) {
                $location.path('/admin/posts/' + item.uuid);
            }
        },
        {
            label: 'actions.delete',
            css_class: 'fa-trash-o',
            clickHandler: function (item) {
                var deferred = $q.defer();
                $scope.promise = deferred.promise;
                apiService('posts').remove(item.uuid, function (err) {
                    if (responseHandler.handleResponse(err, deferred)) {
                        $location.path('/admin/posts');
                    }
                });
            }
        },
        {
            label: 'actions.show',
            css_class: 'fa-eye',
            clickHandler: function (item) {
                $location.path('/posts/' + (item.slug || item.uuid));
            }
        }
    ];
};

PostsListController.$inject = ['$scope', '$q', 'apiService', 'responseHandler', '$location'];

module.exports = PostsListController;