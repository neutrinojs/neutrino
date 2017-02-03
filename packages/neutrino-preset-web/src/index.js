'use strict';

const exists = require('exists-file');
const webpack = require('webpack');
const HtmlPlugin = require('html-webpack-plugin');
const merge = require('deepmerge');
const preset = require('neutrino-preset-base');
const path = require('path');
const webpackMerge = require('webpack-merge').smart;

const CWD = process.cwd();
const SRC = path.join(CWD, 'src');
const PRESET_TEMPLATE_EJS = path.join(__dirname, 'template.ejs');
const PRESET_TEMPLATE_INDEX = path.join(__dirname, 'index.html');
const PROJECT_TEMPLATE = path.join(SRC, 'template.ejs');
const FILE_LOADER = require.resolve('file-loader');
const CSS_LOADER = require.resolve('css-loader');
const STYLE_LOADER = require.resolve('style-loader');
const URL_LOADER = require.resolve('url-loader');
const MODULES = path.join(__dirname, '../node_modules');
const USER_CONFIG = require(path.join(CWD, 'package.json'));
const VENDOR_LIBS = Object.keys(USER_CONFIG.dependencies);

preset.entry.index.unshift(require.resolve('babel-polyfill'));

/**
 * Find best fit template.
 *
 * return preset template.ejs when no template found in project folder
 */
function findTemplate() {
  if (exists.sync(PRESET_TEMPLATE_EJS)) {
    return PRESET_TEMPLATE_EJS;
  } else if (exists.sync(PRESET_TEMPLATE_INDEX)) {
    return PRESET_TEMPLATE_INDEX;
  }

  return PROJECT_TEMPLATE;
}

const config = webpackMerge(preset, {
  target: 'web',
  node: {
    console: false,
    global: true,
    process: true,
    Buffer: true,
    __filename: 'mock',
    __dirname: 'mock',
    setImmediate: true,
    fs: 'empty',
    tls: 'empty'
  },
  entry: {
    vendor: VENDOR_LIBS
  },
  output: {
    publicPath: './'
  },
  plugins: [
    new webpack.EnvironmentPlugin(['NODE_ENV']),
    new HtmlPlugin({
      template: findTemplate(),
      inject: 'body',
      xhtml: true
    }),
    new webpack.LoaderOptionsPlugin({
      options: {
        eslint: {
          configFile: path.join(__dirname, 'eslint.js')
        }
      }
    })
  ],
  resolve: {
    modules: [MODULES]
  },
  module: {
    rules: [
      {
        test: /\.html$/,
        use: {
          loader: FILE_LOADER,
          options: {
            name: '[name].[ext]'
          }
        }
      },
      {
        test: /\.css$/,
        loaders: [STYLE_LOADER, CSS_LOADER]
      },
      {
        test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
        use: {
          loader: URL_LOADER,
          options: {
            limit: 10000,
            mimetype: 'application/font-woff'
          }
        }
      },
      {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        use: {
          loader: URL_LOADER,
          options: {
            limit: '10000',
            mimetype: 'application/octet-stream'
          }
        }
      },
      {
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        use: FILE_LOADER
      },
      {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        use: {
          loader: URL_LOADER,
          options: {
            limit: '10000',
            mimetype: 'application/svg+xml'
          }
        }
      },
      {
        test: /\.(png|jpg)$/,
        use: {
          loader: URL_LOADER,
          options: {
            limit: 8192
          }
        }
      },
      {
        test: /\.ico(\?v=\d+\.\d+\.\d+)?$/,
        use: URL_LOADER
      }
    ]
  }
});

if (process.env.NODE_ENV !== 'test') {
  config.plugins.push(new webpack.optimize.CommonsChunkPlugin({
    names: ['vendor', 'manifest'],
    minChunks: Infinity
  }));
}

if (process.env.NODE_ENV === 'development') {
  const protocol = !!process.env.HTTPS ? 'https' : 'http';
  const host = process.env.HOST || 'localhost';
  const port = parseInt(process.env.PORT) || 5000;

  config.devServer = {
    host,
    port,
    hot: true,
    https: protocol === 'https',
    contentBase: SRC,
    // Enable history API fallback so HTML5 History API based
    // routing works. This is a good default that will come
    // in handy in more complicated setups.
    historyApiFallback: true,
    stats: {
      colors: true,
      chunks: false,
      version: false,
      assets: false,
      modules: false,
      children: false,
      source: false
    }
  };

  config.entry.index.push(`webpack-dev-server/client?${protocol}://${host}:${port}/`);
  config.entry.index.push(`webpack/hot/dev-server`);
  config.plugins.push(new webpack.HotModuleReplacementPlugin());
} else if (process.env.NODE_ENV === 'production') {
  config.plugins.push(
    new webpack.optimize.UglifyJsPlugin({ sourceMap: false, compress: { warnings: false }}),
    new webpack.LoaderOptionsPlugin({ minimize: true })
  );
} else if (process.env.NODE_ENV === 'test') {
  config.karma = {
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
  };
}

module.exports = config;
