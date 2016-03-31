/* global define */

define([], function () {
    return {
        actions: {
            cancel: 'Abbrechen',
            choose_images: 'Wähle eines oder mehrere Bilder aus, welche Du zu diesem Eintrag hinzufügen möchtest.',
            delete: 'Löschen',
            edit: 'Bearbeiten',
            edit_details: 'Details bearbeiten',
            next: 'Weiter',
            previous: 'Zurück',
            show: 'Ansehen',
            submit: 'Absenden',
            take_picture: 'Mach ein Foto',
            use_slider: 'Benutze den Schieberegler'
        },
        assets: {
            file: 'Datei'
        },
        author: {
            by: 'von',
            created: 'Erstellt',
            in: 'in',
            on: 'am',
            updated: 'Aktualisiert'
        },
        captcha: {
            enter_captcha: 'Gib den Code ein'
        },
        comments: {
            comment: 'Kommentar',
            comment_plural: 'Kommentare',
            comment_text: 'Kommentartext',
            new_comment: 'Neuer Kommentar',
            new_comment_login: 'Melde Dich an, um einen neuen Kommentar zu schreiben.',
            no_comments: 'Keine Kommentare'
        },
        creator: {
            tabs: {
                details: 'Details',
                info: 'Info',
                location: 'Ort',
                preview: 'Vorschau'
            }
        },
        errors: {
            access_denied: 'Du hast keine Berechtigung, um diese Aktion auszuführen.',
            authorization_failed: 'Anmeldung fehlgeschlagen.',
            unknown: 'Ein unbekannter Fehler ist aufgetreten.',
            users: {
                confirmation_failed: 'Bestätigung fehlgeschlagen. Möglicherweise wurde dieser Link bereits verwendet.',
                email_exists: 'E-Mail Adresse ist bereits registriert.',
                invalid_email: 'Ungültige E-Mail Adresse',
                password_confirm_mismatch: 'Passwörter stimmen nicht überein.',
                password_too_short: 'Passwort ist zu kurz (min. 8 Zeichen).',
                reset_failed: 'Passwort Zurücksetzen fehlgeschlagen. Dieser Link ist nicht (mehr) gültig.',
                too_many_failed_logins: 'Zu viele fehlgeschlagene Anmeldungen. Versuche es in fünf Minuten wieder.'
            }
        },
        locations: {
            address: 'Adresse',
            building_type: 'Gebäudeart',
            building_type_options: {
                residential: 'Wohngebäude',
                commercial: 'Gewerblich',
                industrial: 'Industriell',
                historical: 'Historisch',
                public_work: 'Öffentlich'
            },
            city: 'Stadt',
            create_new: 'Leerstand melden',
            degree: 'Grad des Leerstands',
            degree_options: {
                complete: 'Vollständig',
                partial: 'Teilweise'
            },
            demolition_rumor: 'Abrissgerüchte',
            demolition_rumor_yes: 'Ja',
            description: 'Beschreibung',
            edit: 'Leerstand bearbeiten',
            empty_for: 'Leer seit',
            empty_options: {
                recently: 'Kurzem',
                min_five_years: 'wenigstens fünf Jahren',
                min_three_years: 'wenigstens drei Jahren',
                min_one_year: 'wenigstens einem Jahr',
                about_half_year: 'ungefähr einem haben Jahr',
                less_than_one_quarter_year: 'weniger als ein viertel Jahr',
                less_than_one_half_year: 'wengier als ein halbes Jahr',
                less_than_three_quarters_year: 'weniger als ein dreiviertel Jahr',
                less_than_one_year: 'weniger als ein Jahr',
                more_than_ten_years: 'mehr als zehn Jahre',
                one_quarter: 'ein viertel',
                one_half: 'one halbes',
                three_quarters: 'dreiviertel',
                year: 'Jahr',
                year_plural: 'Jahre',
                and: 'und'
            },
            help: {
                info: 'Gib hier einen aussagekräftigen Titel und eine Beschreibung für diesen Leerstand ein.',
                location: 'Gib eine Adresse ein und die Karte sollte sich nach einem kurzen Moment aktualisieren. Du kannst den Marker auf der Karte ziehen, um damit die Adresse zu aktualisieren.',
                details: 'Trag ein, welche Details dir über den Leerstand bekannt sind. Wenn Du etwas nicht weißt, lass es einfach unausgewählt.'
            },
            location: 'Leerstand',
            location_photos: 'Fotos zu diesem Leerstand',
            location_plural: 'Leerstände',
            locations_by_region: 'Leerstände nach Region',
            my_locations: 'Meine Leerstände',
            no_recent_activity: 'Keine Leerstände',
            none_found: 'Keine Leerstände gefunden.',
            owner: 'Eigentümer',
            owner_options: {
                private: 'Privat',
                business: 'Gewerblich',
                public: 'Öffentlich',
                city: 'Stadt'
            },
            postcode: 'Postleitzahl',
            recent_activity: 'Neueste Leerstände',
            search: 'Suchen',
            street: 'Straße',
            title: 'Titel',
            unknown: 'Unbekannt'
        },
        messages: {
            comments: {
                create_success: 'Kommentar erfolgreich gespeichert.'
            },
            locations: {
                create_success: 'Leerstand erfolgreich eingetragen.',
                update_success: 'Leerstand erfolgreich aktualisiert.'
            },
            users: {
                confirmation_success: 'Deine E-Mail wurde erfolgreich bestätigt. Du bist jetzt eingeloggt!',
                create_success: 'Deine Registrierung war erfolgreich. Du solltest jetzt eine E-Mail mit einem Bestätigungslink erhalten.',
                request_reset_success: 'Du solltest nun eine E-Mail erhalten, die einen Link zum Zurücksetzen Deines Passworts enthält.',
                reset_success: 'Du bist nun eingeloggt und kannst Dein Passwort ändern.',
                update_success: 'Konto wurde erfolgreich aktualisiert.'
            }
        },
        popups: {
            relaunch: {
                title: 'Relaunch!'
            }
        },
        posts: {
            edit_post: 'Eintrag bearbeiten',
            title: 'Titel',
            update_success: 'Eintrag erfolgreich aktualisiert..'
        },
        regions: {
            region: 'Region'
        },
        site: {
            banned: 'Gesperrt',
            copyright_notice: '© 2016 Leerstandsmelder.de',
            map_notice: 'Karten: © OpenStreetMap contributors, ODbL 1.0',
            lang: 'Sprache',
            lang_de: 'Deutsch',
            lang_en: 'English',
            latest_posts: 'Neueste Einträge',
            no_latest_posts: 'Keine Neuesten Einträge',
            subnav: {
                about: 'Über uns',
                developers: 'Entwickler',
                feedback: 'Feedback',
                howto: 'So geht\'s',
                imprint: 'Impressum',
                index: 'Index',
                press: 'Presse',
                terms: 'AGB'
            },
            title: 'Leerstandsmelder'
        },
        users: {
            email: 'E-Mail',
            forgot: 'Passwort Vergessen',
            logout: 'Abmelden',
            password: 'Passwort',
            password_confirm: 'Passwort bestätigen',
            settings: 'Einstellungen',
            signup: 'Registrieren',
            username: 'Benutzername',
            login: 'Anmelden'
        }
    };
});