const web = require('@neutrinojs/web');
const copy = require('@neutrinojs/copy');
const clean = require('@neutrinojs/clean');
const webExt = require('web-ext').default;
const { join, basename } = require('path');
const fs = require('fs');
const merge = require('deepmerge');

const MODULES = join(__dirname, 'node_modules');

module.exports = (neutrino, opts = {}) => {
  const DEV_FOLDER = join(neutrino.options.root, 'dev');
  const BUILD_FOLDER = join(neutrino.options.root, 'build');
  const BUILD_EXT_FOLDER = join(BUILD_FOLDER, 'extension');
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

  const lintWithWebExt = async (webExtLint, sourceDir) => {
    await webExt.cmd
      .lint(merge(webExtLint, { sourceDir }), { shouldExitProgram: false })
      .catch(handlePromiseRejection);
  }

  const webExtRun = merge({
    noInput: true,
    sourceDir: DEV_FOLDER,
    startUrl: "about:debugging"
  }, neutrino.options.webExtRun || {} );

  const webExtBuild = merge({
    sourceDir: BUILD_EXT_FOLDER,
    overwriteDest: true,
    artifactsDir: BUILD_FOLDER
  }, neutrino.options.webExtBuild || {} );

  const webExtLint = merge({
    output: "text",
    pretty: "true",
    selfHosted: false,
    warningsAsErrors: false
  }, neutrino.options.webExtLint || {})

  // TODO seems like config is not taken in account
  if ( webExtRun.config ) {
    webExtRun.config = join(neutrino.options.root, webExtRun.config)
  }

  const options = merge({
    hot: false,
    devServer: false,
    webExtRun,
    webExtBuild,
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
    // TODO what about async code ???
    .when(neutrino.options.command === 'lint', async () => {
      await lintWithWebExt(webExtLint, neutrino.options.source);
    })
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
          .path(BUILD_EXT_FOLDER)
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

  neutrino.on('start', async () => {
    await lintWithWebExt(webExtLint, DEV_FOLDER);

    await webExt.cmd
      .run(options.webExtRun, { shouldExitProgram: false })
      .catch(handlePromiseRejection);
  });

  neutrino.on('build', async () => {
    await lintWithWebExt(webExtLint, BUILD_EXT_FOLDER);

    await webExt.cmd
      .build(options.webExtBuild, { shouldExitProgram: false })
      .then(({ extensionPath }) => {
        fs.copyFileSync(
          extensionPath,
          extensionPath.replace('zip', 'xpi')
        );
      })
      .catch(handlePromiseRejection);
  });
};
