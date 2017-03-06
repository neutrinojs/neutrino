const banner = require('neutrino-middleware-banner');
const compile = require('neutrino-middleware-compile-loader');
const copy = require('neutrino-middleware-copy');
const progress = require('neutrino-middleware-progress');
const clean = require('neutrino-middleware-clean');
const loaderMerge = require('neutrino-middleware-loader-merge');
const startServer = require('neutrino-middleware-start-server');
const hot = require('neutrino-middleware-hot');
const namedModules = require('neutrino-middleware-named-modules');
const nodeExternals = require('webpack-node-externals');
const { join } = require('path');

const CWD = process.cwd();
const SRC = join(CWD, 'src');
const BUILD = join(CWD, 'build');
const TEST = join(CWD, 'test');
const PROJECT_MODULES = join(CWD, 'node_modules');
const MODULES = join(__dirname, 'node_modules');
const PKG = require(join(CWD, 'package.json'));

module.exports = neutrino => {
  const { config } = neutrino;

  neutrino.use(namedModules);
  neutrino.use(compile, {
    include: [SRC, TEST],
    babel: {
      plugins: [require.resolve('babel-plugin-dynamic-import-node')],
      presets: [
        [require.resolve('babel-preset-env'), {
          modules: false,
          targets: {
            node: 6.9
          }
        }]
      ]
    }
  });

  config.performance.hints(false);
  config
    .target('node')
    .node
      .set('__filename', false)
      .set('__dirname', false)
      .end()
    .devtool('source-map')
    .externals([nodeExternals({ whitelist: [/^webpack/] })])
    .context(CWD)
    .entry('index')
      .add(join(SRC, 'index.js'))
      .end()
    .output
      .path(BUILD)
      .filename('[name].js')
      .libraryTarget('commonjs2')
      .chunkFilename('[id].[hash:5]-[chunkhash:7].js')
      .end()
    .resolve
      .modules
        .add(PROJECT_MODULES)
        .add(MODULES)
        .end()
      .extensions
        .add('.js')
        .add('.json')
        .end()
      .end()
    .resolveLoader
      .modules
        .add(PROJECT_MODULES)
        .add(MODULES);

  const hasSourceMap = (PKG.dependencies && 'source-map-support' in PKG.dependencies) ||
    (PKG.devDependencies && 'source-map-support' in PKG.devDependencies);

  if (hasSourceMap) {
    neutrino.use(banner);
  }

  if (process.env.NODE_ENV !== 'development') {
    neutrino.use(clean, { paths: [BUILD] });
    neutrino.use(progress);
    neutrino.use(copy, {
      patterns: [{ context: SRC, from: `**/*` }],
      options: { ignore: ['*.js*'] }
    });
  } else {
    config.devtool('inline-sourcemap');
    config.entry('index').add('webpack/hot/poll?1000');
    config.output.devtoolModuleFilenameTemplate('[absolute-resource-path]');
    neutrino.use(hot);
    neutrino.use(startServer, join(SRC, 'index.js'));
  }

  if (config.module.rules.has('lint')) {
    neutrino.use(loaderMerge('lint', 'eslint'), {
      envs: ['node'],
      rules: {
        // enforce return after a callback
        'callback-return': 'off',

        // require all requires be top-level
        // http://eslint.org/docs/rules/global-require
        'global-require': 'error',

        // enforces error handling in callbacks (node environment)
        'handle-callback-err': 'off',

        // Allow console in Node.js
        'no-console': 'off',

        // disallow mixing regular variable and require declarations
        'no-mixed-requires': ['off', false],

        // disallow use of new operator with the require function
        'no-new-require': 'error',

        // disallow string concatenation with __dirname and __filename
        // http://eslint.org/docs/rules/no-path-concat
        'no-path-concat': 'error',

        // disallow use of process.env
        'no-process-env': 'off',

        // disallow process.exit()
        'no-process-exit': 'off',

        // restrict usage of specified node modules
        'no-restricted-modules': 'off',

        // disallow use of synchronous methods (off by default)
        'no-sync': 'off'
      }
    });
  }
};
