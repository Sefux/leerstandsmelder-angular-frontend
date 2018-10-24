'use strict';

module.exports = {
    generel: {
        yes: 'Ja',
        no: 'Nein',
    },
    actions: {
        cancel: 'Abbrechen',
        choose_images: 'Wähle eines oder mehrere Bilder aus, welche Du zu diesem Eintrag hinzufügen möchtest.',
        choose_image: 'Füge ein Bild zu diesem Eintrag hinzu.',
        choose_camera: 'Kamera',
        choose_photo: 'Wähle ein Foto aus',
        choose_library: 'Library',
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
        use_slider: 'Benutze den Schieberegler',
        abort: 'Abbrechen',
        close: 'Schliessen',
        more: 'Weitere Einträge laden',
        back: 'Zurück'
    },
    table: {
        rowsPerPage: 'Einträge pro Seite',
        pageOf: 'von'
    },
    admin:{
        dashboard: 'Dashboard',
        menu: 'Menü'
    },
    menu: {
        admin: 'Administration',
        map: 'Karte',
        user: 'Benutzer'
    },
    assets: {
        file: 'Datei',
        choose_images: 'Foto auswählen'
    },
    author: {
      author: 'Autor',
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
        all: 'Kommentare',
        manage_comments: 'Kommentare verwalten',
        update_comment: 'Kommentar verwalten',
        comment: 'Kommentar',
        comment_plural: 'Kommentare',
        comment_text: 'Kommentartext',
        new_comment: 'Neuer Kommentar',
        new_comment_login: 'Melde Dich an, um einen neuen Kommentar zu schreiben.',
        no_comments: 'Keine Kommentare',
        body: 'Nachricht',
        hidden: 'Kommentar ausblenden',
        created: 'Erstellt',
        remove_confirm_title: 'Kommentar ausblenden?',
        remove_confirm_body: 'Bist du dir wirklich ganz sicher das du den Kommentar verstecken willst?',

    },
    creator: {
        tabs: {
            admin: 'Verwaltung',
            details: 'Details',
            info: 'Werk eintragen',
            location: 'Ort',
            preview: 'Vorschau'
        }
    },
    errors: {
        access_denied: 'Du hast keine Berechtigung, um diese Aktion auszuführen.',
        authorization_failed: 'Anmeldung fehlgeschlagen.',
        location: {
            'no_data': 'Werke konnte nicht geladen werden.'
        },
        region: {
            'no_data': 'Region konnte nicht geladen werden.'
        },
        unknown: 'Ein unbekannter Fehler ist aufgetreten.',
        noconnection: 'Die Anwendung konnte keine Verbindung zum Server herstellen. Probiere es zu einem späteren Zeitpunkt noch einmal.',
        critical: {
          title: 'Mieser Fehler',
          resolve: 'Ok, neu starten?'
        },
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
    successes: {
      user: {
        login: 'Du hast dich erfolgreich angemeldet.',
        logout: 'Du hast dich erfolgreich abgemeldet.'
      }
    },
    photos: {
        remove_confirm_title: 'Bild löschen?',
        remove_confirm_body: 'Bist du dir wirklich ganz sicher das du das Bild löschen willst?',
        remove_success: 'Das Bild wurde gelöscht',
        gpsfromphoto: 'GPS Koordinaten wurden aus dem Foto übernommen.'
    },
    locations: {
        manage_locations: 'Leerstände verwalten',
        gallery: 'Galerie',
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
            line: 'Punkte/Linien/abstrakt einfarbig',
            others: 'andere Tags'
        },
        city: 'Stadt',
        create_new: 'Werk eintragen',
        update_location: 'Werk aktualisieren',
        degree: 'Zustand des Werkes',
        degree_options: {
            complete: 'gut erhalten',
            partial: 'verwittert',
            sprayed: 'übersprüht',
            buffed: 'gebuffed'
        },
        demolished: 'Zerstört',
        demolished_yes: 'Ja',
        demolition_options: {
            rumor: 'Gerüchte',
            demolished: 'Abgerissen'
        },
        demolition_rumor: 'Abrissgerüchte',
        demolition_rumor_yes: 'Ja',
        description: 'Beschreibung',
        edit: 'Werk bearbeiten',
        artwork_for: 'Entstehungsjahr',
        artwork_since_options: {
            recently: 'Kurzem',
            before_2010: 'vor 2010',
            before_2000: 'vor 2000',
            before_1990: 'vor 1990',
            since_2011: 'seit 2011',
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
            photo: 'Lade Fotos von diesem Werk hoch. Wähle eines oder mehrer Fotos von deinem Computer aus. Diese werden dir daraufhin angezeigt. Durch speichern des Eintrag werden sie hochgeladen.',
            info: 'Gib hier eine Beschreibung für dieses Werk ein.',
            location: 'Gib eine Adresse ein und die Karte sollte sich nach einem kurzen Moment aktualisieren. Du kannst den Marker auf der Karte ziehen, um damit die Adresse zu aktualisieren.',
            details: 'Trag ein, welche Details dir über das Werk bekannt sind. Wenn Du etwas nicht weißt, lass es einfach unausgewählt.',
            admin:'Setz das Häkchen auf "Ausgeblendet" um es für nicht-Administratoren unsichtbar zu machen.'
        },
        hidden: 'Ausgeblendet',
        hidden_yes: 'Ja',
        location: 'Werk',
        location_photos: 'Fotos zu diesem Werk',
        location_plural: 'Werke',
        locations_by_region: 'Werke nach Region',
        my_locations: 'Meine Spots',
        no_recent_activity: 'Keine Spots',
        none_found: 'Keine Spots gefunden.',
        owner: 'Eigentümer',
        owner_options: {
            private: 'Privat',
            business: 'Gewerblich',
            public: 'Öffentlich',
            city: 'Stadt'
        },
        postcode: 'Postleitzahl',
        recent_activity: 'Neueste Fotos',
        remove_confirm_title: 'Spot löschen',
        remove_confirm_body: 'Diese Aktion kann nicht rückgängig gemacht werden. Bist Du sicher?',
        remove_success: 'Spot wurde gelöscht',
        search: 'Suchen',
        street: 'Straße',
        title: 'Titel',
        unknown: 'unbekannt/sonstiges',
        multiple: {
          create: 'Verzeichnisse eintragen',
          help: 'Lade Fotos von verschiedenen Werken hoch. Wähle eines oder mehrer Fotos von deinem Computer aus. Diese werden dir daraufhin angezeigt. Durch speichern wird für jedes Foto ein Werk-Eintrag erstellt.',
          select_all: 'Attribute für alle Einträge setzen:'
        }
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
            create_success: 'Spot erfolgreich eingetragen.',
            update_success: 'Spot erfolgreich aktualisiert.'
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
        create_post: 'Eintrag erstellen',
      slug: 'Kurzform URL',
      static: 'Statische Seite'
    },
    regions: {
        settings: 'Einstellungen',
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
        count: 'Anzahl',
        created: 'Erstelllt',
        updated: 'Aktualisiert',
    },
    site: {
        banned: 'Gesperrt',
        copyright_notice: '© 2018 city-of-oz.hamburg',
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
            terms: 'AGB',
            dataprotection: 'Datenschutz'
        },
        title: 'City of OZ'
    },
    users: {
        manage_users: 'Nutzer*innen verwalten',
        create_user: 'Nutzer*innen erstellen',
        admin_edit: 'Nutzer*innen bearbeiten',
        admin_create: 'Nutzer*innen erstellen',
        anonymous: 'Nicht eingeloggt',
        email: 'E-Mail',
        forgot: 'Passwort vergessen',
        logout: 'Abmelden',
        password: 'Passwort',
        password_confirm: 'Passwort bestätigen',
        settings: 'Einstellungen',
        signup: 'Registrieren',
        username: 'Benutzername',
        login: 'Anmelden',
        message_me: 'Andere Nutzer*innen können mir Nachrichten auf City-of-OZ schicken.',
        notify: 'Benachrichtige mich per Email wenn meine Einträge geupdatet werden oder Nachrichten angekommen sind.',
        register_message: 'Registriere Dich!',
        all: 'Alle Nutzer*innen',
        confirmed: "Bestättigt",
        blocked: "Blockiert",
        last_login: "Letzter login",
        failed_logins: "Fehlgeschlagene Logins",
        scope: "Berechtigungen",
        created: 'Angemeldet',
        accept_terms: 'Ich habe die AGB gelesen und erkläre mich mit diesen einverstanden.',
        terms: 'Allgemeine Geschäftsbedingungen'
    }
};
