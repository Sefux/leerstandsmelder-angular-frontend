/* global define */

define([], function () {
    return {
        actions: {
            cancel: 'Cancel',
            delete: 'Delete',
            next: 'Weiter',
            previous: 'Zurück',
            show: 'View',
            submit: 'Submit'
        },
        address: {
            city: 'City',
            postcode: 'Postal Code',
            street: 'Street'
        },
        asset: {
            description: 'Description',
            title: 'Title'
        },
        author: {
            by: 'by',
            in: 'in',
            on: 'on'
        },
        comments: {
            comment: 'Comment',
            comment_plural: 'Comments',
            comment_text: 'Comment text',
            new_comment: 'New Comment',
            no_comments: 'No Comments'
        },
        creator: {
            tabs: {
                details: 'Details',
                info: 'Info',
                location: 'Location',
                preview: 'Preview'
            }
        },
        locations: {
            address: 'Address',
            building_type: 'Building Type',
            city: 'City',
            create_new: 'Submit location',
            degree: 'Degree of Emptiness',
            description: 'Description',
            demolition_rumor: 'Rumors of Demolition',
            edit: 'Edit Location',
            empty_for: 'Empty for',
            location: 'Location',
            location_plural: 'Locations',
            no_recent_activity: 'No Recent Activity',
            no_photos: 'No Photos',
            none_found: 'No locations found.',
            owner: 'Owner',
            recent_activity: 'Latest Activity',
            search: 'Search',
            title: 'Title',
            unknown: 'Unknown'
        },
        site: {
            banned: 'Banned',
            lang_en: 'English',
            latest_posts: 'Recent Posts',
            no_latest_posts: 'No Recent Posts',
            title: 'Leerstandsmelder',
            lang_de: 'Deutsch'
        },
        users: {
            email: 'Email',
            forgot: 'Forgot Password',
            logout: 'Logout',
            password: 'Password',
            password_confirm: 'Confirm Password',
            signup: 'Sign up',
            username: 'Username',
            login: 'Login'
        }
    };
});