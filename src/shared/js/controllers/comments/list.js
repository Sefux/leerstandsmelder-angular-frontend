'use strict';

var CommentsListController = function ($scope, $q, apiService, responseHandler, $location) {
    $scope.rowSetup = {
        'table-row-id-key': 'uuid',
        'column-keys': [
            'body',
            'user_uuid',
            'subject_uuid',
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
            property: 'user_uuid',
            date: true,
            sort: true
        },
        {
            label: 'Location',
            property: 'subject_uuid',
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
        pagesize: 25,
        limit_options: [25, 50, 100],
        resource: 'comments'
    };
    $scope.clickEditHandler = function (uuid) {
        $location.path('/admin/comments/' + uuid);
    };
    $scope.clickShowHandler =  function (uuid) {
        console.log('data',$scope.data);
        console.log('click-uuid',uuid);

        for (var i = 0, len = $scope.data.length; i < len; i++) {
            var obj = $scope.data[i];
            if(obj.uuid === uuid) {
                //$location.path('/location/' + obj.subject_uuid);
                break;
            }
        }


    };
};

CommentsListController.$inject = ['$scope', '$q', 'apiService', 'responseHandler', '$location'];

module.exports = CommentsListController;