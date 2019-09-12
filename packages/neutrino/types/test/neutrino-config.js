/* eslint-disable */
/**
 * @type {import('neutrino').Middleware}
 */
const middleware = neutrino => {
  neutrino.config.mode('development');
};

/**
 * @type {import('neutrino').Configuration}
 */
const config = {
  options: {
    debug: false,
    extensions: ['string'],
    mains: {
      index: 'index',
      other: {
        page: 'string',
      },
    },
    output: 'string',
    packageJson: 'string',
    root: 'string',
    source: 'string',
    tests: 'string',
  },
  use: [
    middleware, //fn
    process.env.NODE_ENV === 'development' ? middleware : false,
    neutrino => {
      neutrino.options.debug;
      neutrino.config.mode('development');
      neutrino.regexFromExtensions().test('example');
    },
  ],
};

module.exports = config;
