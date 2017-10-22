'use strict';

var ResponseHandlerService = function ($translate, PubSub, $location, apiService) {
    return {
        handleResponse: function (err, deferred, msgs) {
            if (err) {
                if ([400, 409, 422].indexOf(err.code) > -1) {
                    if (err.errors instanceof Object) {
                        for (var field in err.errors) {
                            if (typeof err.errors[field] === 'object') {
                                PubSub.publish('alert', {type: 'error', message: $translate.instant(err.errors[field].message)});
                            }
                        }
                    } else {
                        PubSub.publish('alert', {type: 'error', message: $translate.instant(err.message)});
                    }
                } else if (err.code === 401) {
                    PubSub.publish('alert', {type: 'error', message: $translate.instant('errors.authorization_failed')});
                } else if (err.code === 403) {
                    PubSub.publish('alert', {type: 'error', message: $translate.instant('errors.access_denied')});
                } else if (err.code === 404) {
                    $location.path('/site/404');
                } else {
                    if (msgs && msgs.error) {
                        PubSub.publish('alert', {type: 'error', message: $translate.instant(err.message)});
                    } else if (err.message) {
                        PubSub.publish('alert', {type: 'error', message: $translate.instant(err.message)});
                    } else {
                        apiService('ping').actions.ping(function (err, results) {
                            if (!err && results) {
                                // some other unknown error appeared
                                PubSub.publish('alert', {type: 'error', delay: 0, message: $translate.instant('errors.unknown') + ' Code ' + err.code});
                            } else {
                                // server is offline or connection broken
                                PubSub.publish('alert', {type: 'critical', delay: 0, message: $translate.instant('errors.noconnection') + ' Code ' + err.code});
                            }
                        });
                    }
                }
                if (deferred) {
                    deferred.reject(err);
                }
                return false;
            }
            if (msgs && msgs.success) {
                PubSub.publish('alert',{type: 'success', message: $translate.instant(msgs.success)});
            }
            if (deferred) {
                deferred.resolve();
            }
            return true;
        }
    };
};

ResponseHandlerService.$inject = ['$translate', 'PubSub', '$location', 'apiService'];

module.exports = ResponseHandlerService;
