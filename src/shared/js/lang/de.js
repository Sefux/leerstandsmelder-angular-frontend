/* global define */

define([], function () {
    return {
        actions: {
            cancel: 'Abbrechen',
            choose_images: 'Wähle eines oder mehrere Bilder aus, oder mache ein Bild mit einer am Gerät verfügbaren Kamera.',
            delete: 'Löschen',
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
            in: 'in',
            on: 'am'
        },
        comments: {
            comment: 'Kommentar',
            comment_plural: 'Kommentare',
            comment_text: 'Kommentartext',
            new_comment: 'Neuer Kommentar',
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
            city: 'Stadt',
            create_new: 'Leerstand melden',
            degree: 'Grad des Leerstands',
            demolition_rumor: 'Abrissgerüchte',
            description: 'Beschreibung',
            edit: 'Leerstand bearbeiten',
            empty_for: 'Leer seit',
            location: 'Leerstand',
            location_plural: 'Leerstände',
            no_recent_activity: 'Keine Leerstände',
            none_found: 'Keine Leerstände gefunden.',
            owner: 'Eigentümer',
            postcode: 'Postleitzahl',
            recent_activity: 'Neueste Leerstände',
            search: 'Suchen',
            street: 'Straße',
            title: 'Titel',
            unknown: 'Unbekannt'
        },
        messages: {
            users: {
                confirmation_success: 'Deine E-Mail wurde erfolgreich bestätigt. Du bist jetzt eingeloggt!',
                create_success: 'Deine Registrierung war erfolgreich. Du solltest jetzt eine E-Mail mit einem Bestätigungslink erhalten.',
                request_reset_success: 'Du solltest nun eine E-Mail erhalten, die einen Link zum Zurücksetzen Deines Passworts enthält.',
                reset_success: 'Du bist nun eingeloggt und kannst Dein Passwort ändern.',
                update_success: 'Konto wurde erfolgreich aktualisiert.'
            }
        },
        site: {
            banned: 'Gesperrt',
            copyright_notice: 'Copyright 2016 Leerstandsmelder.de',
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
            signup: 'Registrieren',
            username: 'Benutzername',
            login: 'Anmelden'
        }
    };
});