#! /usr/bin/env node

const npm = require('npm');

const REGISTRY = 'http://localhost:4873';
const email = 'test@neutrino.js.org';
const username = 'neutrino';
const password = 'neutrino';

npm.load({}, err => {
  if (err) {
    throw err;
  }

  const auth = { username, password, email };

  npm.config.set('registry', REGISTRY, 'user');
  npm.config.set('email', email, 'user');
  npm.registry.adduser(REGISTRY, { auth }, (err, doc) => {
    if (err) {
      throw err;
    }

    if (!doc || !doc.token) {
      throw new Error('No auth token');
    }

    npm.config.setCredentialsByURI(REGISTRY, { token: doc.token });
    npm.config.save('user', err => {
      if (err) {
        throw err;
      }
    })
  });
});
