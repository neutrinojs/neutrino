const merge = require('deepmerge');

module.exports = neutrino => {
  neutrino.use(require('neutrino-lint-base'));
  neutrino.config.module
    .rule('lint')
    .loader('eslint', props => merge(props, {
      options: {
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
    }));
};
