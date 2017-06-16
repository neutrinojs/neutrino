const merge = require('deepmerge');
const { omit } = require('ramda');

module.exports = ({ config }, options = {}) => config.module
  .rule('compile')
    .test(options.test || /\.jsx?$/)
    .when(options.include, rule => rule.include.merge(options.include))
    .when(options.exclude, rule => rule.exclude.merge(options.exclude))
    .use('babel')
      .loader(require.resolve('babel-loader'))
      .options(merge({ cacheDirectory: true }, options.babel || {}));

function mergeArray(source = [], overrides = []) {
  if (!source.length) {
    return overrides;
  }

  if (!overrides.length) {
    return source;
  }

  return overrides.reduce((reduction, override) => {
    const overrideName = Array.isArray(override) ? override[0] : override;
    const overrideOptions = Array.isArray(override) ? override[1] : {};
    const base = reduction.find((base) => {
      const baseName = Array.isArray(base) ? base[0] : base;

      return baseName === overrideName || baseName.includes(overrideName);
    });

    if (!base) {
      reduction.push(override);
      return reduction;
    }

    const index = reduction.indexOf(base);
    const baseName = Array.isArray(base) ? base[0] : base;
    const baseOptions = Array.isArray(base) ? base[1] : {};
    const options = merge(baseOptions, overrideOptions);

    // eslint-disable-next-line no-param-reassign
    reduction[index] = Object.keys(options).length ? [baseName, options] : baseName;

    return reduction;
  }, source);
}

function babel(source = {}, overrides = {}) {
  return merge.all([
    omit(['plugins', 'presets', 'env'], source),
    omit(['plugins', 'presets', 'env'], overrides),
    {
      plugins: mergeArray(source.plugins, overrides.plugins),
      presets: mergeArray(source.presets, overrides.presets)
    },
    ...[...new Set([
      ...Object.keys(source.env || {}),
      ...Object.keys(overrides.env || {})
    ])].map(name => ({
      env: {
        [name]: (() => {
          if (source.env && source.env[name] && (!overrides.env || !overrides.env[name])) {
            return source.env[name];
          }

          if (overrides.env && overrides.env[name] && (!source.env || !source.env[name])) {
            return overrides.env[name];
          }

          return babel(source.env[name], overrides.env[name]);
        })()
      }
    }))
  ]);
}

module.exports.merge = babel;
