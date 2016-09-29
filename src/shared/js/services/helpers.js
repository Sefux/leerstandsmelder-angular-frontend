/* global console,angular,define,JSON,airbrakeJs,LM_AIRBRAKE_PROJECT_ID,LM_AIRBRAKE_PROJECT_KEY */

define([
    'json!../../../../js/config.json!bust',
    'services_api',
    'services_assetpath'
], function (config) {
    return angular.module('lsm.services.helpers', [
        'angularPubsub',
        'lsm.services.api',
        'lsm.services.assetpath'
    ])
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
                                console.log('error getting region for ' + uuid + ': ' + (err ? err.message : null));
                            }
                            cb();
                        });
                    } else {
                        cb();
                    }
                }
            };
        }])
        .factory('errorReporter', function () {
            var client = null;
            if (config.global.airbrake.project_id && config.global.airbrake.project_key) {
                client = new airbrakeJs.Client({
                    projectId: config.global.airbrake.project_id,
                    projectKey: config.global.airbrake.project_key
                });
            }
            return {
                client: client,
                notify: function (err) {
                    if (this.client) {
                        this.client.notify(err);
                    }
                },
                wrap: function (func) {
                    if (this.client) {
                        return this.client.wrap(func);
                    } else {
                        return func;
                    }
                }
            };
        })
        .factory('responseHandler', ['$translate', 'PubSub', 'errorReporter', '$location', function ($translate, PubSub, errorReporter, $location) {
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
        }])
        .factory('staticContent', ['$translate', '$http', 'assetPath', function ($translate, $http, assetPath) {
            return {
                getMarkdown: function (slug, cb) {
                    var lang = $translate.use().toString(),
                        url = assetPath + 'static/md/' + slug + '_' + lang + '.md';
                    $http.get(url).then(function success(response) {
                        cb(null, response.data);
                    }, function error(response) {
                        cb(new Error(response.statusText), null);
                    });
                }
            };
        }])
        .factory('locationFormDefaults', function () {
            return {
                emptySince: [
                    'locations.unknown',
                    'locations.empty_options.recently',
                    'locations.empty_options.about_half_year',
                    'locations.empty_options.min_one_year',
                    'locations.empty_options.min_three_years',
                    'locations.empty_options.min_five_years'
                ],
                degree: [
                    'locations.unknown',
                    'locations.degree_options.complete',
                    'locations.degree_options.partial'
                ],
                rumor: [
                    'locations.demolition_rumor_yes'
                ],
                demolished: [
                    'locations.demolished_yes'
                ],
                hidden: [
                    'locations.hidden_yes'
                ],
                buildingType: [
                    'locations.unknown',
                    'locations.building_type_options.residential',
                    'locations.building_type_options.commercial',
                    'locations.building_type_options.industrial',
                    'locations.building_type_options.historical',
                    'locations.building_type_options.public_work',
                    'locations.building_type_options.other'
                ],
                owner: [
                    'locations.unknown',
                    'locations.owner_options.private',
                    'locations.owner_options.business',
                    'locations.owner_options.public',
                    'locations.owner_options.city'
                ]
            };
        });
});