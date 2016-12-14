'use strict';

var UsersListController = function ($scope, apiService, responseHandler, $q) {
    $scope.rowSetup = {
        'table-row-id-key': 'uuid',
        'column-keys': [
            'nickname',
            'email',
            'created'
        ],
    };
    $scope.fields = [
        {
            label: 'messages.message',
            property: 'body',
            sort: false
        },
        {
            label: 'messages.from',
            property: 'recipient.nickname',
            sort: false
        },
        {
            label: 'messages.sent',
            property: 'created',
            date: true,
            sort: false
        }
    ];
    $scope.settings = {
        row_select: false,
        multiple: false,
        pagination: true,
        pagesize: 25,
        limit_options: [25, 50, 100],
        resource: 'users'
    };
    $scope.actions = [
        {
            label: 'actions.delete',
            css_class: 'fa-trash-o',
            clickHandler: function (message) {
                var deferred = $q.defer();
                $scope.promise = deferred.promise;
                apiService('locations').actions.remove(message.uuid, function (err) {
                    var msgs = {
                        success: 'messages.remove_success'
                    };
                    if (responseHandler.handleResponse(err, deferred, msgs)) {
                        window.document.location.reload();
                    }
                });
            }
        }
    ];
};

UsersListController.$inject = ['$scope', 'apiService', 'responseHandler', '$q'];

module.exports = UsersListController;