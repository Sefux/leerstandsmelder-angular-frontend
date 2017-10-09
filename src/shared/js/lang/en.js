'use strict';

module.exports = {
    generel: {
        yes: 'Yes',
        no: 'No',
    },
    actions: {
        cancel: 'Cancel',
        choose_images: 'You may choose one or more image to add to this entry.',
        choose_image: 'Add an image to this entry.',
        choose_camera: 'Camera',
        choose_library: 'Library',
        delete: 'Delete',
        dont_show_again: 'Don\'t show again',
        edit: 'Edit',
        edit_details: 'Edit details',
        next: 'Next',
        ok: 'OK',
        previous: 'Previous',
        show: 'View',
        submit: 'Submit',
        take_picture: 'Take a Picture',
        use_slider: 'Use the slider',
        abort: 'Abort'
    },
    table: {
        rowsPerPage: 'Rows per page',
        pageOf: 'of'
    },
    admin:{
        dashboard: 'Dashboard',
        menu: 'Menu'
    },
    menu: {
        admin: 'Administration',
        map: 'Map',
        user: 'User'
    },
    asset: {
        file: 'Datei'
    },
    author: {
        author: 'Author',
        by: 'by',
        created: 'Created',
        in: 'in',
        on: 'on',
        updated: 'Updated'
    },
    captcha: {
        enter_captcha: 'Enter the code'
    },
    comments: {
        all: 'Comments',
        manage_comments: 'Manage comments',
        comment: 'Comment',
        comment_plural: 'Comments',
        comment_text: 'Comment text',
        new_comment: 'New Comment',
        new_comment_login: 'Log in to post a new comment.',
        no_comments: 'No Comments',
        body: 'Message',
        hidden: 'Hide comment',
        created: 'Created'
    },
    creator: {
        tabs: {
            admin: 'Admin',
            details: 'Details',
            info: 'Add art work',
            location: 'Location',
            preview: 'Preview'
        }
    },
    errors: {
        access_denied: 'You are not allowed to perform this action.',
        authorization_failed: 'Login failed.',
        location: {
            'no_data': 'Location could not be loaded.'
        },
        region: {
            'no_data': 'Region could not be loaded.'
        },
        unknown: 'An unknown error occurred.',
        noconnection: 'The app could not reach the server. Try again later.',
        critical: {
          title: 'Critical error',
          resolve: 'Ok, try again?'
        },
        users: {
            confirmation_failed: 'Confirmation failed. This link might already be used.',
            email_exists: 'This email is already registered.',
            invalid_email: 'Invalid email.',
            password_confirm_mismatch: 'Passwords do not match.',
            password_too_short: 'Password is too short (min. 8 characters).',
            reset_failed: 'Password reset failed. This link is invalid and may have already been used.',
            too_many_failed_logins: 'Too many failed logins. Please try again in five minutes.'
        }
    },
    successes: {
      user: {
        login: 'You are now logged in.',
        logout: 'You have been logged out.'
      }  
    },
    photos: {
        remove_confirm_title: 'Delete image?',
        remove_confirm_body: 'Are you sure that you want to delete this image?',
        remove_success: 'Image has been deleted.',
        gpsfromphoto: 'Updated GPS coordinats from your photo.'
    },
    locations: {
        address: 'Address',
        artwork_type: 'Art work type',
        artwork_type_options: {
            mural: 'Pizza/Mural/Wall painting',
            tag: 'OZ tag',
            parole: 'Parole',
            kringel: 'Loop/spiral',
            piece: 'OZ-Piece',
            smiley: 'Smiley',
            for_oz: 'For OZ',
            line: 'Dottes/line/abstract one color',
            others: 'other Tags'
        },
        city: 'City',
        create_new: 'Submit art work',
        degree: 'State of decomposition',
        degree_options: {
            complete: 'well preserved ',
            partial: 'weather-beaten',
            sprayed: 'oversprayed',
            buffed: 'buffed'
        },
        description: 'Description',
        demolished: 'Demolished',
        demolished_yes: 'Yes',
        demolition_options: {
            rumor: 'Rumored',
            demolished: 'Demolished'
        },
        demolition_rumor: 'Rumors of Demolition',
        demolition_rumor_yes: 'Yes',
        edit: 'Edit location',
        artwork_for: 'Year of origin',
        artwork_since_options: {
            before_2010: 'before 2010',
            before_2000: 'before 2000',
            before_1990: 'before 1990',
            since_2011: 'since 2011',
            recently: 'just recently',
            min_five_years: 'at least 5 years',
            min_three_years: 'at least 3 years',
            min_one_year: 'at least a year',
            about_half_year: 'about half a year',
            less_than_one_quarter_year: 'less than one quarter of 1 year',
            less_than_one_half_year: 'less than one half of 1 year',
            less_than_three_quarters_year: 'less than three quarters of 1 year',
            less_than_one_year: 'less than 1 year',
            more_than_ten_years: 'more than 10 years',
            one_quarter: 'one quarter',
            one_half: 'one half',
            three_quarters: 'three quarters',
            year: 'year',
            year_plural: 'years',
            and: 'and'
        },
        help: {
            info: 'Enter a description for this art work.',
            photo: 'Upload a photo of this art work. Choose one or more photos from your computer. They will be shown here. By saving this entry they will be uploaded.',
            location: 'Enter an address and the map should update after a short moment. You can drag the marker on the map to update the address.',
            details: 'Fill out those details that you know about the art work. If you do not know something, just leave it blank.',
            admin: 'Set this Asset to "Hidden" to prevent non-administrators from seeing it.'
        },
        hidden: 'Hidden',
        hidden_yes: 'Yes',
        location: 'Art work',
        location_photos: 'Photos for this art work',
        location_plural: 'Art work',
        locations_by_region: 'Art works by Region',
        my_locations: 'My Locations',
        no_recent_activity: 'No Recent Activity',
        none_found: 'No locations found.',
        owner: 'Owner',
        owner_options: {
            private: 'Private',
            business: 'Business',
            public: 'Public',
            city: 'City'
        },
        postcode: 'Postal code',
        recent_activity: 'Latest Activity',
        remove_confirm_title: 'Delete Art work',
        remove_confirm_body: 'This action cannot be undone. Are you sure?',
        remove_success: 'Location deleted',
        search: 'Search',
        street: 'Street',
        title: 'Title',
        unknown: 'Unknown'
    },
    messages: {
        answer_message: 'Reply to Message',
        create_message: 'Create Message',
        message: 'Message',
        message_text: 'Message text',
        my_messages: 'Messages',
        sent: 'Sent',
        to: 'To',
        from: 'From',
        comments: {
            create_success: 'Comment successfully posted.'
        },
        locations: {
            create_success: 'Spot created successfully.',
            update_success: 'Spot updated successfully.'
        },
        users: {
            confirmation_success: 'Successfully confirmed! You are now logged in.',
            create_success: 'Your registration was successful. Please check your emails for the confirmation link!',
            request_reset_success: 'Password reset requested. You should now get an email containing a link to reset your password.',
            reset_success: 'You are now logged in and may change your password.',
            update_success: 'Account was successfully updated.'
        }
    },
    popups: {
        relaunch: {
            title: 'Relaunch!'
        }
    },
    posts: {
        edit_post: 'Edit Post',
        manage_posts: 'Manage Posts',
        post: 'Post',
        post_plural: 'Posts',
        site_post_plural: 'Page content',
        title: 'Title',
        update_success: 'Post updated successfully.',
        create_post: 'Create post',
        slug: 'Slug URL',
	    static: 'Static side'
    },
    regions: {
        settings: 'Settings',
        hide_message: 'Message if Region is hidden',
        latitude: 'Latitude',
        longitude: 'Longitude',
        manage_regions: 'Manage Regions',
        create_regions: 'Create region',
        region: 'Region',
        region_plural: 'Regions',
        set_hide: 'Hide this Region',
        set_moderate: 'Moderate this Region',
        title: 'Title',
        update_success: 'Region updated successfully.',
        zoom: 'Zoom',
        count: 'Count',
        created: 'Created',
        updated: 'Updated',
    },
    site: {
        banned: 'Banned',
        copyright_notice: '© 2017 city-of-oz.hamburg',
        map_notice: 'Maps: © OpenStreetMap contributors, ODbL 1.0.',
        lang: 'Language',
        lang_de: 'Deutsch',
        lang_en: 'English',
        latest_posts: 'Recent Posts',
        no_latest_posts: 'No Recent Posts',
        no: 'No',
        subnav: {
            about: 'About',
            developers: 'Developers',
            feedback: 'Feedback',
            howto: 'Howto',
            imprint: 'Imprint',
            index: 'City index',
            press: 'Press',
            terms: 'Terms'
        },
        title: 'City of OZ'
    },
    users: {
        manage_users: 'Manage users',
        create_user: 'Create user',
        admin_edit: 'Edit user',
        admin_create: 'Create user',
        anonymous: 'Not logged in',
        email: 'Email',
        forgot: 'Forgot Password',
        logout: 'Logout',
        password: 'Password',
        password_confirm: 'Confirm Password',
        settings: 'Settings',
        signup: 'Sign up',
        username: 'Username',
        login: 'Login',
        message_me: 'Other Users can send me messages via city-of-oz.',
        notify: 'Send me an Email when my entries are updated or other users send me a message.',
        register_message: 'Register now!',
        all: 'All users',
	    confirmed: "Confirmed",
	    blocked: "Blocked",
	    last_login: "Last login",
        failed_logins: "Failed logins",
        scope: "Scopes",
	    created: 'Created'
    }
};