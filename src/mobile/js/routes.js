/* global define */

define([], function () {
    return [

        // Important: The routes are evaluated in this order so earlier routes have precedence!

        //
        //
        // Site

        {
            route: '/',
            templateUrl: '/android_asset/www/locations/region_map.html',
            controller: 'Regions.MapIndex'
        },
        {
            route: '/site/:slug',
            templateUrl: '/android_asset/www/site/static_page.html',
            controller: 'Site.StaticPage'
        },


        //
        //
        // Regions

        {
            route: '/regions',
            templateUrl: '/android_asset/www/regions/region_map.html',
            controller: 'Regions.MapIndex'
        },
        {
            route: '/regions/:uuid',
            templateUrl: '/android_asset/www/regions/show.html',
            controller: 'Regions.Show'
        },
        {
            route: '/admin/regions',
            templateUrl: '/android_asset/www/regions/list.html',
            controller: 'Regions.List'
        },
        {
            route: '/admin/regions/:uuid',
            templateUrl: '/android_asset/www/regions/update.html',
            controller: 'Regions.Update'
        },

        //
        //
        // Posts

        {
            route: '/posts/:uuid',
            templateUrl: '/android_asset/www/posts/show.html',
            controller: 'Posts.Show'
        },
        {
            route: '/admin/posts',
            templateUrl: '/android_asset/www/posts/list.html',
            controller: 'Posts.List'
        },
        {
            route: '/admin/posts/static',
            templateUrl: '/android_asset/www/posts/list_static.html',
            controller: 'Posts.ListStatic'
        },
        {
            route: '/admin/posts/create',
            templateUrl: '/android_asset/www/posts/update.html',
            controller: 'Posts.Update'
        },
        {
            route: '/admin/posts/:uuid',
            templateUrl: '/android_asset/www/posts/update.html',
            controller: 'Posts.Update'
        },

        //
        //
        // Users

        {
            route: '/users/create',
            templateUrl: '/android_asset/www/users/create.html',
            controller: 'Users.Create'
        },
        {
            route: '/users/login',
            templateUrl: '/android_asset/www/users/login.html',
            controller: 'Users.Login'
        },
        {
            route: '/users/me',
            templateUrl: '/android_asset/www/users/update.html',
            controller: 'Users.Update'
        },
        {
            route: '/users/me/locations',
            templateUrl: '/android_asset/www/locations/list.html',
            controller: 'Locations.User'
        },
        {
            route: '/users/me/messages',
            templateUrl: '/android_asset/www/messages/list.html',
            controller: 'Messages.List'
        },
        {
            route: '/users/logout',
            templateUrl: '/android_asset/www/users/logout.html',
            controller: 'Users.Logout'
        },
        {
            route: '/users/forgot',
            templateUrl: '/android_asset/www/users/forgot.html',
            controller: 'Users.Forgot'
        },
        {
            route: '/users/confirm/:token',
            templateUrl: '/android_asset/www/users/confirm.html',
            controller: 'Users.Confirm'
        },
        {
            route: '/users/reset/:token',
            templateUrl: '/android_asset/www/users/reset.html',
            controller: 'Users.Confirm'
        },

        //
        //
        // Regions

        {
            route: '/:uuid',
            templateUrl: '/android_asset/www/regions/show.html',
            controller: 'Regions.Show'
        },
        {
            route: '/admin/regions',
            templateUrl: '/android_asset/www/regions/list.html',
            controller: 'Regions.List'
        },

        //
        //
        // Messages

        {
            route: '/messages/create',
            templateUrl: '/android_asset/www/messages/create.html',
            controller: 'Messages.Create'
        },
        {
            route: '/messages/:uuid/reply',
            templateUrl: '/android_asset/www/messages/reply.html',
            controller: 'Messages.Reply'
        },

        //
        //
        // Locations

        {
            route: '/locations/index',
            templateUrl: '/android_asset/www/locations/region_index.html',
            controller: 'Locations.RegionIndex'
        },
        {
            route: '/locations/index/:region_uuid',
            templateUrl: '/android_asset/www/locations/region_index.html',
            controller: 'Locations.RegionIndex'
        },
        {
            route: '/locations/create',
            templateUrl: '/android_asset/www/locations/update.html',
            controller: 'Locations.Create'
        },
        {
            route: '/locations/update/:uuid',
            templateUrl: '/android_asset/www/locations/update.html',
            controller: 'Locations.Create'
        },
        {
            route: '/:region_uuid/:uuid',
            templateUrl: '/android_asset/www/locations/show.html',
            controller: 'Locations.Show'
        },
        {
            route: '/admin/regions/:region_uuid/locations',
            templateUrl: '/android_asset/www/locations/list.html',
            controller: 'Locations.RegionList'
        }

    ];
});