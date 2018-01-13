const Config = require('webpack-chain');
const merge = require('deepmerge');
const Future = require('fluture');
const mitt = require('mitt');
const { join } = require('path');
const {
  defaultTo, is, map, omit, replace
} = require('ramda');
const { normalizePath, toArray, req, pathOptions } = require('./utils');

class Api {
  constructor(options) {
    this.options = this.getOptions(options);
    this.listeners = {};
    this.emitter = mitt(this.listeners);
    this.commands = {};
    this.commandDescriptions = {};
    this.config = new Config();
  }

  // getOptions :: Object? -> IO Object
  getOptions(opts = {}) {
    let moduleExtensions = new Set(['js', 'jsx', 'vue', 'ts', 'tsx', 'mjs']);
    const options = merge.all([
      {
        env: {
          NODE_ENV: 'development'
        },
        debug: false,
        quiet: false
      },
      opts.mains ? { mains: opts.mains } : { mains: { index: 'index' } },
      omit(['mains'], opts)
    ]);

    Object
      .keys(options.env)
      .forEach(env => process.env[env] = options.env[env]);

    pathOptions.forEach(([path, defaultValue, getNormalizeBase]) => {
      let value = defaultTo(defaultValue, options[path]);

      Object.defineProperty(options, path, {
        enumerable: true,
        get() {
          return normalizePath(getNormalizeBase(options), value);
        },
        set(newValue) {
          value = defaultTo(defaultValue, newValue);
        }
      });
    });

    try {
      options.packageJson = require(join(options.root, 'package.json')); // eslint-disable-line global-require
    } catch (err) {
      options.packageJson = null;
    }

    Object.defineProperty(options, 'extensions', {
      enumerable: true,
      get() {
        return [...moduleExtensions];
      },
      set(extensions) {
        moduleExtensions = new Set(extensions.map(replace('.', '')));
      }
    });

    this.bindMainsOnOptions(options);

    return options;
  }

  // mergeOptions :: (Object -> Object) -> Object
  mergeOptions(options, newOptions) {
    /* eslint-disable no-param-reassign */
    const paths = pathOptions.map(([path]) => path);

    Object
      .keys(newOptions)
      .forEach((key) => {
        if (key === 'mains') {
          this.bindMainsOnOptions(newOptions, options);
          options.mains = newOptions.mains;
          return;
        }

        const value = newOptions[key];

        if (paths.includes(key)) {
          options[key] = value;
          return;
        }

        // Only merge values if there is an existing value to merge with,
        // and if the value types match, and if the value types are both
        // objects or both arrays. Otherwise just replace the old value
        // with the new value.
        if (
          options[key] &&
          (
            is(Object, options[key]) && is(Object, value) ||
            is(Array, options[key]) && is(Array, value)
          )
        ) {
          options[key] = merge(options[key], newOptions[key]);
        } else {
          options[key] = newOptions[key];
        }
      });

    /* eslint-enable no-param-reassign */
    return options;
  }

  // bindMainsOnOptions :: (Object options -> Object? optionsSource) -> IO ()
  bindMainsOnOptions(options, optionsSource) {
    Object
      .keys(options.mains)
      .forEach(key => {
        let value = options.mains[key];

        Object.defineProperty(options.mains, key, {
          enumerable: true,
          get() {
            const source = optionsSource && optionsSource.source || options.source;

            return normalizePath(source, value);
          },
          set(newValue) {
            value = newValue;
          }
        });
      });

    this.mainsProxy = new Proxy(options.mains, {
      defineProperty: (target, prop, { value }) => {
        let currentValue = value;

        return Reflect.defineProperty(target, prop, {
          enumerable: true,
          get() {
            const source = optionsSource && optionsSource.source || options.source;

            return normalizePath(source, currentValue);
          },
          set(newValue) {
            currentValue = newValue;
          }
        });
      }
    });
  }

  // regexFromExtensions :: Array extensions -> RegExp
  regexFromExtensions(extensions = this.options.extensions) {
    return new RegExp(String.raw`\.(${extensions.join('|')})$`);
  }

