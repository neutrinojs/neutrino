module.exports =
  (options = {}) =>
  (neutrino) => {
    neutrino.config.devServer.merge({
      port: 5000,
      hot: true,
      // Redirect 404s to index.html, so that apps that use the HTML 5 History API work.
      historyApiFallback: true,
      client: {
        // Display any webpack compile errors (but not warnings) on an in-page overlay.
        overlay: true,
      },
      ...options,
    });
  };
