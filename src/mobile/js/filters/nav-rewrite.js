'use strict';

var NavRewriteFilter = function () {
    return function (link) {
        return '#!' + link;
    };
};

module.exports = NavRewriteFilter;
