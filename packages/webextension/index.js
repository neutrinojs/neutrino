const web = require('@neutrinojs/web');
const webExt = require('web-ext').default;
const { join } = require('path');

const MODULES = join(__dirname, 'node_modules');

module.exports = (neutrino, options = {}) => {
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
    .when(neutrino.options.command === 'start', () => {
      webExt.cmd.run({
        noInput: true,
        sourceDir: neutrino.options.output
      }, { shouldExitProgram: false });
    })
    .when(neutrino.options.command === 'build', (config) => {
      config
        .output
          .delete('filename')
          .end()
        .plugin(options.pluginId || 'copy')
          .tap(([, ...args]) => [[{
            context: neutrino.options.source,
            from: '**/*'
          }], ...args]);
    });
};
