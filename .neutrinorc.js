module.exports = {
  use: [
    ['./packages/airbnb-base', {
      // Excludes are managed via `.eslintignore` since `exclude` doesn't support globs.
      include: [
        '.*.js',
        'packages/'
      ],
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
