'use strict';

module.exports = {
    actions: {
        cancel: 'Abbrechen',
        choose_images: 'Wähle eines oder mehrere Bilder aus, welche Du zu diesem Eintrag hinzufügen möchtest.',
        delete: 'Löschen',
        dont_show_again: 'Nicht mehr anzeigen',
        edit: 'Bearbeiten',
        edit_details: 'Details bearbeiten',
        next: 'Weiter',
        ok: 'OK',
        previous: 'Zurück',
        show: 'Ansehen',
        submit: 'Absenden',
        take_picture: 'Mach ein Foto',
        use_slider: 'Benutze den Schieberegler'
    },
    table: {
        rowsPerPage: 'Einträge pro Seite',
        pageOf: 'von'
    },
    admin:{
        dashboard: 'Dashboard'
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
            admin: 'Verwaltung',
            details: 'Details',
            info: 'Info',
            location: 'Ort',
            preview: 'Vorschau'
        }
    },
    errors: {
        access_denied: 'Du hast keine Berechtigung, um diese Aktion auszuführen.',
        authorization_failed: 'Anmeldung fehlgeschlagen.',
        location: {
            'no_data': 'Leerstand konnte nicht geladen werden.'
        },
        region: {
            'no_data': 'Region konnte nicht geladen werden.'
        },
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
        artwork_type: 'Werkart',
        artwork_type_options: {
            mural: 'Pizza/Mural/Wandbild',
            tag: 'OZ-Tag',
            parole: 'Parole',
            kringel: 'Kringel/Spirale',
            piece: 'OZ-Piece',
            smiley: 'Smiley',
            for_oz: 'Für OZ',
            line: 'Linien/Striche/abstrakt einfarbig',
            others: 'andere Tags / sonstiges'
        },
        city: 'Stadt',
        create_new: 'Werk eintragen',
        degree: 'Zustand des Werkes',
        degree_options: {
            complete: 'Vollständig erhalten',
            partial: 'Teilweise zerstört'
        },
        demolished: 'Buffed',
        demolished_yes: 'Ja',
        demolition_options: {
            rumor: 'Gerüchte',
            demolished: 'Abgerissen'
        },
        demolition_rumor: 'Abrissgerüchte',
        demolition_rumor_yes: 'Ja',
        description: 'Beschreibung',
        edit: 'Werk bearbeiten',
        artwork_for: 'Werk wurde erstellt',
        artwork_since_options: {
            recently: 'Kurzem',
            min_five_years: 'wenigstens fünf Jahren',
            min_three_years: 'wenigstens drei Jahren',
            min_four_years: 'wenigstens vier Jahren',
            min_six_years: 'wenigstens sechs Jahr',
            min_ten_years: 'wenigstens zehn Jahr',
            min_one_year: 'wenigstens einem Jahr',
            about_half_year: 'ungefähr einem halben Jahr',
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
            info: 'Gib hier einen aussagekräftigen Titel und eine Beschreibung für diesen Werk ein.',
            location: 'Gib eine Adresse ein und die Karte sollte sich nach einem kurzen Moment aktualisieren. Du kannst den Marker auf der Karte ziehen, um damit die Adresse zu aktualisieren.',
            details: 'Trag ein, welche Details dir über das Werk bekannt sind. Wenn Du etwas nicht weißt, lass es einfach unausgewählt.',
            admin:'Setz das Häkchen auf "Ausgeblendet" um es für nicht-Administratoren unsichtbar zu machen.'
        },
        hidden: 'Ausgeblendet',
        hidden_yes: 'Ja',
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
        remove_confirm_title: 'Leerstand löschen',
        remove_confirm_body: 'Diese Aktion kann nicht rückgängig gemacht werden. Bist Du sicher?',
        remove_success: 'Leerstand wurde gelöscht',
        search: 'Suchen',
        street: 'Straße',
        title: 'Titel',
        unknown: 'Unbekannt'
    },
    messages: {
        answer_message: 'Nachricht beantworten',
        create_message: 'Nachricht erstellen',
        message: 'Nachricht',
        message_text: 'Nachricht',
        my_messages: 'Nachrichten',
        sent: 'Gesendet',
        to: 'An',
        from: 'Von',
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
        manage_posts: 'Einträge verwalten',
        post: 'Eintrag',
        post_plural: 'Einträge',
        site_post_plural: 'Seiteninhalte',
        title: 'Titel',
        update_success: 'Eintrag erfolgreich aktualisiert..',
        create_post: 'Eintrag erstellen'
    },
    regions: {
        hide_message: 'Nachricht, wenn Region nicht angezeigt wird',
        latitude: 'Breitengrad',
        longitude: 'Längengrad',
        manage_regions: 'Regionen verwalten',
        create_regions: 'Region erstellen',
        region: 'Region',
        region_plural: 'Regionen',
        set_hide: 'Diese Region nicht anzeigen',
        set_moderate: 'Diese Region moderieren',
        title: 'Titel',
        update_success: 'Region erfolgreich aktualisiert.',
        zoom: 'Zoom',
        count: 'Anzahl'
    },
    site: {
        banned: 'Gesperrt',
        copyright_notice: '© 2016 city-of-oz.hamburg',
        map_notice: 'Karten: © OpenStreetMap contributors, ODbL 1.0',
        lang: 'Sprache',
        lang_de: 'Deutsch',
        lang_en: 'English',
        latest_posts: 'Neueste Einträge',
        no_latest_posts: 'Keine Neuesten Einträge',
        no: 'Nein',
        subnav: {
            about: 'Über uns',
            developers: 'Entwickler',
            feedback: 'Feedback',
            howto: 'So geht\'s',
            imprint: 'Impressum',
            index: 'Stadtindex',
            press: 'Presse',
            terms: 'AGB'
        },
        title: 'City of OZ'
    },
    users: {
        manage_users: 'Nutzer verwalten',
        create_user: 'Nutzer erstellen',
        admin_edit: 'Nutzer bearbeiten',
        admin_create: 'Nutzer erstellen',
        anonymous: 'Nicht eingeloggt',
        email: 'E-Mail',
        forgot: 'Passwort Vergessen',
        logout: 'Abmelden',
        password: 'Passwort',
        password_confirm: 'Passwort bestätigen',
        settings: 'Einstellungen',
        signup: 'Registrieren',
        username: 'Benutzername',
        login: 'Anmelden',
        message_me: 'Andere Nutzer können mir Nachrichten auf Leerstandsmelder schicken.',
        notify: 'Benachrichtige mich per Email wenn meine Einträge geupdatet werden oder Nachrichten angekommen sind.',
        register_message: 'Registriere Dich!',
        all: 'Alle Nutzer',
        confirmed: "Bestättigt",
        blocked: "Blockiert",
        last_login: "Letzter login",
        failed_logins: "Fehlgeschlagene Logins",
        scope: "Berechtigungen"
    }
};