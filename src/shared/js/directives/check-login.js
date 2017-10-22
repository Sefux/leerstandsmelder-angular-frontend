'use strict';

var async = require('async');

var CheckLoginDirective = function (apiService, authService, PubSub, $translate) {
    return {
        link: function (scope) {
            scope.$parent.$on('currentUser:updated', function () {
                scope.updateUser();
            });
            scope.updateUser = function () {
                if (authService.access_token) {
                    async.waterfall([
                        function (cb) {
                            apiService('users').actions.find('me', cb);
                        },
                        function (user, cb) {
                            //scope.userSession = user;
                            scope.setUserSession(user);
                            apiService('users/me/api_keys').actions.all(cb);
                        },
                        function (api_keys, cb) {
                            api_keys = api_keys.results || api_keys;
                            if (api_keys.length > 0) {
                                scope.setApiKey(api_keys[0]);
                                scope.admin_regions = [];
                                async.eachSeries(scope.api_key.scopes, function (item, next) {
                                    if (item.indexOf('region-') === 0) {
                                        var region_uuid = item.replace('region-', '');
                                        apiService('regions').actions.find(region_uuid, function (err, region) {
                                            if (!err) {
                                                scope.admin_regions.push(region);
                                            }
                                            next();
                                        });
                                    } else {
                                        next();
                                    }
                                }, cb);
                            } else {
                                cb();
                            }
                        }
                    ], function (err) {
                        if (err) {
                            PubSub.publish('alert', {type: 'error', message: $translate.instant('user.error.fetchin')});
                            console.log('error fetching user', err);
                            scope.setUserSession(null);
                            scope.setApiKey(null);
                            return;
                        }
                        scope.$apply();
                    });
                } else {
                    scope.setUserSession(null);
                    scope.setApiKey(null);
                }
            };
            scope.updateUser();
        }
    };
};

CheckLoginDirective.$inject = ['apiService', 'authService', 'PubSub', '$translate'];

module.exports = CheckLoginDirective;
