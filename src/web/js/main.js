'use strict';

require.config({
    paths: {
        config: '/js/configuration',

        services_api: '/src/modules/api/js/services/api',
        services_auth: '/src/modules/auth/js/services/auth',

        controllers_users: '/src/modules/auth/js/controllers/users',
        controllers_locations: '/src/shared/js/controllers/locations',
        controllers_site: '/src/shared/js/controllers/site',
        controllers_snippets: '/src/shared/js/controllers/snippets',

        directives_helpers: '/src/modules/auth/js/directives/helpers',

        ITOMapConfig: '/src/modules/dataviewer/js/mapconfig',
        controllers_dataviewer_maps: '/src/modules/dataviewer/js/controllers/map',
        directives_dataviewer_maps: '/src/modules/dataviewer/js/directives/map',
        services_dataviewer_maps: '/src/modules/dataviewer/js/services/map',

        leerstandsmelder: '/src/web/js/site'
    }
});

require([
        'leerstandsmelder'
    ], function (leerstandsmelder) {
        angular.bootstrap(document, ['leerstandsmelder']);
    }
);