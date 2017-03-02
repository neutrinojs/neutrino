const loaderMerge = require('neutrino-middleware-loader-merge');
const web = require('neutrino-preset-web');
const { join } = require('path');

const MODULES = join(__dirname, 'node_modules');

module.exports = neutrino => {
  const { config } = neutrino;

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

  config.resolve.modules.add(MODULES);
  config.resolve.extensions.add('.jsx');
  config.resolveLoader.modules.add(MODULES);

  config
    .externals({
      'react/addons': true,
      'react/lib/ExecutionEnvironment': true,
      'react/lib/ReactContext': 'window'
    });

  if (process.env.NODE_ENV === 'development') {
    config
      .entry('index')
      .prepend(require.resolve('react-hot-loader/patch'));
  }

  if (config.module.rules.has('lint')) {
    neutrino.use(loaderMerge('lint', 'eslint'), {
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
    });
  }
};
