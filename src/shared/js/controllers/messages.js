/* global angular,define,async,Promise,PIECEMETA_API_HOST */

define([
    'services_api',
    'services_helpers'
], function () {
    return angular.module(
        'lsm.controllers.messages',
        [
            'lsm.services.api',
            'lsm.services.helpers'
        ])
        .controller('Messages.List', ['$scope', 'apiService', 'responseHandler', '$q', function ($scope, apiService, responseHandler, $q) {
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
                resource: 'users/me/messages'
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
        }])
        .controller('Messages.Create', ['$scope', '$q', '$location', 'apiService', 'responseHandler', function ($scope, $q, $location, apiService, responseHandler) {
            var deferred = $q.defer();
            $scope.promise = deferred.promise;
            $scope.message = {
                recipient_uuid: null,
                body: null
            };
            async.waterfall([
                function (cb) {
                    if ($location.search().recipient_uuid) {
                        apiService('users').actions.find($location.search().recipient_uuid, cb);
                    } else {
                        cb(new Error('errors.unknown'));
                    }
                },
                function (user, cb) {
                    $scope.recipient = user;
                    $scope.message.recipient_uuid = user.uuid;
                    cb();
                }
            ], function (err) {
                responseHandler.handleResponse(err, deferred);
            });
        }]);
});