'use strict';

var LsmUserCardListDirective = function ($q, apiService, assetPath, $translate) {
    return {
        restrict: 'A',
        templateUrl: assetPath + 'partials/_user_card_list.html',
        link: function (scope) {

            $translate('table.rowsPerPage').then(function(rowsPerPage) {
                scope.rowsPerPage = rowsPerPage;

            }, function(translationId) {
                scope.rowsPerPage = translationId;
            });
            $translate('table.pageOf').then(function(pageOf) {
                scope.pageOf = pageOf;

            }, function(translationId) {
                scope.pageOf = translationId;
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
                var deferred = $q.defer(),
                    pageSize = pagesize || scope.settings.pagesize;
                scope.promise = deferred.promise;
                var resource = scope.settings.resource + '?limit=' + pageSize +
                    '&skip=' + (((page || scope.query.page) - 1) * pageSize) + '&sort=' + (sort || scope.query.sort);
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
            fetchData(0,10000);



            scope.onPaginate = function (page, limit, options) {
                var columnSort = options.columnSort || null;
                var sort = null;

                if(columnSort) {
                    angular.forEach(columnSort, function(key,value) {
                        if(key.sort !== false){
                            if(key.sort === 'asc') {
                                sort = '-';
                            }
                            sort = sort + scope.fields[value].property;
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
            scope.editClick = function (row) {
                if (typeof scope.clickEditHandler === 'function') {
                    scope.clickEditHandler(row.rowId);
                }
            };
            scope.showClick = function (row) {
                if (typeof scope.clickShowHandler === 'function') {
                    scope.clickShowHandler(row.rowId);
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

LsmUserCardListDirective.$inject = ['$q', 'apiService', 'assetPath', '$translate'];

module.exports = LsmUserCardListDirective;