  // emit :: Any -> IO
  emit(...args) {
    return this.emitter.emit(...args);
  }

  // emit :: Any -> IO
  on(...args) {
    return this.emitter.on(...args);
  }

  // emit :: Any -> IO
  off(...args) {
    return this.emitter.off(...args);
  }

  // emitForAll :: String eventName -> Any payload -> Promise
  emitForAll(eventName, payload) {
    return Promise.all([
      ...(this.listeners[eventName] || []).map(f => f(payload)),
      ...(this.listeners['*'] || []).map(f => f(eventName, payload))
    ]);
  }

  // register :: (String commandName -> Function handler -> String? description) -> Api
  register(commandName, handler, description = '') {
    this.commands[commandName] = handler;
    this.commandDescriptions[commandName] = description;
    return this;
  }

  // require :: String moduleId -> Any
  require(moduleId, root = this.options.root) {
    return req(moduleId, root);
  }

  // use :: Any middleware -> Object options -> IO Api
  use(middleware, options) {
    if (is(Function, middleware)) {
      // If middleware is a function, invoke it with the provided options
      middleware(this, options);
    } else if (is(String, middleware)) {
      // If middleware is a string, it's a module to require. Require it, then run the results back
      // through .use() with the provided options
      this.use(this.require(middleware, this.options.root), options);
    } else if (is(Array, middleware)) {
      // If middleware is an array, it's a pair of some other middleware type and options
      this.use(...middleware);
    } else if (is(Object, middleware)) {
      // If middleware is an object, it could contain other middleware in its "use" property.
      // Run every item in "use" prop back through .use(), plus set any options.
      // The value of "env" will also be consumed as middleware, which will potentially load more middleware and
      // options
      if (middleware.options) {
        this.options = this.mergeOptions(this.options, middleware.options);
      }

      if (middleware.env) {
        const envMiddleware = Object
          .keys(middleware.env)
          .map((key) => {
            const envValue = this.options.env[key] || process.env[key];
            const env = middleware.env[key][envValue];

            if (!env) {
              return null;
            }

            if (!is(Object, env) || !env.options) {
              return env;
            }

            this.options = this.mergeOptions(this.options, env.options);

            return omit(['options'], env);
          });

        if (Array.isArray(middleware.use)) {
          map(use => this.use(use), middleware.use);
        } else {
          this.use(middleware.use);
        }

        map(env => this.use(env), envMiddleware.filter(Boolean));
      } else if (middleware.use) {
        if (Array.isArray(middleware.use)) {
          map(use => this.use(use), middleware.use);
        } else {
          this.use(middleware.use);
        }
      }
    }

    return this;
  }

  // call :: String commandName -> IO Any
  call(commandName) {
    const command = this.commands[commandName];

    if (!command) {
      throw new Error(`A command with the name "${commandName}" was not registered`);
    }

    return command(this.config.toConfig(), this);
  }

  // run :: String commandName -> Future
  run(commandName) {
    const emitForAll = this.emitForAll.bind(this);

    return Future((reject, resolve) => (this.commands[commandName] ?
      resolve() :
      reject(new Error(`A command with the name "${commandName}" was not registered`))
    ))
    // Trigger all pre-events for the current command
    .chain(() => Future.encaseP2(emitForAll, `pre${commandName}`, this.options.args))
    // Trigger generic pre-event
    .chain(() => Future.encaseP2(emitForAll, 'prerun', this.options.args))
    // Execute the command
    .chain(() => {
      const result = this.commands[commandName](this.config.toConfig(), this);

      return Future.isFuture(result) ?
        result :
        Future.tryP(() => Promise.resolve().then(() => result));
    })
    // Trigger all post-command events, resolving with the value of the command execution
    .chain(value => Future
      .encaseP2(emitForAll, commandName, this.options.args)
      .chain(() => Future.of(value)))
    // Trigger generic post-event, resolving with the value of the command execution
    .chain(value => Future
      .encaseP2(emitForAll, 'run', this.options.args)
      .chain(() => Future.of(value)))
    .mapRej(toArray);
  }
}

module.exports = options => new Api(options);
