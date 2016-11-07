'use strict';

var TableEditButtonDirective = function () {
    return {
        template: '<md-button class="md-table-button md-raised md-fab  md-mini " ng-click="clientScope.itemClick(this)" aria-label="{{ \'actions.edit\' | translate }}"><md-icon md-font-icon="fa-pencil" class="fa"></md-icon></md-button>',
    };
};

module.exports = TableEditButtonDirective;