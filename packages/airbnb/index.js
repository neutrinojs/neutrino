const lint = require('@neutrinojs/eslint');
const { merge: eslintMerge } = require('eslint/lib/config/config-ops');
const { rules: airbnbBaseStyle } = require('eslint-config-airbnb-base/rules/style');
const { rules: airbnbBaseBestPractices } = require('eslint-config-airbnb-base/rules/best-practices');

module.exports = (neutrino, { eslint = {}, ...opts } = {}) => {
  neutrino.use(lint, {
    ...opts,
    eslint: {
      ...eslint,
      baseConfig: eslintMerge(
        {
          extends: [require.resolve('eslint-config-airbnb')],
          rules: {
            // Disable rules for which there are eslint-plugin-babel replacements:
            // https://github.com/babel/eslint-plugin-babel#rules
            'new-cap': 'off',
            'no-invalid-this': 'off',
            'object-curly-spacing': 'off',
            'semi': 'off',
            'no-unused-expressions': 'off',
            // Ensure the replacement rules use the options set by airbnb rather than ESLint defaults.
            'babel/new-cap': airbnbBaseStyle['new-cap'],
            'babel/no-invalid-this': airbnbBaseBestPractices['no-invalid-this'],
            'babel/object-curly-spacing': airbnbBaseStyle['object-curly-spacing'],
            'babel/semi': airbnbBaseStyle.semi,
            'babel/no-unused-expressions': airbnbBaseBestPractices['no-unused-expressions']
          },
          settings: {
            react: {
              // https://github.com/yannickcr/eslint-plugin-react#configuration
              // This is undocumented, but equivalent to "latest version".
              version: '999.999.999'
            }
          }
        },
        eslint.baseConfig || {}
      )
    }
  });
};
