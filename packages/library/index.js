const banner = require('@neutrinojs/banner');
const compileLoader = require('@neutrinojs/compile-loader');
const clean = require('@neutrinojs/clean');
const loaderMerge = require('@neutrinojs/loader-merge');
const merge = require('deepmerge');
const nodeExternals = require('webpack-node-externals');
const { ConfigurationError } = require('neutrino/errors');

module.exports = (neutrino, opts = {}) => {
  if (!opts.name) {
    throw new ConfigurationError(
      'Missing required preset option "name". You must specify a library name when using this preset.'
    );
  }

  if ('polyfills' in opts) {
    throw new ConfigurationError(
      'The polyfills option has been removed, since polyfills are no longer included by default.'
    );
  }

  const options = merge({
    target: 'web',
    libraryTarget: 'umd',
    babel: {},
    externals: opts.externals !== false && {},
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
          useBuiltIns: 'entry',
          targets: options.target === 'node' ?
            { node: '8.10' } :
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

  Object.entries(neutrino.options.mains).forEach(([name, config]) =>
    neutrino.config.entry(name).add(config.entry)
  );

  neutrino.config
    .when(options.externals, config => config.externals([nodeExternals(options.externals)]))
    .when(hasSourceMap, () => neutrino.use(banner))
    .devtool('source-map')
    .externals([nodeExternals()])
    .target(options.target)
    .context(neutrino.options.root)
    .output
      .path(neutrino.options.output)
      .library(options.name)
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
    // The default output is too noisy, particularly with multiple entrypoints.
    .stats({
      children: false,
      entrypoints: false,
      modules: false
    })
    .when(neutrino.config.module.rules.has('lint'), () => {
      if (options.target === 'node') {
        neutrino.use(loaderMerge('lint', 'eslint'), { envs: ['commonjs'] });
      } else if (options.target === 'web') {
        neutrino.use(loaderMerge('lint', 'eslint'), { envs: ['browser', 'commonjs'] });
      }
    })
    .when(process.env.NODE_ENV === 'production', (config) => {
      // Use terser instead of the unmaintained uglify-es.
      // This is a backport of the upcoming webpack 5 minimizer configuration:
      // https://github.com/edmorley/webpack/blob/a94d0434a99489ef9bcb1808cdbe9cbe97bbd3e7/lib/WebpackOptionsDefaulter.js#L292-L308
      config.optimization
        .minimizer('terser')
        .use(require.resolve('terser-webpack-plugin'), [{
          cache: true,
          parallel: true,
          sourceMap: true
        }]);
      config.when(options.clean, () => neutrino.use(clean, options.clean));
    });
};
