'use strict';

// TODO: this does not need to be a service

var LocationFormDefaultsService = function () {
    return {
        artworkSince: [
            'locations.unknown',
            'locations.artwork_since_options.before_1990',
            'locations.artwork_since_options.before_2000',
            'locations.artwork_since_options.before_2010',
            'locations.artwork_since_options.since_2011',
        ],
        degree: [
            'locations.unknown',
            'locations.degree_options.complete',
            'locations.degree_options.partial',
            'locations.degree_options.sprayed',
            'locations.degree_options.buffed'
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
            'locations.artwork_type_options.smiley',
            'locations.artwork_type_options.kringel',
            'locations.artwork_type_options.tag',
            'locations.artwork_type_options.others',
            'locations.artwork_type_options.mural',
            'locations.artwork_type_options.parole',
            'locations.artwork_type_options.for_oz',
            'locations.artwork_type_options.piece',
            'locations.artwork_type_options.line',
            'locations.unknown',
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