const web = require('@neutrinojs/web');
const copy = require('@neutrinojs/copy');
const clean = require('@neutrinojs/clean');
const webExt = require('web-ext').default;
const { join, basename } = require('path');
const merge = require('deepmerge');

const MODULES = join(__dirname, 'node_modules');

module.exports = (neutrino, opts = {}) => {
  const DEV_FOLDER = join(neutrino.options.root, 'dev');
  const BUILD_FOLDER = join(neutrino.options.root, 'build');
  const staticDir = join(neutrino.options.source, 'static');
  const locales = join(neutrino.options.source, '_locales');

  const copyWebExtensionPaths = {
    patterns: [
      { context: neutrino.options.source, from: 'manifest.json' },
      { context: staticDir, from: '**/*', to: basename(staticDir) },
      { context: locales, from: '**/*', to: basename(locales) }
    ]
  };

  const handlePromiseRejection = err => {
    console.error(err);
    process.exit(1);
  };

  const webExtOptions = merge({
    noInput: true,
    sourceDir: DEV_FOLDER
  }, neutrino.options.webExtRun || {} );

  if ( webExtOptions.config ) {
    webExtOptions.config = join(neutrino.options.root, webExtOptions.config)
  }

  const options = merge({
    hot: false,
    devServer: false,
    webExtRun: webExtOptions,
    // TODO Is It necessary ??
    minify: {}
  }, opts);

  neutrino.use(web, options);

  if (neutrino.options.debug) {
    webExt.util.logger.consoleStream.makeVerbose();
  }

  neutrino.config
    .output
      .delete('chunkFilename')
      .hotUpdateChunkFilename('hot/hot-update.js')
      .hotUpdateMainFilename('hot/hot-update.json')
      .end()
    .devServer
      .clear()
      .end()
    .module
      .rules
        .delete('worker')
        .end()
      .end()
    .plugins
      .delete(options.pluginId || 'html')
      .end()
    .resolve
      .modules
        .add(MODULES)
        .end()
      .end()
    .resolveLoader
      .modules
        .add(MODULES)
        .end()
      .end()
    .when(neutrino.options.command === 'start', (config) => {
      config
        .output
          .path(DEV_FOLDER)
          .end();
      neutrino.use(clean, {
        paths: [DEV_FOLDER]
      })
      neutrino.use(copy, copyWebExtensionPaths);
    })
    .when(neutrino.options.command === 'build', (config) => {
      neutrino.use(clean, {
        paths: [BUILD_FOLDER]
      });
      config
        .output
          .path(BUILD_FOLDER)
          .delete('filename')
          .end()
      neutrino.use(copy, copyWebExtensionPaths);
        // TODO Is it better ??
        // .plugin(options.pluginId || 'copy')
        //  .tap(([, ...args]) => [[{
        //    context: neutrino.options.source,
        //    from: '**/*'
        //  }], ...args]);
    });

  neutrino.on('start', () => {
    webExt.cmd
      .run(options.webExtRun, { shouldExitProgram: false })
      .catch(handlePromiseRejection);
  });
};
