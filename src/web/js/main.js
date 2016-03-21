/* global require,angular,document */

(function () {
    'use strict';

    require.config({
        paths: {
            lang_en: '/src/shared/js/lang/en',
            lang_de: '/src/shared/js/lang/de',
            config: '/js/configuration',

            services_api: '/src/modules/api/js/services/api',
            services_auth: '/src/modules/auth/js/services/auth',

            controllers_users: '/src/modules/auth/js/controllers/users',
            controllers_locations: '/src/shared/js/controllers/locations',
            controllers_posts: '/src/shared/js/controllers/posts',
            controllers_regions: '/src/shared/js/controllers/regions',
            controllers_site: '/src/shared/js/controllers/site',
            controllers_widgets: '/src/shared/js/controllers/widgets',

            directives_helpers: '/src/modules/auth/js/directives/helpers',

            ITOMapConfig: '/src/modules/dataviewer/js/mapconfig',
            directives_dataviewer_maps: '/src/modules/dataviewer/js/directives/map',
            services_dataviewer_feature: '/src/modules/dataviewer/js/services/feature',

            leerstandsmelder: '/src/web/js/site'
        }
    });

    require([
            'leerstandsmelder'
        ], function (leerstandsmelder) {
            angular.bootstrap(document, ['leerstandsmelder']);
        }
    );

})();