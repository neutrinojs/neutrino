const clone = require('lodash.clonedeep');
const Config = require('webpack-chain');
const { isAbsolute, join } = require('path');
const { ConfigurationError } = require('./errors');
const { source } = require('./extensions');

const getRoot = ({ root }) => root;
const normalizePath = (base, path) =>
  (isAbsolute(path) ? path : join(base, path));
const pathOptions = [
  ['root', '', () => process.cwd()],
  ['source', 'src', getRoot],
  ['output', 'build', getRoot],
  ['tests', 'test', getRoot]
];
// Support both a shorter string form and an object form that allows
// specifying any page-specific options supported by the preset.
const normalizeMainConfig = (config) =>
  (typeof config === 'string') ? { entry: config } : config;

module.exports = class Neutrino {
  constructor(options) {
    this.options = this.getOptions(options);
    this.config = new Config();
    this.outputHandlers = new Map();
  }

  getOptions(opts = {}) {
    let moduleExtensions = new Set(source);
    const options = {
      debug: false,
      ...clone(opts)
    };

    if (!options.mains) {
      Object.assign(options, {
        mains: {
          index: 'index'
        }
      });
    }

    pathOptions.forEach(([path, defaultValue, getNormalizeBase]) => {
      let value = options[path] || defaultValue;

      Reflect.defineProperty(options, path, {
        enumerable: true,
        get() {
          return normalizePath(getNormalizeBase(options), value);
        },
        set(newValue) {
          value = newValue || defaultValue;
        }
      });
    });

    try {
      // eslint-disable-next-line global-require, import/no-dynamic-require
      options.packageJson = require(join(options.root, 'package.json'));
    } catch (err) {
      options.packageJson = null;
    }

    Object.defineProperty(options, 'extensions', {
      enumerable: true,
      get() {
        return [...moduleExtensions];
      },
      set(extensions) {
        moduleExtensions = new Set(extensions.map(ext => ext.replace('.', '')));
      }
    });

    this.bindMainsOnOptions(options);

    return options;
  }

  bindMainsOnOptions(options, optionsSource) {
    Object
      .entries(options.mains)
      .forEach(([key, value]) => {
        let normalizedConfig = normalizeMainConfig(value);

        Reflect.defineProperty(options.mains, key, {
          enumerable: true,
          get() {
            const source = optionsSource &&
              optionsSource.source || options.source;

            return {
              ...normalizedConfig,
              // Lazily normalise the path, in case `source` changes after mains is updated.
              entry: normalizePath(source, normalizedConfig.entry || key)
            };
          },
          set(newValue) {
            normalizedConfig = normalizeMainConfig(newValue);
          }
        });
      });

    this.mainsProxy = new Proxy(options.mains, {
      defineProperty: (target, prop, { value }) => {
        let normalizedConfig = normalizeMainConfig(value);

        return Reflect.defineProperty(target, prop, {
          enumerable: true,
          get() {
            const source = optionsSource &&
              optionsSource.source || options.source;

            return {
              ...normalizedConfig,
              // Lazily normalise the path, in case `source` changes after mains is updated.
              entry: normalizePath(source, normalizedConfig.entry)
            };
          },
          set(newValue) {
            normalizedConfig = normalizeMainConfig(newValue);
          }
        });
      }
    });
  }

  regexFromExtensions(extensions = this.options.extensions) {
    const exts = extensions.map(ext => ext.replace('.', '\\.'));

    return new RegExp(
      extensions.length === 1 ?
        String.raw`\.${exts[0]}$` :
        String.raw`\.(${exts.join('|')})$`
    );
  }

  register(name, handler) {
    this.outputHandlers.set(name, handler);
  }

  use(middleware) {
    if (!middleware) {
      return;
    }

    if (typeof middleware !== 'function') {
      throw new ConfigurationError('Middleware must be a function');
    }

    middleware(this);
  }
};
