'use strict';

const preset = require('neutrino-preset-base');
const nodeExternals = require('webpack-node-externals');

if (!preset.externals) {
  preset.externals = [];
}

preset.target = 'node';
preset.externals.push(nodeExternals({ modulesFromFile: true }));

module.exports = preset;
