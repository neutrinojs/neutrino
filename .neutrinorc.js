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
          // Algebraic and functional types should allow capital constructors without new
          'babel/new-cap': 'off',
          // Disallow trailing commas on arrays, objects, functions, et al
          'comma-dangle': ['error', 'never'],
          // Allow dynamic requires
          'import/no-dynamic-require': 'off',
          // Allow console during development, otherwise throw an error
          'no-console': 'off',
          // Allow return assign
          'no-return-assign': 'off',
          // Allowing shadowing variable that share the same context as the outer scope
          'no-shadow': 'off',
          // It makes sense to have unused expressions to avoid imperative conditionals
          'no-unused-expressions': 'off'
        }
      }
    }]
  ]
};
