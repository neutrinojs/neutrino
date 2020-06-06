const clone = require('lodash.clonedeep');
const Config = require('webpack-chain');
const semver = require('semver');
const { isAbsolute, join } = require('path');
const { ConfigurationError } = require('./errors');
const { source } = require('./extensions');

const getRoot = ({ root }) => root;
const normalizePath = (base, path) =>
  isAbsolute(path) ? path : join(base, path);
const pathOptions = [
  ['root', '', () => process.cwd()],
  ['source', 'src', getRoot],
  ['output', 'build', getRoot],
  ['tests', 'test', getRoot],
];
// Support both a shorter string form and an object form that allows
// specifying any page-specific options supported by the preset.
const normalizeMainConfig = (config) =>
  typeof config === 'string' ? { entry: config } : config;

module.exports = class Neutrino {
  constructor(options) {
    this.options = this.getOptions(options);
    this.config = new Config();
    this.outputHandlers = new Map();
  }

  getOptions(opts = {}) {
    const options = {
      debug: false,
      extensions: new Set(source),
      ...clone(opts),
    };
    let moduleExtensions = options.extensions;

    if ('node_modules' in options) {
      throw new ConfigurationError(
        'options.node_modules has been removed. Use `neutrino.config.resolve.modules` instead.',
      );
    }

    if ('host' in options) {
      throw new ConfigurationError(
        'options.host has been removed. Configure via the `devServer.host` option of the web/react/... presets.',
      );
    }

    if ('port' in options) {
      throw new ConfigurationError(
        'options.port has been removed. Configure via the `devServer.port` option of the web/react/... presets.',
      );
    }

    if (!options.mains) {
      Object.assign(options, {
        mains: {
          index: 'index',
        },
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
        },
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
        moduleExtensions = new Set(
          extensions.map((ext) => ext.replace('.', '')),
        );
      },
    });

    this.bindMainsOnOptions(options);

    return options;
  }

  bindMainsOnOptions(options, optionsSource) {
    Object.entries(options.mains).forEach(([key, value]) => {
      let normalizedConfig = normalizeMainConfig(value);

      Reflect.defineProperty(options.mains, key, {
        enumerable: true,
        get() {
          const source =
            (optionsSource && optionsSource.source) || options.source;

          return {
            ...normalizedConfig,
            // Lazily normalise the path, in case `source` changes after mains is updated.
            entry: normalizePath(source, normalizedConfig.entry || key),
          };
        },
        set(newValue) {
          normalizedConfig = normalizeMainConfig(newValue);
        },
      });
    });

    this.mainsProxy = new Proxy(options.mains, {
      defineProperty: (target, prop, { value }) => {
        let normalizedConfig = normalizeMainConfig(value);

        return Reflect.defineProperty(target, prop, {
          enumerable: true,
          get() {
            const source =
              (optionsSource && optionsSource.source) || options.source;

            return {
              ...normalizedConfig,
              // Lazily normalise the path, in case `source` changes after mains is updated.
              entry: normalizePath(source, normalizedConfig.entry),
            };
          },
          set(newValue) {
            normalizedConfig = normalizeMainConfig(newValue);
          },
        });
      },
    });
  }

  regexFromExtensions(extensions = this.options.extensions) {
    const exts = extensions.map((ext) => ext.replace('.', '\\.'));

    return new RegExp(
      extensions.length === 1
        ? String.raw`\.${exts[0]}$`
        : String.raw`\.(${exts.join('|')})$`,
    );
  }

  getDependencyVersion(dependency) {
    const { dependencies = {}, devDependencies = {} } =
      this.options.packageJson || {};

    return (
      (dependency in dependencies || dependency in devDependencies) &&
      semver.coerce(dependencies[dependency] || devDependencies[dependency])
    );
  }

  register(name, handler) {
    this.outputHandlers.set(name, handler);
  }

  use(middleware) {
    if (!middleware) {
      return;
    }

    if (typeof middleware === 'function') {
      if (middleware.length > 1) {
        throw new ConfigurationError(
          'As of Neutrino 9, middleware only accepts a single argument\n' +
            'referencing the Neutrino API. Please check that the correct\n' +
            'value is being passed.',
        );
      }

      const extraneous = middleware(this);

      if (extraneous && typeof extraneous === 'function') {
        throw new ConfigurationError(
          'Neutrino received middleware that upon usage tried returning\n' +
            'another function. This typically indicates that the supplied\n' +
            'function should be executed and passed to Neutrino, e.g.\n\n' +
            '  use: [middleware] -> use: [middleware()]\n' +
            '  neutrino.use(middleware) -> neutrino.use(middleware())\n\n' +
            'Please check that the correct value is being passed.',
        );
      }
    } else if (typeof middleware === 'string') {
      throw new ConfigurationError(
        `"${middleware}" is specified as a string, but as of Neutrino 9,\n` +
          'middleware can only be passed as functions.\n' +
          'Use the migration tool and see the migration guide for details:\n' +
          '  https://neutrinojs.org/migrate\n' +
          '  https://neutrinojs.org/migration-guide',
      );
    } else if (Array.isArray(middleware)) {
      throw new ConfigurationError(
        `"${middleware[0]}" is specified as an array, but as of Neutrino 9,\n` +
          'middleware can only be passed as functions.\n' +
          'Use the migration tool and see the migration guide for details:\n' +
          '  https://neutrinojs.org/migrate\n' +
          '  https://neutrinojs.org/migration-guide',
      );
    } else {
      throw new ConfigurationError(
        'As of Neutrino 9, middleware can only be passed as functions.',
      );
    }
  }
};
