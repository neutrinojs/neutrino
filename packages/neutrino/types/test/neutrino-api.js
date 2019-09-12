/* eslint-disable */
import Neutrino from 'neutrino';

/**
 * @type {Neutrino.Options}
 */
const options = {
  debug: false,
  extensions: ['string', 'string'],
  mains: {
    entry: 'string',
    page: {
      entry: 'string',
    },
  },
  output: 'string',
  packageJson: 'string',
  root: 'string',
  source: 'string',
  tests: 'string',
};

const neutrino = new Neutrino(options);

neutrino.config.mode('development');
neutrino.options;
neutrino.options.debug;
neutrino.options.extensions;
neutrino.options.output;
neutrino.options.source;
neutrino.options.tests;
neutrino.options.mains;

if (neutrino.options.mains) {
  // string | object
  if (typeof neutrino.options.mains.entry === 'string') {
    neutrino.options.mains.entry.toLowerCase();
  }
  if (typeof neutrino.options.mains.page === 'object') {
    // string
    if (neutrino.options.mains.page.entry) {
      neutrino.options.mains.page.entry.toLowerCase();
    }
  }
}

neutrino.regexFromExtensions().test('example');
neutrino.use(api => {
  api.config.mode('development');
});
