/* global console,angular,define */

define([], function () {
    return angular.module('leerstandsmelder.services.regions', [])
        .factory('regionService', ['apiService', '$rootScope', function (apiService, $rootScope) {
            return {
                currentRegion: null,
                setCurrentRegion: function (uuid, cb) {
                    var _self = this;
                    if (!uuid) {
                        _self.currentRegion = null;
                        return $rootScope.$broadcast('currentRegion:updated', null);
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
                    }
                }
            };
        }]);
});