'use strict';

var LsmDataGridDirective = function ($q, apiService, assetPath, $translate, $filter) {
	return {
		restrict: 'A',
		templateUrl: assetPath + 'partials/_data_grid.html',
		link: function (scope) {
			console.log(scope.gridOptions);

			scope.dateFormatter = function(params) {
				return $filter('date')(params.value,'yyyy-MM-dd');
			};

			scope.query = {
				sort: scope.settings.sort ? scope.settings.sort : 'title',
				page: 1
			};

			var pageSize =  scope.settings.pagesize;
			var resource = scope.settings.resource + '?limit=' + pageSize +
				'&skip=' + ((( scope.query.page) - 1) * pageSize) + '&sort=' + ( scope.query.sort);
			apiService(resource).actions.all(function (err, results) {
				if (!err && results) {
					scope.gridOptions.api.setRowData(results.results || results);
					scope.gridOptions.api.sizeColumnsToFit();
					scope.query.total = results.total;
				}
			});

		}
	};
};

LsmDataGridDirective.$inject = ['$q', 'apiService', 'assetPath', '$translate','$filter'];

module.exports = LsmDataGridDirective;