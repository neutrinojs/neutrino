'use strict';

const path = require('path');

module.exports = (preset) => {
  const cwd = process.cwd();

  if (!preset) {
    const pkg = require(path.join(cwd, 'package.json'));

    if (!pkg.config || !pkg.config.preset) {
      throw new Error(`This command requires a preset.
        Specify one using -p, --preset, or in your package.json as \`config.preset\`.`);
    }

    preset = pkg.config.preset;
  }

  const modules = [
    preset,
    path.join(process.cwd(), preset),
    path.join(process.cwd(), 'node_modules', preset)
  ];

  // Try requiring the preset as an absolute dependency, and if that fails
  // try requiring it as relative to the project
  for (let i = 0; i < modules.length; i++) {
    try {
      return require(modules[i]);
    } catch (err) {
      if (!/Cannot find module/.test(err.message)) {
        throw err;
      }
    }
  }

  throw new Error(`Unable to locate preset \`${preset}\``);
};
