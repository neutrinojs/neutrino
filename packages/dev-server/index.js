module.exports = (neutrino, options = {}) => {
  neutrino.config.devServer.merge({
    port: 5000,
    hot: true,
    // Redirect 404s to index.html, so that apps that use the HTML 5 History API work.
    historyApiFallback: true,
    // Only display compile duration and errors/warnings, to reduce noise when rebuilding.
    stats: {
      all: false,
      errors: true,
      timings: true,
      warnings: true
    },
    ...options
  });
};
