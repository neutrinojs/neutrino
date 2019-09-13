/* eslint-disable */
import Neutrino from 'neutrino';

// Just for type-checking
/** @type {string}                              | */ let isString;
/** @type {string | undefined}                  | */ let isStringOrUndefined;
/** @type {string[] | undefined}                | */ let isArrayOfStringOrUndefined;
/** @type {boolean}                             | */ let isBoolean;
/** @type {boolean | undefined}                 | */ let isBooleanOrUndefined;
/** @type {Neutrino.Options}                    | */ let isOptions;
/** @type {import('webpack-chain')}             | */ let isConfig;

/**
 * @type {import('neutrino').Options}
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
isArrayOfStringOrUndefined = neutrino.options.extensions;
isBooleanOrUndefined = neutrino.options.debug;
isOptions = neutrino.options;
isStringOrUndefined = neutrino.options.output;
isStringOrUndefined = neutrino.options.source;
isStringOrUndefined = neutrino.options.tests;
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

// With custom options
/**
 * @type {import('neutrino').Options & { alpha: string, beta: boolean }}
 */
const customOptions = {
  alpha: 'string',
  beta: true,
};
const customNeutrino = new Neutrino(customOptions);

isString = customNeutrino.options.alpha;
isBoolean = customNeutrino.options.beta;
