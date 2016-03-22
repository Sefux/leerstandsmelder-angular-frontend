/* global console,angular,define,JSON */

define([], function () {
    return angular.module('leerstandsmelder.services.helpers', [])
        .factory('regionService', ['apiService', '$rootScope', function (apiService, $rootScope) {
            return {
                currentRegion: null,
                setCurrentRegion: function (uuid, cb) {
                    var _self = this;
                    if (!uuid) {
                        _self.currentRegion = null;
                        $rootScope.$broadcast('currentRegion:updated', null);
                        return cb();
                    }
                    if (!this.currentRegion || this.currentRegion.uuid !== uuid) {
                        apiService('regions').actions.find(uuid, function (err, region) {
                            if (!err && region) {
                                _self.currentRegion = region;
                                $rootScope.$broadcast('currentRegion:updated', region);
                            } else {
                                console.log('error getting region for ' + uuid + ': ' + err.message);
                            }
                            cb();
                        });
                    } else {
                        cb();
                    }
                }
            };
        }])
        .factory('responseHandler', ['$translate', 'PubSub', function ($translate, PubSub) {
            return {
                handleResponse: function (err, deferred, msgs) {
                    if (err) {
                        if ([400, 409, 422].indexOf(err.code) > -1) {
                            if (err.errors instanceof Object) {
                                for (var field in err.errors) {
                                    if (typeof err.errors[field] === 'object') {
                                        PubSub.publish('alert', 'error', err.errors[field].message);
                                    }
                                }
                            } else {
                                PubSub.publish('alert', 'error', $translate.instant(err.message));
                            }
                        } else if (err.code === 403) {
                            PubSub.publish('alert', 'error', $translate.instant('errors.access_denied'));
                        } else {
                            if (msgs && msgs.error) {
                                PubSub.publish('alert', 'error', $translate.instant(err.message));
                            } else if (err.message) {
                                PubSub.publish('alert', 'error', $translate.instant(err.message));
                            } else {
                                PubSub.publish('alert', 'error', $translate.instant('errors.unknown') + ' Code ' + err.status);
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
        }]);
});