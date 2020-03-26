module.exports = {
  options: {
    root: __dirname,
  },
  use: [
    (neutrino) => {
      neutrino.use('fake-preset');
    },
    process.env.NODE_ENV === 'development' && '@neutrinojs/eslint',
    [
      '@neutrinojs/airbnb-base',
      {
        eslint: {
          baseConfig: {
            rules: {
              semi: 'off',
            },
          },
        },
      },
    ],
    '@neutrinojs/node',
    process.env.NODE_ENV === 'test' && [
      '@neutrinojs/jest',
      {
        testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$',
      },
    ],
    (neutrino) => {
      neutrino.config.externals(/^[a-z\-0-9]+$/);
      neutrino.use('fake-preset', { alpha: 'beta' });
    },
  ],
};
