const lint = require('neutrino-middleware-eslint');
const merge = require('deepmerge');

module.exports = (neutrino, opts = {}) => {
  neutrino.use(lint, merge.all([
    {
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
          'babel/object-curly-spacing': ['error', 'always']
        }
      }
    },
    opts,
    !opts.include && !opts.exclude ? { include: [neutrino.options.source], exclude: [neutrino.options.static] } : {}
  ]));
};
