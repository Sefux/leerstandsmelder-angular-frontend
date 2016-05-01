# Leerstandsmelder Angular Frontend #

[![Dependency Status](https://gemnasium.com/Leerstandsmelder/leerstandsmelder-angular-frontend.svg)](https://gemnasium.com/Leerstandsmelder/leerstandsmelder-angular-frontend) [![bitHound Code](https://www.bithound.io/github/Leerstandsmelder/leerstandsmelder-angular-frontend/badges/code.svg)](https://www.bithound.io/github/Leerstandsmelder/leerstandsmelder-angular-frontend)

The Web and (coming soon) Phonegap frontend based on [AngularJS](https://angularjs.org/) for the [Leerstandsmelder](http://lm.htmhell.de) service.

## Web Frontend ##

The web app consists of static code only so you can just clone the repo, set the ``dist/web`` folder as the document root and it should work.

Since the app uses Angular in HTML5 mode, you need to make sure that every 404 not found error gets redirected to index.html. There's a bundled .htaccess so at least apache setup should be effortless.

### Development ###

Copy ``configuration.default.js`` to ``configuration.js`` and update as needed.
Copy ``phonegap.default.json`` to ``phonegap.json`` and update as needed (copy it even if you're not using it).

```shell
npm install
bower install
gulp
```

You need to run ``gulp watch-web-src`` to update the files used by the require.js runtime when developing. Use ``gulp watch-web`` to update all other files.

In addition you can use ``gulp web`` or ``gulp mobile`` to build a specific environment.


