/* global require,angular,document */

(function () {
    'use strict';

    require.config({
        urlArgs: "build=16061501",
        paths: {
            lang_en: '/src/shared/js/lang/en',
            lang_de: '/src/shared/js/lang/de',
            text: '/js/lib/text',
            json: '/js/src/json',
            lsmMapconfig: '/src/shared/js/lsm-mapconfig',
            routes: '/src/web/js/routes',

            services_api: '/src/shared/js/services/api',
            services_auth: '/src/shared/js/services/auth',
            services_map: '/src/shared/js/services/map',
            services_helpers: '/src/shared/js/services/helpers',
            services_assetpath: '/src/web/js/services/assetpath',

            controllers_users: '/src/shared/js/controllers/users',
            controllers_locations: '/src/shared/js/controllers/locations',
            controllers_messages: '/src/shared/js/controllers/messages',
            controllers_posts: '/src/shared/js/controllers/posts',
            controllers_regions: '/src/shared/js/controllers/regions',
            controllers_site: '/src/shared/js/controllers/site',
            controllers_widgets: '/src/shared/js/controllers/widgets',

            directives_helpers: '/src/shared/js/directives/helpers',
            directives_map: '/src/shared/js/directives/map',
            directives_widgets: '/src/shared/js/directives/widgets',

            leerstandsmelder: '/src/web/js/app-web'
        }
    });

    require([
            'leerstandsmelder'
        ], function (leerstandsmelder) {
            angular.bootstrap(document, ['leerstandsmelder']);
        }
    );

})();