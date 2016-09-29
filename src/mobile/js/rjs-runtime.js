/* global require,angular,document */

(function () {
    'use strict';

    require.config({
        paths: {
            lang_en: '/android_asset/www/src/shared/js/lang/en',
            lang_de: '/android_asset/www/src/shared/js/lang/de',
            text: '/android_asset/www/js/lib/text',
            json: '/android_asset/www/js/src/json',
            lsmMapconfig: '/android_asset/www/src/shared/js/lsm-mapconfig',
            routes: '/android_asset/www/src/mobile/js/routes',

            services_api: '/android_asset/www/src/shared/js/services/api',
            services_auth: '/android_asset/www/src/shared/js/services/auth',
            services_map: '/android_asset/www/src/shared/js/services/map',
            services_helpers: '/android_asset/www/src/shared/js/services/helpers',
            services_deviceready: '/android_asset/www/src/mobile/js/services/deviceready',
            services_assetpath: '/android_asset/www/src/mobile/js/services/assetpath',

            controllers_users: '/android_asset/www/src/shared/js/controllers/users',
            controllers_locations: '/android_asset/www/src/shared/js/controllers/locations',
            controllers_messages: '/android_asset/www/src/shared/js/controllers/messages',
            controllers_posts: '/android_asset/www/src/shared/js/controllers/posts',
            controllers_regions: '/android_asset/www/src/shared/js/controllers/regions',
            controllers_site: '/android_asset/www/src/shared/js/controllers/site',
            controllers_widgets: '/android_asset/www/src/shared/js/controllers/widgets',

            directives_helpers: '/android_asset/www/src/shared/js/directives/helpers',
            directives_map: '/android_asset/www/src/shared/js/directives/map',
            directives_widgets: '/android_asset/www/src/shared/js/directives/widgets',

            filters_navrewrite: '/android_asset/www/src/mobile/js/filters/nav-rewrite',

            leerstandsmelder: '/android_asset/www/src/mobile/js/app-mobile'
        }
    });

    require([
            'leerstandsmelder'
        ], function (leerstandsmelder) {
            angular.bootstrap(document, ['leerstandsmelder']);
        }
    );

})();