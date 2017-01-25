'use strict';

var TableShowButtonDirective = function () {
    return {
        template: '{{ rowId }}<md-button class="md-table-button md-raised md-fab  md-mini " ng-click="clientScope.showClick(this)" data-id="{{ rowId }}" aria-label="{{ \'actions.show\' | translate }}"><md-icon md-font-icon="fa-eye" class="fa"></md-icon></md-button>',
    };
};

module.exports = TableShowButtonDirective;