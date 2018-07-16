const yargs = require('yargs');
const Neutrino = require('./Neutrino');
const webpack = require('./webpack');

const configPrefix = 'neutrino.config';

module.exports = (middleware = { use: ['.neutrinorc.js'] }, options = {}) => {
  const neutrino = new Neutrino(options);
  const { argv } = yargs;
  let { mode } = argv;

  if (mode) {
    // If specified, --mode takes priority and overrides any existing NODE_ENV.
    process.env.NODE_ENV = mode;
  } else if (process.env.NODE_ENV) {
    // Development mode is most appropriate for a !production NODE_ENV (such as `NODE_ENV=test`).
    mode = (process.env.NODE_ENV === 'production') ? 'production' : 'development';
  } else {
    // Default NODE_ENV to the more strict value, to save needing to do so in .eslintrc.js.
    // However don't set `mode` since webpack already defaults it to `production`, and in so
    // doing outputs a useful message informing users that they are relying on the defaults.
    process.env.NODE_ENV = 'production';
  }

  if (mode) {
    neutrino.config.mode(mode);
  }

  neutrino.register('webpack', webpack);

  if (middleware) {
    neutrino.use(middleware);
  }

  const adapter = {
    output(name) {
      if (name === 'inspect') {
        console.log(neutrino.config.toString({ configPrefix }));
        process.exit();
      }

      const handler = neutrino.outputHandlers.get(name);

      if (!handler) {
        throw new Error(`Unable to find an output handler named "${name}"`);
      }

      return handler(neutrino);
    }
  };

  return new Proxy(adapter, {
    get(object, property) {
      return property === 'output'
        ? Reflect.get(object, property)
        : Reflect.get(object, 'output').bind(object, property);
    }
  });
};
