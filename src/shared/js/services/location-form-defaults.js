'use strict';

// TODO: this does not need to be a service

var LocationFormDefaultsService = function () {
    return {
        emptySince: [
            'locations.unknown',
            'locations.empty_options.recently',
            'locations.empty_options.about_half_year',
            'locations.empty_options.min_one_year',
            'locations.empty_options.min_three_years',
            'locations.empty_options.min_five_years'
        ],
        degree: [
            'locations.unknown',
            'locations.degree_options.complete',
            'locations.degree_options.partial'
        ],
        rumor: [
            'locations.demolition_rumor_yes'
        ],
        demolished: [
            'locations.demolished_yes'
        ],
        hidden: [
            'locations.hidden_yes'
        ],
        buildingType: [
            'locations.unknown',
            'locations.building_type_options.residential',
            'locations.building_type_options.commercial',
            'locations.building_type_options.industrial',
            'locations.building_type_options.historical',
            'locations.building_type_options.public_work',
            'locations.building_type_options.other'
        ],
        owner: [
            'locations.unknown',
            'locations.owner_options.private',
            'locations.owner_options.business',
            'locations.owner_options.public',
            'locations.owner_options.city'
        ]
    };
};

module.exports = LocationFormDefaultsService;