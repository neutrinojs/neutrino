'use strict';

const exists = require('exists-file');
const webpack = require('webpack');
const HtmlPlugin = require('html-webpack-plugin');
const htmlTemplate = require('html-webpack-template');
const merge = require('deepmerge');
const config = require('neutrino-preset-base');
const path = require('path');

const CWD = process.cwd();
const SRC = path.join(CWD, 'src');
const PKG = require(path.join(CWD, 'package.json'));
const FILE_LOADER = require.resolve('file-loader');
const CSS_LOADER = require.resolve('css-loader');
const STYLE_LOADER = require.resolve('style-loader');
const URL_LOADER = require.resolve('url-loader');
const MODULES = path.join(__dirname, '../node_modules');

config.target('web');
config.output.publicPath('./');
config.resolve.modules.add(MODULES);
config.resolveLoader.modules.add(MODULES);

config.node
  .set('console', false)
  .set('global', true)
  .set('process', true)
  .set('Buffer', true)
  .set('__filename', 'mock')
  .set('__dirname', 'mock')
  .set('setImmediate', true)
  .set('fs', 'empty')
  .set('tls', 'empty');

config.module
  .rule('html')
  .test(/\.html$/)
  .loader('file', FILE_LOADER, {
    name: '[name].[ext]'
  });

config.module
  .rule('css')
  .test(/\.css$/)
  .loader('style', STYLE_LOADER)
  .loader('css', CSS_LOADER);

config.module
  .rule('woff')
  .test(/\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/)
  .loader('url', URL_LOADER, {
    limit: '10000',
    mimetype: 'application/font-woff'
  });

config.module
  .rule('ttf')
  .test(/\.ttf(\?v=\d+\.\d+\.\d+)?$/)
  .loader('url', URL_LOADER, {
    limit: '10000',
    mimetype: 'application/octet-stream'
  });

config.module
  .rule('eot')
  .test(/\.eot(\?v=\d+\.\d+\.\d+)?$/)
  .loader('file', FILE_LOADER);

config.module
  .rule('svg')
  .test(/\.svg(\?v=\d+\.\d+\.\d+)?$/)
  .loader('url', URL_LOADER, {
    limit: '10000',
    mimetype: 'application/svg+xml'
  });

config.module
  .rule('img')
  .test(/\.(png|jpg)$/)
  .loader('url', URL_LOADER, {
    limit: 8192
  });

config.module
  .rule('ico')
  .test(/\.ico(\?v=\d+\.\d+\.\d+)?$/)
  .loader('url', URL_LOADER);

// modify the babel loader
config.module
  .rule('compile')
  .loader('babel', ({ options }) => {
    options.presets[0][1].targets.browsers = ['last 2 versions'];

    return { options };
  });

// modify the lint loader
config.module
  .rule('lint')
  .loader('eslint', ({ options }) => {
    return {
      options: merge(options, {
        globals: ['Buffer'],
        envs: ['browser', 'commonjs']
      })
    };
  });

config
  .plugin('env')
  .use(webpack.EnvironmentPlugin, ['NODE_ENV']);

config
  .plugin('html')
  .use(HtmlPlugin, merge({
    inject: false,
    template: htmlTemplate,
    appMountId: 'root',
    xhtml: true,
    mobile: true,
    minify: {
      useShortDoctype: true,
      keepClosingSlash: true,
      collapseWhitespace: true,
      preserveLineBreaks: true,
    }
  }, PKG.config && PKG.config.html ? PKG.config.html : {}));

if (process.env.NODE_ENV !== 'test') {
  config
    .plugin('chunk')
    .use(webpack.optimize.CommonsChunkPlugin, {
      names: ['vendor', 'manifest'],
      minChunks: Infinity
    });
}

if (process.env.NODE_ENV === 'development') {
  const protocol = !!process.env.HTTPS ? 'https' : 'http';
  const host = process.env.HOST || 'localhost';
  const port = parseInt(process.env.PORT) || 5000;

  config
    .devServer
    .host(host)
    .port(port)
    .https(protocol === 'https')
    .contentBase(SRC)
    .historyApiFallback(true)
    .stats({
      assets: false,
      children: false,
      chunks: false,
      colors: true,
      errors: true,
      errorDetails: true,
      hash: false,
      modules: false,
      publicPath: false,
      timings: false,
      version: false,
      warnings: true
    });

  config
    .entry('index')
      .add(`webpack-dev-server/client?${protocol}://${host}:${port}/`)
      .add('webpack/hot/dev-server');

  config
    .plugin('hot')
    .use(webpack.HotModuleReplacementPlugin);
} else if (process.env.NODE_ENV === 'production') {
  config
    .plugin('minify')
    .use(webpack.optimize.UglifyJsPlugin, {
      sourceMap: false,
      compress: { warnings: false }
    });

  config
    .plugin('minimize')
    .use(webpack.LoaderOptionsPlugin, { minimize: true });
} else if (process.env.NODE_ENV === 'test') {
  config
    .options
    .set('karma', {
      plugins: [
        require.resolve('karma-webpack'),
        require.resolve('karma-chrome-launcher'),
        require.resolve('karma-coverage'),
        require.resolve('karma-mocha'),
        require.resolve('karma-mocha-reporter')
      ],
      basePath: process.cwd(),
      browsers: [process.env.CI ? 'ChromeCI' : 'Chrome'],
      customLaunchers: {
        ChromeCI: {
          base: 'Chrome',
          flags: ['--no-sandbox']
        }
      },
      frameworks: ['mocha'],
      files: ['test/**/*_test.js'],
      preprocessors: {
        'test/**/*_test.js': ['webpack'],
        'src/**/*.js': ['webpack']
      },
      webpackMiddleware: { noInfo: true },
      reporters: ['mocha', 'coverage'],
      coverageReporter: {
        dir: '.coverage',
        reporters: [
          { type: 'html', subdir: 'report-html' },
          { type: 'lcov', subdir: 'report-lcov' }
        ]
      }
    });
}

module.exports = config;
