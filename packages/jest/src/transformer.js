const { transform } = require('@babel/core');

module.exports = {
  // This is inspired by:
  // https://github.com/facebook/jest/blob/v22.4.2/packages/babel-jest/src/index.js#L105-L147
  // And is required due to:
  // https://github.com/facebook/jest/issues/1468
  // TODO: See if it would be easier to wrap the higher-level babel-jest instead.
  process(src, filename, config) {
    // Babel 7 returns null if the file was ignored.
    return transform(src, { filename, ...config.globals.BABEL_OPTIONS }) || src;
  }
};
