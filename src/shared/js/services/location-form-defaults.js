'use strict';

// TODO: this does not need to be a service

var LocationFormDefaultsService = function () {
    return {
        artworkSince: [
            'locations.unknown',
            'locations.artwork_since_options.min_three_years',
            'locations.artwork_since_options.min_four_years',
            'locations.artwork_since_options.min_five_years',
            'locations.artwork_since_options.min_ten_years',
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
        artworkType: [
            'locations.unknown',
            'locations.artwork_type_options.mural',
            'locations.artwork_type_options.tag',
            'locations.artwork_type_options.parole',
            'locations.artwork_type_options.kringel',
            'locations.artwork_type_options.piece',
            'locations.artwork_type_options.smiley',
            'locations.artwork_type_options.for_oz',
            'locations.artwork_type_options.line',
            'locations.artwork_type_options.others'
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