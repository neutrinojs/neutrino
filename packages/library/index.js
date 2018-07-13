const banner = require('@neutrinojs/banner');
const compileLoader = require('@neutrinojs/compile-loader');
const clean = require('@neutrinojs/clean');
const loaderMerge = require('@neutrinojs/loader-merge');
const merge = require('deepmerge');
const nodeExternals = require('webpack-node-externals');

module.exports = (neutrino, opts = {}) => {
  if (!opts.name) {
    throw new Error('Missing required preset option "name". You must specify a library name when using this preset.');
  }

  const options = merge({
    target: 'web',
    libraryTarget: 'umd',
    babel: {},
    clean: opts.clean !== false && {
      paths: [neutrino.options.output]
    }
  }, opts);

  Object.assign(options, {
    babel: compileLoader.merge({
      plugins: [
        require.resolve('@babel/plugin-syntax-dynamic-import')
      ],
      presets: [
        [require.resolve('@babel/preset-env'), {
          debug: neutrino.options.debug,
          modules: false,
          useBuiltIns: 'entry',
          targets: options.target === 'node' ?
            { node: '8.3' } :
            { browsers: 'ie 9' }
        }]
      ]
    }, options.babel)
  });

  const pkg = neutrino.options.packageJson;
  const hasSourceMap = (pkg.dependencies && 'source-map-support' in pkg.dependencies) ||
    (pkg.devDependencies && 'source-map-support' in pkg.devDependencies);

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
    .when(hasSourceMap, () => neutrino.use(banner))
    .devtool('source-map')
    .externals([nodeExternals()])
    .target(options.target)
    .context(neutrino.options.root)
    .output
      .path(neutrino.options.output)
      .library(options.name)
      .filename('[name].js')
      .libraryTarget(options.libraryTarget)
      .when(options.libraryTarget === 'umd', (output) => output.umdNamedDefine(true))
      .end()
    .resolve
      .extensions
        .merge(neutrino.options.extensions.concat('json').map(ext => `.${ext}`))
        .end()
      .end()
    .node
      .when(options.target === 'web', (node) => {
        node
          .set('Buffer', false)
          .set('fs', 'empty')
          .set('tls', 'empty');
      })
      .when(options.target === 'node', (node) => {
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
    .when(neutrino.config.module.rules.has('lint'), () => {
      if (options.target === 'node') {
        neutrino.use(loaderMerge('lint', 'eslint'), { envs: ['commonjs'] });
      } else if (options.target === 'web') {
        neutrino.use(loaderMerge('lint', 'eslint'), { envs: ['browser', 'commonjs'] });
      }
    })
    .when(process.env.NODE_ENV === 'production', (config) => {
      config.when(options.clean, () => neutrino.use(clean, options.clean));
    });
};
