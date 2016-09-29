/* global require,angular,document */

(function () {
    'use strict';

    require.config({
        paths: {
            lang_en: '../../shared/js/lang/en',
            lang_de: '../../shared/js/lang/de',
            text: '../../../js/lib/text',
            json: '../../../js/src/json',
            lsmMapconfig: '../../shared/js/lsm-mapconfig',
            routes: 'routes',

            services_api: '../../shared/js/services/api',
            services_auth: '../../shared/js/services/auth',
            services_map: '../../shared/js/services/map',
            services_helpers: '../../shared/js/services/helpers',
            services_deviceready: 'services/deviceready',
            services_assetpath: 'services/assetpath',

            controllers_users: '../../shared/js/controllers/users',
            controllers_locations: '../../shared/js/controllers/locations',
            controllers_messages: '../../shared/js/controllers/messages',
            controllers_posts: '../../shared/js/controllers/posts',
            controllers_regions: '../../shared/js/controllers/regions',
            controllers_site: '../../shared/js/controllers/site',
            controllers_widgets: '../../shared/js/controllers/widgets',

            directives_helpers: '../../shared/js/directives/helpers',
            directives_map: '../../shared/js/directives/map',
            directives_widgets: '../../shared/js/directives/widgets',

            filters_navrewrite: 'filters/nav-rewrite',

            leerstandsmelder: 'app-mobile'
        }
    });

    require([
            'leerstandsmelder'
        ], function (leerstandsmelder) {
            angular.bootstrap(document, ['leerstandsmelder']);
        }
    );

})();