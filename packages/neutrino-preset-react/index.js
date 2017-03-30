const loaderMerge = require('neutrino-middleware-loader-merge');
const web = require('neutrino-preset-web');
const { join } = require('path');

const MODULES = join(__dirname, 'node_modules');

module.exports = (neutrino) => {
  neutrino.use(web);
  neutrino.use(loaderMerge('compile', 'babel'), {
    presets: [require.resolve('babel-preset-react')],
    plugins: [require.resolve('babel-plugin-transform-object-rest-spread')],
    env: {
      development: {
        plugins: [require.resolve('react-hot-loader/babel')]
      }
    }
  });

  neutrino.config
    .resolve
      .modules
        .add(MODULES)
        .end()
      .extensions
        .add('.jsx')
        .end()
      .alias
        .set('react-native', 'react-native-web')
        .end()
      .end()
    .resolveLoader
      .modules
        .add(MODULES)
        .end()
      .end()
    .externals({
      'react/addons': true,
      'react/lib/ExecutionEnvironment': true,
      'react/lib/ReactContext': 'window'
    })
    .when(process.env.NODE_ENV === 'development', config => config
      .entry('index')
      .prepend(require.resolve('react-hot-loader/patch')))
    .when(neutrino.config.module.rules.has('lint'), () => neutrino
      .use(loaderMerge('lint', 'eslint'), {
        plugins: ['react'],
        baseConfig: {
          extends: ['plugin:react/recommended']
        },
        parserOptions: {
          ecmaFeatures: {
            experimentalObjectRestSpread: true
          }
        },
        rules: {
          'react/prop-types': ['off'],
          'jsx-quotes': ['error', 'prefer-double'],
          'class-methods-use-this': ['error', {
            exceptMethods: [
              'render',
              'getInitialState',
              'getDefaultProps',
              'getChildContext',
              'componentWillMount',
              'componentDidMount',
              'componentWillReceiveProps',
              'shouldComponentUpdate',
              'componentWillUpdate',
              'componentDidUpdate',
              'componentWillUnmount'
            ]
          }]
        }
      }));
};
