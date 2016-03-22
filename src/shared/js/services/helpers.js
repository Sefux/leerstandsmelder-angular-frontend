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
                        if (err.status === 400 || err.status === 409) {
                            var messages = JSON.parse(err.message);
                            for (var field in messages) {
                                if (typeof messages[field] === 'object') {
                                    PubSub.publish('alert', 'error', messages[field].message);
                                }
                            }
                        } else if (err.status === 403) {
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