'use strict';

module.exports = {
  extends: [require.resolve('neutrino-preset-base/src/eslint')],
  globals: {
    Buffer: true
  },
  env: {
    browser: true,
    commonjs: true
  }
};
