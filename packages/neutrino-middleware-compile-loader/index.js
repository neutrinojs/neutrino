module.exports = ({ config }, options) => {
  const rule = config.module
    .rule('compile')
    .test(options.test || /\.jsx?$/)
    .use('babel')
      .loader(require.resolve('babel-loader'))
      .options(options.babel)
      .end();

  if (options.include) {
    rule.include.merge(options.include);
  }

  if (options.exclude) {
    rule.exclude.merge(options.exclude);
  }
};
