/* global define */

define([], function () {
    return [

        //
        //
        // Site

        {
            route: '/',
            templateUrl: '/locations/region_map.html',
            controller: 'Regions.MapIndex'
        },
        {
            route: '/site/:slug',
            templateUrl: '/site/static_page.html',
            controller: 'Regions.StaticPage'
        },

        //
        //
        // Locations

        {
            route: '/locations/create',
            templateUrl: '/locations/create.html',
            controller: 'Locations.Create'
        },
        {
            route: '/locations/update/:uuid',
            templateUrl: '/locations/update.html',
            controller: 'Locations.Update'
        },
        {
            route: '/locations/:uuid',
            templateUrl: '/locations/show.html',
            controller: 'Locations.Show'
        },


        //
        //
        // Regions

        {
            route: '/regions',
            templateUrl: '/regions/region_map.html',
            controller: 'Regions.MapIndex'
        },
        {
            route: '/regions/:uuid',
            templateUrl: '/regions/show.html',
            controller: 'Regions.Show'
        },
        {
            route: '/admin/regions',
            templateUrl: '/regions/list.html',
            controller: 'Regions.List'
        },

        //
        //
        // Posts

        {
            route: '/posts/:uuid',
            templateUrl: '/posts/show.html',
            controller: 'Posts.Show'
        },
        {
            route: '/admin/posts',
            templateUrl: '/posts/list.html',
            controller: 'Posts.List'
        },
        {
            route: '/admin/posts/:uuid',
            templateUrl: '/posts/update.html',
            controller: 'Posts.Update'
        },

        //
        //
        // Users

        {
            route: '/users/create',
            templateUrl: '/users/create.html',
            controller: 'Users.Create'
        },
        {
            route: '/users/login',
            templateUrl: '/users/login.html',
            controller: 'Users.Login'
        },
        {
            route: '/users/me',
            templateUrl: '/users/update.html',
            controller: 'Users.Update'
        },
        {
            route: '/users/me/locations',
            templateUrl: '/locations/list.html',
            controller: 'Locations.User'
        },
        {
            route: '/users/logout',
            templateUrl: '/users/logout.html',
            controller: 'Users.Logout'
        },
        {
            route: '/users/forgot',
            templateUrl: '/users/forgot.html',
            controller: 'Users.Forgot'
        },
        {
            route: '/users/confirm/:token',
            templateUrl: '/users/confirm.html',
            controller: 'Users.Confirm'
        },
        {
            route: '/users/reset/:token',
            templateUrl: '/users/reset.html',
            controller: 'Users.Confirm'
        }
    ];
});