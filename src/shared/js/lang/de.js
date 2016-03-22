/* global define */

define([], function () {
    return {
        actions: {
            cancel: 'Abbrechen',
            delete: 'Löschen',
            next: 'Weiter',
            previous: 'Zurück',
            show: 'Ansehen',
            submit: 'Absenden'
        },
        asset: {
            description: 'Beschreibung',
            title: 'Titel'
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
            no_photos: 'Keine Bilder',
            none_found: 'Keine Leerstände gefunden.',
            owner: 'Eigentümer',
            postcode: 'Postleitzahl',
            recent_activity: 'Neueste Leerstände',
            search: 'Suchen',
            street: 'Straße',
            title: 'Titel',
            unknown: 'Unbekannt'
        },
        site: {
            banned: 'Gesperrt',
            lang: 'Sprache',
            lang_de: 'Deutsch',
            lang_en: 'English',
            latest_posts: 'Neueste Einträge',
            no_latest_posts: 'Keine Neuesten Einträge',
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