'use strict';

var ResponseHandlerService = function ($translate, PubSub, errorReporter, $location) {
    return {
        handleResponse: function (err, deferred, msgs) {
            if (err) {
                if ([400, 409, 422].indexOf(err.code) > -1) {
                    if (err.errors instanceof Object) {
                        for (var field in err.errors) {
                            if (typeof err.errors[field] === 'object') {
                                PubSub.publish('alert', 'error', $translate.instant(err.errors[field].message));
                            }
                        }
                    } else {
                        PubSub.publish('alert', 'error', $translate.instant(err.message));
                    }
                } else if (err.code === 401) {
                    PubSub.publish('alert', 'error', $translate.instant('errors.authorization_failed'));
                } else if (err.code === 403) {
                    PubSub.publish('alert', 'error', $translate.instant('errors.access_denied'));
                } else if (err.code === 404) {
                    $location.path('/site/404');
                } else {
                    if (msgs && msgs.error) {
                        PubSub.publish('alert', 'error', $translate.instant(err.message));
                    } else if (err.message) {
                        PubSub.publish('alert', 'error', $translate.instant(err.message));
                    } else {
                        errorReporter.notify(err);
                        PubSub.publish('alert', 'error', $translate.instant('errors.unknown') + ' Code ' + err.code);
                    }
                }
                if (deferred) {
                    deferred.reject(err);
                }
                return false;
            }
            if (msgs && msgs.success) {
                PubSub.publish('alert', 'success', $translate.instant(msgs.success));
            }
            if (deferred) {
                deferred.resolve();
            }
            return true;
        }
    };
};

ResponseHandlerService.$inject = ['$translate', 'PubSub', 'errorReporter', '$location'];

module.exports = ResponseHandlerService;