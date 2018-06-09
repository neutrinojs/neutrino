module.exports = {
  use: [
    ['./packages/airbnb-base', {
      // See the package.json `lint` script for which files are linted.
      // Excludes are managed via `.eslintignore`.
      eslint: {
        baseConfig: {
          extends: [
            'prettier'
          ]
        },
        envs: ['browser', 'commonjs', 'node'],
        plugins: [
          'prettier'
        ],
        rules: {
          // Disallow trailing commas on arrays, objects, functions, et al
          'comma-dangle': ['error', 'never'],
          // Allow using console since most of the code in this repo isn't run in a browser.
          'no-console': 'off',
          // Allowing shadowing variable that share the same context as the outer scope
          'no-shadow': 'off'
        }
      }
    }]
  ]
};
