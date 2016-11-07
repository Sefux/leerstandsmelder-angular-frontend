'use strict';

var LsmDataTableDirective = function ($q, apiService, assetPath, $translate) {
    return {
        restrict: 'A',
        templateUrl: assetPath + 'partials/_data_table.html',
        link: function (scope) {
            $translate('table.rowsPerPage').then(function(rowsPerPage) {
                scope.rowsPerPage = rowsPerPage;

            }, function(translationId) {
                scope.rowsPerPage = translationId;
            });
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
                //TODO: implement sort in api server
                var resource = scope.settings.resource + '?limit=' + (pagesize || scope.settings.pagesize) +
                    '&page=' + ((page || scope.query.page) - 1) + '&sort=' + (sort || scope.query.sort);
                apiService(resource).actions.all(function (err, results) {
                    if (!err && results) {
                        scope.data = results.results || results;
                        scope.query.total = results.total;
                        deferred.resolve({
                            results: scope.data,
                            totalResultCount: results.total || scope.data.length
                        });
                    } else {
                        deferred.reject(err);
                    }
                });
                return deferred.promise;
            }
            scope.onPaginate = function (page, limit, options) {
                var columnSort = options.columnSort || null;
                var sort = null;
                var direction = null;
                if(columnSort) {
                    angular.forEach(columnSort, function(key,value) {
                        if(key.sort != false){
                            sort = scope.fields[value].property;
                            direction = key.sort;
                        }

                    });
                }
                return fetchData(page, limit, sort);
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
            scope.itemClick = function (row) {
                if (typeof scope.clickHandler === 'function') {
                    scope.clickHandler(row.rowId);
                }
            };
            scope.deleteClick = function (row) {
                if (typeof scope.clickDeleteHandler === 'function') {
                    scope.clickDeleteHandler(row.rowId);
                }
            };
        }
    };
};

LsmDataTableDirective.$inject = ['$q', 'apiService', 'assetPath', '$translate'];

module.exports = LsmDataTableDirective;