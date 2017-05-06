const htmlLoader = require('neutrino-middleware-html-loader');
const styleLoader = require('neutrino-middleware-style-loader');
const fontLoader = require('neutrino-middleware-font-loader');
const imageLoader = require('neutrino-middleware-image-loader');
const compileLoader = require('neutrino-middleware-compile-loader');
const env = require('neutrino-middleware-env');
const htmlTemplate = require('neutrino-middleware-html-template');
const chunk = require('neutrino-middleware-chunk');
const hot = require('neutrino-middleware-hot');
const copy = require('neutrino-middleware-copy');
const clean = require('neutrino-middleware-clean');
const minify = require('neutrino-middleware-minify');
const loaderMerge = require('neutrino-middleware-loader-merge');
const namedModules = require('neutrino-middleware-named-modules');
const devServer = require('neutrino-middleware-dev-server');
const { join, dirname } = require('path');
const { path, pathOr } = require('ramda');

const MODULES = join(__dirname, 'node_modules');

module.exports = (neutrino) => {
  if (!path(['options', 'compile', 'targets', 'browsers'], neutrino)) {
    Object.assign(neutrino.options, {
      compile: {
        targets: {
          browsers: [
            'last 2 Chrome versions',
            'last 2 Firefox versions',
            'last 2 Edge versions',
            'last 2 Opera versions',
            'last 2 Safari versions',
            'last 2 iOS versions'
          ]
        }
      }
    });
  }

  neutrino.use(env);
  neutrino.use(htmlLoader);
  neutrino.use(styleLoader);
  neutrino.use(fontLoader);
  neutrino.use(imageLoader);
  neutrino.use(htmlTemplate, neutrino.options.html);
  neutrino.use(namedModules);
  neutrino.use(compileLoader, {
    include: [neutrino.options.source, neutrino.options.tests, require.resolve('./polyfills.js')],
    babel: {
      plugins: [require.resolve('babel-plugin-syntax-dynamic-import')],
      presets: [
        [require.resolve('babel-preset-env'), {
          modules: false,
          useBuiltIns: true,
          targets: neutrino.options.compile.targets
        }]
      ]
    }
  });

  neutrino.config
    .when(process.env.NODE_ENV !== 'test', () => neutrino.use(chunk, {
      names: ['polyfill']
    }))
    .target('web')
    .context(neutrino.options.root)
    .entry('polyfill')
      .add(require.resolve('./polyfills.js'))
      .end()
    .entry('index')
      .add(neutrino.options.entry)
      .end()
    .output
      .path(neutrino.options.output)
      .publicPath('./')
      .filename('[name].bundle.js')
      .chunkFilename('[id].[chunkhash].js')
      .end()
    .resolve
      .alias
        // Make sure 2 versions of "core-js" always match in package.json and babel-polyfill/package.json
        .set('core-js', dirname(require.resolve('core-js')))
        .end()
      .modules
        .add('node_modules')
        .add(neutrino.options.node_modules)
        .add(MODULES)
        .end()
      .extensions
        .add('.js')
        .add('.json')
        .end()
      .end()
    .resolveLoader
      .modules
        .add(neutrino.options.node_modules)
        .add(MODULES)
        .end()
      .end()
    .node
      .set('console', false)
      .set('global', true)
      .set('process', true)
      .set('Buffer', true)
      .set('__filename', 'mock')
      .set('__dirname', 'mock')
      .set('setImmediate', true)
      .set('fs', 'empty')
      .set('tls', 'empty')
      .end()
    .when(neutrino.config.module.rules.has('lint'), () => neutrino
      .use(loaderMerge('lint', 'eslint'), {
        globals: ['Buffer'],
        envs: ['browser', 'commonjs']
      }))
    .when(process.env.NODE_ENV === 'development', (config) => {
      neutrino.use(hot);
      neutrino.use(devServer);
      config.devtool('source-map');
    }, (config) => {
      neutrino.use(clean, { paths: [neutrino.options.output] });
      neutrino.use(minify);
      neutrino.use(copy, {
        patterns: [{ context: neutrino.options.source, from: '**/*' }],
        options: { ignore: ['*.js*'] }
      });
      config.output.filename('[name].[chunkhash].bundle.js');
    });
};
