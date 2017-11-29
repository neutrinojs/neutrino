const Config = require('webpack-chain');
const merge = require('deepmerge');
const Future = require('fluture');
const mitt = require('mitt');
const {
  defaultTo, is, map, omit, prop
} = require('ramda');
const { normalizePath, toArray, req } = require('./utils');

// getRoot :: Object -> String
const getRoot = prop('root');

// getSource :: Object -> String
const getSource = prop('source');

// [PATH_PROP_NAME, DEFAULT_VALUE, GET_NORMALIZE_BASE]
const pathOptions = [
  ['root', '', () => process.cwd()],
  ['source', 'src', getRoot],
  ['output', 'build', getRoot],
  ['tests', 'test', getRoot],
  ['node_modules', 'node_modules', getRoot],
  ['static', 'static', getSource],
  ['entry', 'index', getSource]
];

// getOptions :: Object? -> IO Object
const getOptions = (opts = {}) => {
  let moduleExtensions = new Set(['js', 'jsx', 'vue', 'ts', 'mjs', 'json']);
  const options = merge({
    env: {
      NODE_ENV: 'development'
    },
    debug: false,
    quiet: false
  }, opts);

  Object.defineProperty(options, 'extensions', {
    enumerable: true,
    get() {
      return [...moduleExtensions];
    },
    set(extensions) {
      moduleExtensions = new Set(extensions.map(ext => ext.replace('.', '')));
    }
  });

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

  return options;
};

/* eslint-disable no-param-reassign */
const mergeOptions = (options, newOptions) => {
  const paths = pathOptions.map(([path]) => path);

  Object
    .keys(newOptions)
    .forEach((key) => {
      if (paths.includes(key)) {
        options[key] = newOptions[key];
        return;
      }

      if (!options[key]) {
        options[key] = newOptions[key];
      } else {
        options[key] = merge(options[key], newOptions[key]);
      }
    });

  return options;
};
/* eslint-enable no-param-reassign */

class Api {
  constructor(options) {
    this.options = getOptions(options);
    this.listeners = {};
    this.emitter = mitt(this.listeners);
    this.commands = {};
    this.config = new Config();
  }

  regexFromExtensions(extensions = this.options.extensions) {
    return new RegExp(`.(${extensions.join('|')})$`);
  }

  emit(...args) {
    return this.emitter.emit(...args);
  }

  on(...args) {
    return this.emitter.on(...args);
  }

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

  // register :: String commandName -> Function handler -> Api
  register(commandName, handler) {
    this.commands[commandName] = handler;
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
        this.options = mergeOptions(this.options, middleware.options);
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

            this.options = mergeOptions(this.options, env.options);

            return omit(['options'], env);
          });

        if (middleware.use) {
          map(use => this.use(use), middleware.use);
        }

        map(env => this.use(env), envMiddleware.filter(Boolean));
      } else if (middleware.use) {
        map(use => this.use(use), middleware.use);
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
    const command = this.commands[commandName];

    return Future((reject, resolve) => (command ?
      resolve() :
      reject(new Error(`A command with the name "${commandName}" was not registered`))))
    // Trigger all pre-events for the current command
    .chain(() => Future.encaseP2(emitForAll, `pre${commandName}`, this.options.args))
    // Trigger generic pre-event
    .chain(() => Future.encaseP2(emitForAll, 'prerun', this.options.args))
    // Execute the command
    .chain(() => {
      const result = command(this.config.toConfig(), this);

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
