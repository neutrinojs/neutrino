const lint = require('neutrino-middleware-eslint');
const { join } = require('path');

module.exports = neutrino => neutrino.use(lint, {
  include: [join(process.cwd(), 'SRC')],
  eslint: {
    baseConfig: {
      extends: ['airbnb-base']
    },
    rules: {
      // handled by babel rules
      'new-cap': 'off',

      // handled by babel rules
      'object-curly-spacing': 'off',

      // require a capital letter for constructors
      'babel/new-cap': ['error', { newIsCap: true }],

      // require padding inside curly braces
      'babel/object-curly-spacing': ['error', 'always'],

      // guard against awaiting async functions inside of a loop
      'babel/no-await-in-loop': 'error'
    }
  }
});
