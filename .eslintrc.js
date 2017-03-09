module.exports = {
  ecmaVersion: 2017,

  // http://eslint.org/docs/user-guide/configuring#specifying-parser-options
  ecmaFeatures: {
    modules: true,
    decorators: true,
    experimentalObjectRestSpread: true,
  },

  env: {
    node: true,
    browser: true,
    es6: true,
    worker: true,
    serviceworker: true,
  },

  plugins: [
    'eslint-plugin-prettier',
  ],

  rules: {
    // Specify the maximum length of a line in your program
    // JSX can get lengthy, so this helps alleviate that a bit
    // http://eslint.org/docs/rules/max-len
    'max-len': ['error', 120, 2, {
      ignoreUrls: true,
      ignoreComments: false,
      ignoreStrings: true,
      ignoreTemplateLiterals: true
    }],

    // Allow using class methods with static/non-instance functionality
    // React lifecycle methods commonly do not use an instance context for anything
    'class-methods-use-this': 'off',

    // Disallow trailing commas on arrays, objects, functions, et al
    'comma-dangle': ['error', 'never'],

    // Allow console during development, otherwise throw an error
    'no-console': 'warn',

    // Allow extra parentheses since multiline JSX being wrapped in parens is considered idiomatic
    'no-extra-parens': 'off',

    // Our frontend strives to adopt functional programming practices, so we prefer const over let
    'prefer-const': 'error',
  }
}
