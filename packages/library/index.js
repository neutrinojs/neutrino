const banner = require('@neutrinojs/banner');
const compileLoader = require('@neutrinojs/compile-loader');
const clean = require('@neutrinojs/clean');
const loaderMerge = require('@neutrinojs/loader-merge');
const minify = require('@neutrinojs/minify');
const merge = require('deepmerge');
const { optimize } = require('webpack');
const nodeExternals = require('webpack-node-externals');
const { join } = require('path');

const MODULES = join(__dirname, 'node_modules');

module.exports = (neutrino, opts = {}) => {
  if (!opts.name) {
    throw new Error('Missing required preset option "name". You must specify a library name when using this preset.');
  }

  const options = merge({
    target: 'web',
    libraryTarget: 'umd',
    polyfills: {
      async: true
    },
    babel: {}
  }, opts);

  Object.assign(options, {
    babel: compileLoader.merge({
      plugins: [
        ...(options.polyfills.async ? [[require.resolve('fast-async'), { spec: true }]] : []),
        options.target === 'node' ?
          require.resolve('babel-plugin-dynamic-import-node') :
          require.resolve('babel-plugin-syntax-dynamic-import')
      ],
      presets: [
        [require.resolve('babel-preset-env'), {
          debug: neutrino.options.debug,
          modules: false,
          useBuiltIns: true,
          exclude: options.polyfills.async ? ['transform-regenerator', 'transform-async-to-generator'] : [],
          targets: options.target === 'node' ?
            { node: '6.10' } :
            { browsers: [] }
        }]
      ]
    }, options.babel)
  });

  const { targets } = options.babel.presets[0][1];

  if (targets.browsers && !targets.browsers.length) {
    targets.browsers.push(
      'last 2 Chrome versions',
      'last 2 Firefox versions',
      'last 2 Edge versions',
      'last 2 Opera versions',
      'last 2 Safari versions',
      'last 2 iOS versions'
    );
  }

  neutrino.config.resolve.modules.add(MODULES);
  neutrino.config.resolveLoader.modules.add(MODULES);

  try {
    const pkg = require(join(neutrino.options.root, 'package.json')); // eslint-disable-line global-require
    const hasSourceMap = (pkg.dependencies && 'source-map-support' in pkg.dependencies) ||
      (pkg.devDependencies && 'source-map-support' in pkg.devDependencies);

    if (hasSourceMap) {
      neutrino.use(banner);
    }
  } catch (ex) {} // eslint-disable-line

  neutrino.use(compileLoader, {
    include: [
      neutrino.options.source,
      neutrino.options.tests
    ],
    babel: options.babel
  });

  Object
    .keys(neutrino.options.mains)
    .forEach(key => neutrino.config.entry(key).add(neutrino.options.mains[key]));

  neutrino.config
    .target(options.target)
    .context(neutrino.options.root)
    .devtool('source-map')
    .output
      .library(options.name)
      .filename('[name].js')
      .libraryTarget(options.libraryTarget)
      .when(options.libraryTarget === 'umd', (output) => output.umdNamedDefine(true))
      .end()
    .resolve
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
      .when(options.target === 'node', (node) => {
        node
          .set('Buffer', false)
          .set('fs', 'empty')
          .set('tls', 'empty');
      })
      .when(options.target === 'web', (node) => {
        node
          .set('__filename', false)
          .set('__dirname', false);
      })
      .end()
    .module
      .rule('worker')
        .test(/\.worker\.js$/)
        .use('worker')
          .loader(require.resolve('worker-loader'))
          .end()
        .end()
      .end()
    .when(neutrino.options.debug, (config) => {
      config.merge({
        stats: {
          maxModules: Infinity,
          optimizationBailout: true
        }
      });
    })
    .when(process.env.NODE_ENV !== 'test', config => config.externals([nodeExternals()]))
    .when(neutrino.config.module.rules.has('lint'), () => {
      if (options.target === 'node') {
        neutrino.use(loaderMerge('lint', 'eslint'), { envs: ['commonjs'] });
      } else if (options.target === 'web') {
        neutrino.use(loaderMerge('lint', 'eslint'), { envs: ['browser', 'commonjs'] });
      }
    })
    .when(process.env.NODE_ENV === 'production', (config) => {
      neutrino.use(minify);
      config
        .plugin('module-concat')
          .use(optimize.ModuleConcatenationPlugin);
    })
    .when(neutrino.options.command === 'build', () => {
      neutrino.use(clean, { paths: [neutrino.options.output] });
    });
};
