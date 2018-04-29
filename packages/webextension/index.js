const web = require('@neutrinojs/web');
const copy = require('@neutrinojs/copy');
const clean = require('@neutrinojs/clean');
const htmlTemplate = require('@neutrinojs/html-template');
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

  const getManifest = (MANIFEST_PATH) => {
    if ( !fs.existsSync(MANIFEST_PATH) ) {
      console.error("The web extension doesn't contain a manifest.json at the root.");
      process.exit(1);
    }
    return JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
  };
  const MANIFEST = getManifest(join(neutrino.options.source, 'manifest.json'));

  const copyWebExtensionPaths = [
      { context: neutrino.options.source, from: 'manifest.json' },
      { context: staticDir, from: '**/*', to: basename(staticDir) },
      { context: locales, from: '**/*', to: basename(locales) }
  ];

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
    webExtLint,
    minify: {},
    html: {},
    publicPath: '/'
  }, opts);

  neutrino.use(web, options);

  // Read MANIFEST

  const addManifestEntry = (key, value, withHTML) => {
    const hasAlreadyHTML = fs.existsSync(value.concat('.html'));

    neutrino.config
      .when(hasAlreadyHTML, () => {
        copyWebExtensionPaths.push({
          context: neutrino.options.source,
          from: key.concat('.html'),
          to: key.concat('.html')
        });
      })
      .entry(key)
        .add(value)
        .when(!hasAlreadyHTML && withHTML, () => {
          neutrino.use(htmlTemplate, merge({
            pluginId: `html-${key}`,
            filename: `${key}.html`,
            // When using the chunk middleware, the names in use by default there
            // need to be kept in sync with the additional values used here
            chunks: [key, 'vendor', 'runtime']
          }, options.html));
        });
  }

  /**
   * Check if the entry exists
   * Else return undefined
   * It the entry is an array, only take the first value
   */
  const getManifestEntry = (entry) =>{
    if ( entry === undefined ) return undefined;

    const keys = entry.split('.');
    const value = keys.reduce((obj, key)=>{
      if ( obj === undefined ) {
        return undefined;
      }
      return obj[key];
    }, MANIFEST);

    if ( value === undefined ) return undefined;

    return Array.isArray(value)
            ? value
            : [value];
  };

  const EntryFactory = (pathFiles, withHTML=true) => ({
    pathFiles,
    withHTML
  })

  const getContentScriptsEntries = () => {
    const contentScripts = getManifestEntry("content_scripts");
    if ( contentScripts === undefined ) return undefined;

    return contentScripts.map(
      (_, index) => EntryFactory(
        `content_scripts.${index}.js`,
        false
      )
    );
  }

  [
    EntryFactory("browser_action.default_popup"),
    EntryFactory("sidebar_action.default_panel"),
    EntryFactory("options_ui.page"),
    EntryFactory("background.page"),
    EntryFactory("devtools_page"),
    EntryFactory("background.scripts", false)
  ].concat(
    getContentScriptsEntries(),
  ).map(
    entry => EntryFactory(
      getManifestEntry(entry.pathFiles), entry.withHTML
    )
  ).filter(
    manifestEntry => manifestEntry.pathFiles !== undefined
  ).forEach(
    manifestEntry => manifestEntry.pathFiles.forEach(
      pathFile => addManifestEntry(
        join('./', pathFile.split('.')[0]),
        join(neutrino.options.source, pathFile.split('.')[0]),
        manifestEntry.withHTML
      )
    )
  );

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
      await lintWithWebExt(options.webExtLint, neutrino.options.source);
    })
    .when(neutrino.options.command === 'start', (config) => {
      config
        .output
          .path(DEV_FOLDER)
          .end();
      neutrino.use(clean, {
        paths: [DEV_FOLDER]
      });
      neutrino.use(copy, {
        patterns: copyWebExtensionPaths
      });
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
        .plugin(options.pluginId || 'copy')
           .tap(([, ...args]) => [copyWebExtensionPaths, ...args]);
    });

  neutrino.on('start', async () => {
    await lintWithWebExt(options.webExtLint, DEV_FOLDER);

    await webExt.cmd
      .run(options.webExtRun, { shouldExitProgram: false })
      .catch(handlePromiseRejection);
  });

  neutrino.on('build', async () => {
    await lintWithWebExt(options.webExtLint, BUILD_EXT_FOLDER);

    await webExt.cmd
      .build(options.webExtBuild, { shouldExitProgram: false })
      .then(({ extensionPath }) => {
        if ( getManifestEntry("applications.gecko.id") !== undefined ) {
          fs.copyFileSync(
            extensionPath,
            extensionPath.replace('zip', 'xpi')
          );
        } else {
          console.log('WARNING: XPI file not created as the application as no `applications.gecko.id`. See https://developer.mozilla.org/en-US/Add-ons/WebExtensions/Getting_started_with_web-ext.')
        }
      })
      .catch(handlePromiseRejection);
  });
};
