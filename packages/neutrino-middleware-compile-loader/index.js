module.exports = ({ config }, options) => config.module
  .rule('compile')
  .test(/\.jsx?$/)
  .include(...options.include)
  .loader('babel', require.resolve('babel-loader'), options.babel);
