module.exports = {
  use: [
    ['index.js', { externals: false }],
    (neutrino) => {
      neutrino.config
        .performance
          .hints('warning')
          .end()
        .externals([
          'normalize.css',
          'react',
          'react-addons-css-transition-group',
          'react-dom',
          'prop-types'
        ]);
    }
  ]
};
