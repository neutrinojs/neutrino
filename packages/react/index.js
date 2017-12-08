const web = require('@neutrinojs/web');
const compileLoader = require('@neutrinojs/compile-loader');
const loaderMerge = require('@neutrinojs/loader-merge');
const { join } = require('path');
const merge = require('deepmerge');

const MODULES = join(__dirname, 'node_modules');

module.exports = (neutrino, opts = {}) => {
  const options = merge({
    hot: true,
    hotEntries: [require.resolve('react-hot-loader/patch')],
    babel: {}
  }, opts);

  Object.assign(options, {
    babel: compileLoader.merge({
      plugins: [
        [
          require.resolve('babel-plugin-transform-react-jsx'),
          { pragma: 'createElement' }
        ],
        [
          require.resolve('babel-plugin-jsx-pragmatic'),
          {
            module: 'react',
            export: 'createElement',
            import: 'createElement'
          }
        ],
        require.resolve('babel-plugin-transform-object-rest-spread'),
        ...(
          process.env.NODE_ENV === 'development'
            ? [
              ...(options.hot ? [require.resolve('react-hot-loader/babel')] : []),
              [require.resolve('babel-plugin-transform-class-properties'), { spec: true }],
              require.resolve('babel-plugin-transform-es2015-classes')
            ]
            : [
              [require.resolve('babel-plugin-transform-class-properties'), { spec: true }]
            ]
        )
      ],
      presets: [require.resolve('babel-preset-react')]
    }, options.babel)
  });

  neutrino.use(web, options);

  neutrino.config.when(neutrino.config.module.rules.has('lint'), () => {
    neutrino.use(loaderMerge('lint', 'eslint'), {
      plugins: ['react'],
      rules: {
        // Shutting this off allows ESLint to not fail when using JSX without an explicit
        // "react" import when coupled with the "jsx-pragmatic" and "transform-react-jsx"
        // babel plugins above
        'react/react-in-jsx-scope': 'off'
      }
    });
  });

  neutrino.config
    .resolve
      .batch((resolve) => {
        resolve.modules.add(MODULES);
        resolve.alias.set('react-native', 'react-native-web');
      })
      .end()
    .resolveLoader
      .modules
        .add(MODULES);
};
