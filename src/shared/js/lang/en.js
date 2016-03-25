/* global define */

define([], function () {
    return {
        actions: {
            cancel: 'Cancel',
            choose_images: 'You may choose one or more image files or take a picture with your device\'s camera.',
            delete: 'Delete',
            edit: 'Edit',
            edit_details: 'Edit details',
            next: 'Weiter',
            previous: 'Zurück',
            show: 'View',
            submit: 'Submit',
            take_picture: 'Take a Picture',
            use_slider: 'Use the slider'
        },
        asset: {
            file: 'Datei'
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
        errors: {
            access_denied: 'You are not allowed to perform this action.',
            authorization_failed: 'Login failed.',
            unknown: 'An unknown error occurred.',
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
        locations: {
            address: 'Address',
            building_type: 'Building Type',
            building_type_options: {
                residential: 'Residential',
                commercial: 'Commercial',
                industrial: 'Industrial',
                historical: 'Historical',
                public_work: 'Public Work'
            },
            city: 'City',
            create_new: 'Submit location',
            create_success: 'Location successfully submitted',
            degree: 'Degree of Emptiness',
            degree_options: {
                complete: 'Complete',
                partial: 'Partial'
            },
            description: 'Description',
            demolition_rumor: 'Rumors of Demolition',
            demolition_rumor_yes: 'Yes',
            edit: 'Edit Location',
            empty_for: 'Empty for',
            empty_options: {
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
            location: 'Location',
            location_plural: 'Locations',
            no_recent_activity: 'No Recent Activity',
            none_found: 'No locations found.',
            owner: 'Owner',
            owner_options: {
                private: 'Private',
                business: 'Business',
                public: 'Public',
                city: 'City'
            },
            recent_activity: 'Latest Activity',
            search: 'Search',
            title: 'Title',
            unknown: 'Unknown'
        },
        messages: {
            users: {
                confirmation_success: 'Successfully confirmed! You are now logged in.',
                create_success: 'Your registration was successful. Please check your emails for the confirmation link!',
                request_reset_success: 'Password reset requested. You should now get an email containing a link to reset your password.',
                reset_success: 'You are now logged in and may change your password.',
                update_success: 'Account was successfully updated.'
            }
        },
        site: {
            banned: 'Banned',
            copyright_notice: 'Copyright 2016 Leerstandsmelder.de',
            lang: 'Language',
            lang_de: 'Deutsch',
            lang_en: 'English',
            latest_posts: 'Recent Posts',
            no_latest_posts: 'No Recent Posts',
            subnav: {
                about: 'About',
                developers: 'Developers',
                feedback: 'Feedback',
                howto: 'Howto',
                imprint: 'Imprint',
                press: 'Press',
                terms: 'Terms'
            },
            title: 'Leerstandsmelder'
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