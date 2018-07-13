process.env.NODE_ENV = process.env.NODE_ENV || 'test';

require('neutrino')().mocha();
