module.exports = {
  use: [
    ['./packages/neutrino-preset-airbnb-base', {
      include: [
        'packages/*/*.js',
        'packages/*/src/**/*.js',
        'packages/neutrino/bin/*'
      ],
      eslint: {
        node: true,
        envs: ['browser', 'commonjs', 'node'],
        plugins: ['eslint-plugin-prettier'],
        rules: {
          // Algebraic and functional types should allow capital constructors without new
          'babel/new-cap': 'off',
          // Disable necessitating return after a callback
          'callback-return': 'off',
          // Allow using class methods with static/non-instance functionality
          // React lifecycle methods commonly do not use an instance context for anything
          'class-methods-use-this': 'off',
          // Disallow trailing commas on arrays, objects, functions, et al
          'comma-dangle': ['error', 'never'],
          // Require all requires be top-level
          // http://eslint.org/docs/rules/global-require
          'global-require': 'error',
          // Enforces error handling in callbacks (node environment)
          'handle-callback-err': 'off',
          // Allow dynamic requires
          'import/no-dynamic-require': 'off',
          // Specify the maximum length of a line in your program
          // JSX can get lengthy, so this helps alleviate that a bit
          // http://eslint.org/docs/rules/max-len
          'max-len': ['error', 120, 2, {
            ignoreUrls: true,
            ignoreComments: false,
            ignoreStrings: true,
            ignoreTemplateLiterals: true
          }],
          // Allow console during development, otherwise throw an error
          'no-console': 'off',
          // Allow extra parentheses since multiline JSX being wrapped in parens is considered idiomatic
          'no-extra-parens': 'off',
          // Disallow mixing regular variable and require declarations
          'no-mixed-requires': ['off', false],
          // Disallow use of new operator with the require function
          'no-new-require': 'error',
          // Disallow string concatenation with __dirname and __filename
          // http://eslint.org/docs/rules/no-path-concat
          'no-path-concat': 'error',
          // Allow use of process.env
          'no-process-env': 'off',
          // Allow process.exit()
          'no-process-exit': 'off',
          // Restrict usage of specified node modules
          'no-restricted-modules': 'off',
          // Allow return assign
          'no-return-assign': 'off',
          // Allowing shadowing variable that share the same context as the outer scope
          'no-shadow': 'off',
          // It makes sense to have unused expressions to avoid imperative conditionals
          'no-unused-expressions': 'off',
          // Allow use of synchronous methods (off by default)
          'no-sync': 'off',
          // Our frontend strives to adopt functional programming practices, so we prefer const over let
          'prefer-const': 'error'
        }
      }
    }]
  ]
};
