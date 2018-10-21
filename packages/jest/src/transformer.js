const { createTransformer } = require('babel-jest');

const babelOptions = JSON.parse(process.env.JEST_BABEL_OPTIONS);

module.exports = createTransformer(babelOptions);
