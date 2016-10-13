'use strict';

var LsmDataTableDirective = function ($q, apiService, assetPath) {
    return {
        restrict: 'A',
        templateUrl: assetPath + 'partials/_data_table.html',
        link: function (scope) {
            scope.selected = [];
            scope.query = {
                sort: scope.settings.sort ? scope.settings.sort : 'title',
                page: 1
            };
            scope.getDataForProperty = function (property, data) {
                var found = false,
                    result = data,
                    parts = property.split('.');
                for (var i = 0; i < parts.length; i += 1) {
                    if (result[parts[i]]) {
                        found = true;
                        result = result[parts[i]];
                    }
                }
                return found ? result : null;
            };
            function fetchData(page, pagesize, sort) {
                var deferred = $q.defer();
                scope.promise = deferred.promise;
                var resource = scope.settings.resource + '?pagesize=' + (pagesize || scope.settings.pagesize) +
                    '&page=' + ((page || scope.query.page) - 1) + '&sort=' + (sort || scope.query.sort);
                apiService(resource).actions.all(function (err, results) {
                    if (!err && results) {
                        scope.data = results.results || results;
                        scope.query.total = results.total;
                        deferred.resolve();
                    } else {
                        deferred.reject();
                    }
                });
            }
            scope.onPaginate = function (page, limit) {
                fetchData(page, limit, null);
            };
            scope.onSort = function (order) {
                scope.selected = [];
                fetchData(null, null, order);
            };
            scope.$watch("needsUpdate", function (newValue) {
                if (newValue === true) {
                    fetchData();
                }
            });
            fetchData();
        }
    };
};

LsmDataTableDirective.$inject = ['$q', 'apiService', 'assetPath'];

module.exports = LsmDataTableDirective;