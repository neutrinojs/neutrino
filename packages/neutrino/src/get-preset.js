'use strict';

const path = require('path');
const merge = require('webpack-merge').smart;

const cwd = process.cwd();
const pkg = require(path.join(cwd, 'package.json'));

module.exports = (preset) => {
  if (!preset) {
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
      const module = require(modules[i]);
      const core = 'toConfig' in module ? module.toConfig() : module;
      const config = pkg.config && pkg.config.neutrino ?
        merge(core, pkg.config.neutrino) :
        core;

      return config;
    } catch (err) {
      if (!/Cannot find module/.test(err.message)) {
        throw err;
      }
    }
  }

  throw new Error(`Unable to locate preset \`${preset}\``);
};
