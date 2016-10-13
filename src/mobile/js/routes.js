'use strict';

module.exports = [

    // Important: The routes are evaluated in this order so earlier routes have precedence!

    //
    //
    // Site

    {
        route: '/',
        templateUrl: '../../www/locations/region_map.html',
        controller: 'Regions.MapIndex'
    },
    {
        route: '/site/:slug',
        templateUrl: '../../www/site/static_page.html',
        controller: 'Site.StaticPage'
    },


    //
    //
    // Regions

    {
        route: '/regions',
        templateUrl: '../../www/regions/region_map.html',
        controller: 'Regions.MapIndex'
    },
    {
        route: '/regions/:uuid',
        templateUrl: '../../www/regions/show.html',
        controller: 'Regions.Show'
    },
    {
        route: '/admin/regions',
        templateUrl: '../../www/regions/list.html',
        controller: 'Regions.List'
    },
    {
        route: '/admin/regions/:uuid',
        templateUrl: '../../www/regions/update.html',
        controller: 'Regions.Update'
    },

    //
    //
    // Posts

    {
        route: '/posts/:uuid',
        templateUrl: '../../www/posts/show.html',
        controller: 'Posts.Show'
    },
    {
        route: '/admin/posts',
        templateUrl: '../../www/posts/list.html',
        controller: 'Posts.List'
    },
    {
        route: '/admin/posts/static',
        templateUrl: '../../www/posts/list_static.html',
        controller: 'Posts.ListStatic'
    },
    {
        route: '/admin/posts/create',
        templateUrl: '../../www/posts/update.html',
        controller: 'Posts.Update'
    },
    {
        route: '/admin/posts/:uuid',
        templateUrl: '../../www/posts/update.html',
        controller: 'Posts.Update'
    },

    //
    //
    // Users

    {
        route: '/users/create',
        templateUrl: '../../www/users/create.html',
        controller: 'Users.Create'
    },
    {
        route: '/users/login',
        templateUrl: '../../www/users/login.html',
        controller: 'Users.Login'
    },
    {
        route: '/users/me',
        templateUrl: '../../www/users/update.html',
        controller: 'Users.Update'
    },
    {
        route: '/users/me/locations',
        templateUrl: '../../www/locations/list.html',
        controller: 'Locations.User'
    },
    {
        route: '/users/me/messages',
        templateUrl: '../../www/messages/list.html',
        controller: 'Messages.List'
    },
    {
        route: '/users/logout',
        templateUrl: '../../www/users/logout.html',
        controller: 'Users.Logout'
    },
    {
        route: '/users/forgot',
        templateUrl: '../../www/users/forgot.html',
        controller: 'Users.Forgot'
    },
    {
        route: '/users/confirm/:token',
        templateUrl: '../../www/users/confirm.html',
        controller: 'Users.Confirm'
    },
    {
        route: '/users/reset/:token',
        templateUrl: '../../www/users/reset.html',
        controller: 'Users.Confirm'
    },

    //
    //
    // Regions

    {
        route: '/:uuid',
        templateUrl: '../../www/regions/show.html',
        controller: 'Regions.Show'
    },
    {
        route: '/admin/regions',
        templateUrl: '../../www/regions/list.html',
        controller: 'Regions.List'
    },

    //
    //
    // Messages

    {
        route: '/messages/create',
        templateUrl: '../../www/messages/create.html',
        controller: 'Messages.Create'
    },
    {
        route: '/messages/:uuid/reply',
        templateUrl: '../../www/messages/reply.html',
        controller: 'Messages.Reply'
    },

    //
    //
    // Locations

    {
        route: '/locations/index',
        templateUrl: '../../www/locations/region_index.html',
        controller: 'Locations.RegionIndex'
    },
    {
        route: '/locations/index/:region_uuid',
        templateUrl: '../../www/locations/region_index.html',
        controller: 'Locations.RegionIndex'
    },
    {
        route: '/locations/create',
        templateUrl: '../../www/locations/update.html',
        controller: 'Locations.Create'
    },
    {
        route: '/locations/update/:uuid',
        templateUrl: '../../www/locations/update.html',
        controller: 'Locations.Create'
    },
    {
        route: '/:region_uuid/:uuid',
        templateUrl: '../../www/locations/show.html',
        controller: 'Locations.Show'
    },
    {
        route: '/admin/regions/:region_uuid/locations',
        templateUrl: '../../www/locations/list.html',
        controller: 'Locations.RegionList'
    }

];