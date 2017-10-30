'use strict';

var RegionService = function (apiService, $rootScope) {
    return {
        currentRegion: null,
        currentLocations: null,
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
                    //setCurrentLocations
                    cb();
                }, function() {}, true);
            } else {
                cb();
            }
        },
        clearCurrentLocations: function(cb) {

        },
        setCurrentLocations: function(uuid, cb) {
          var _self = this;

          if (!this.currentLocations || this.currentRegion.uuid !== uuid) {
          apiService('regions/' + uuid + '/locations').actions.all(function (err, locations) {
            if (!err && locations) {
              _self.currentLocations = locations.results || locations;
              /*console.log('setCurrentLocations api',locations);
                locations.results.forEach(function(item) {
                  //console.log('item', item);
                    _self.currentLocations[item.uuid] = item;

                });
                */
                //_self.currentLocations = locations;
                //$rootScope.$broadcast('currentRegion:updated', region);
            } else {
                console.log('error getting locations for ' + uuid + ': ' + (err ? err.message : null));
            }
            cb();
          }, function() {}, false);
        } else {
          cb();
        }
        },
        getCurrentLocations: function(uuid, cb) {
          if (!this.currentLocations || this.currentRegion.uuid !== uuid) {
            return this.setCurrentLocations(uuid);
          } else {
            return this.currentLocations;
          }
        }
    };
};

RegionService.$inject = ['apiService', '$rootScope'];

module.exports = RegionService;
