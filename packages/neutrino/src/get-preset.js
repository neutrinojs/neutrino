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

  // Try requiring the preset as an absolute dependency, and if that fails
  // try requiring it as relative to the project
  try {
    return require(preset);
  } catch (err) {
    try {
      return require(path.join(process.cwd(), preset));
    } catch (err) {
      return require(path.join(process.cwd(), 'node_modules', preset));
    }
  }
};
