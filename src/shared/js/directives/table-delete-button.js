'use strict';

var TableDeleteButtonDirective = function () {
    return {
        template: '<md-button class="md-table-button md-raised md-fab  md-mini " ng-click="clientScope.deleteClick(this)" aria-label="{{ \'actions.delete\' | translate }}"><md-icon md-font-icon="fa-trash" class="fa"></md-icon></md-button>',
    };
};

module.exports = TableDeleteButtonDirective;