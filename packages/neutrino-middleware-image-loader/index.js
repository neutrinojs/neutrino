const merge = require('deepmerge');

module.exports = ({ config }, options = {}) => {
  const { limit } = merge({ limit: 8192 }, options);
  const urlLoader = require.resolve('url-loader');
  const svgUrlLoader = require.resolve('svg-url-loader');

  config.module
    .rule('svg')
    .test(/\.svg(\?v=\d+\.\d+\.\d+)?$/)
    // .oneOf('style')
    //   .set('issuer', /\.(css|less|sass|scss)$/)
    //   .use('url')
    //     .loader(svgUrlLoader)
    //     .options(merge({ limit }, options.svg || {}))
    //     .tap(opts => merge(opts, { noquotes: false }))
    //     .end()
    //   .end()
    // .oneOf('text')
    //   .use('url')
    //     .loader(svgUrlLoader)
    //     .options(merge({ limit }, options.svg || {}))
    //     .tap(opts => merge(opts, { noquotes: true }))
    .set('oneOf', [
      {
        issuer: /\.(css|less|sass|scss)$/,
        use: [
          {
            loader: svgUrlLoader,
            options: merge({ limit, noquotes: false }, options.svg || {})
          }
        ]
      },
      {
        use: [
          {
            loader: svgUrlLoader,
            options: merge({ limit, noquotes: true }, options.svg || {})
          }
        ]
      }
    ]);

  config.module
    .rule('img')
    .test(/\.(png|jpg|jpeg|gif)$/)
    .use('url')
      .loader(urlLoader)
      .options(merge({ limit }, options.img || {}));

  config.module
    .rule('ico')
    .test(/\.ico(\?v=\d+\.\d+\.\d+)?$/)
    .use('url')
      .loader(urlLoader)
      .when(options.ico, use => use.options(options.ico));
};
