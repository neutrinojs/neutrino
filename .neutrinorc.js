const airbnb = require('./packages/airbnb');

module.exports = {
  options: {
    root: __dirname,
  },
  use: [
    airbnb({
      // See the package.json `lint` script for which files are linted.
      // Excludes are managed via `.eslintignore`.
      eslint: {
        baseConfig: {
          extends: [
            'plugin:prettier/recommended',
            'prettier/babel',
            'prettier/react',
          ],
          env: {
            browser: true,
            jest: true,
            mocha: true,
            node: true,
          },
          rules: {
            'prettier/prettier': [
              'error',
              {
                singleQuote: true,
                jsxBracketSameLine: true,
                trailingComma: 'all',
                proseWrap: 'always',
              },
            ],
            // Allow using console since most of the code in this repo isn't run in a browser.
            'no-console': 'off',
            // Allowing shadowing variable that share the same context as the outer scope
            'no-shadow': 'off',
          },
          overrides: [
            {
              files: [
                'packages/create-project/commands/init/templates/**',
                'packages/create-project/commands/init/templates/*/.*.js',
              ],
              rules: {
                // The dependencies in create-project's templates are installed by
                // by create-project and so are expected to be missing from package.json.
                'import/no-extraneous-dependencies': 'off',
              },
            },
            {
              files: [
                'packages/create-project/commands/init/templates/preact/**',
              ],
              settings: {
                react: {
                  pragma: 'h',
                },
              },
              rules: {
                // With Preact the use of `class` is recommended over `className`,
                // so we have to add `class` to the ignore list, to prevent:
                // `Unknown property 'class' found, use 'className' instead`
                'react/no-unknown-property': ['error', { ignore: ['class'] }],
              },
            },
            {
              files: ['packages/*/test/*'],
              rules: {
                // The tests need to do non-global require() to test the presets.
                'global-require': 'off',
                // This rule doesn't handle devDependencies being defined
                // in the monorepo root package.json.
                'import/no-extraneous-dependencies': 'off',
              },
            },
          ],
        },
      },
    }),
    (neutrino) => {
      neutrino.register('prettierrc', (neutrino) => {
        const handler = neutrino.outputHandlers.get('eslintrc');
        const eslintConfig = handler(neutrino);

        return eslintConfig.rules['prettier/prettier'][1];
      });
    },
  ],
};
