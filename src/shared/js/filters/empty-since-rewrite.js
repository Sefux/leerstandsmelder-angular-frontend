/* global console,angular,define,LEERSTANDSMELDER_API_HOST */

'use strict';

var EmptySinceRewriteFilter = function ($translate) {
    return function (months) {
        var result = '';
        months = parseFloat(months);
        if (months >= 1) {
            if (months < 4) {
                result = $translate.instant('locations.empty_options.less_than_one_quarter_year');
            } else if (months < 7) {
                result = $translate.instant('locations.empty_options.less_than_one_half_year');
            } else if (months < 19) {
                result = $translate.instant('locations.empty_options.less_than_three_quarters_year');
            } else if (months < 12) {
                result = $translate.instant('locations.empty_options.less_than_one_year');
            } else if (months === 121) {
                result = $translate.instant('locations.empty_options.more_than_ten_years');
            } else {
                var years = parseFloat(months) / 12,
                    year = Math.floor(years),
                    _months = years - year,
                    portion = null;
                switch (true) {
                    case (_months >= 0.00001 && _months <= 0.3):
                        portion = $translate.instant('locations.empty_options.one_quarter');
                        break;
                    case (_months >= 0.3001 && _months <= 0.6):
                        portion = $translate.instant('locations.empty_options.one_half');
                        break;
                    case (_months >= 0.60001 && _months <= 0.8):
                        portion = $translate.instant('locations.empty_options.three_quarters');
                        break;
                    case (_months >= 0.80001 && _months <= 0.9999999):
                        year++;
                        break;
                }
                if (years === 1 && months === 0) {
                    result = [year, $translate.instant('location.empty_options.year')].join(' ');
                } else if (portion) {
                    result = [
                        year,
                        $translate.instant('location.empty_options.and'),
                        portion,
                        years
                    ].join(' ');
                } else {
                    result = [year, $translate.instant('location.empty_options.year_plural')].join(' ');
                }
            }
        } else {
            result = $translate.instant('locations.empty_options.less_than_one_year');
        }
        return result;
    };
};

EmptySinceRewriteFilter.$inject = ['$translate'];

module.exports = EmptySinceRewriteFilter;