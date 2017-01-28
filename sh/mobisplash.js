#!/usr/bin/env node

'use strict';

const mobisplash = require('mobisplash');

mobisplash('assets/images/splash/leerstandsmelder_splash.png', {
	platform: 'android',
	dest: 'assets/images/splash/android/',
	background: '#999999',
	contentRatio: 0.8
}).then(() => {
	// icons generated
	console.log('splashs for android generated');
});

mobisplash('assets/images/splash/leerstandsmelder_splash.png', {
	platform: 'ios',
	dest: 'assets/images/splash/ios/',
	background: '#999999',
	contentRatio: 0.8
}).then(() => {
	// icons generated
	console.log('splashs for ios generated');
});
