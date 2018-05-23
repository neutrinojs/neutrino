const stringify = require('javascript-stringify');
const sort = require('deep-sort-object');
const yargs = require('yargs');
const Neutrino = require('./Neutrino');
const webpack = require('./webpack');

const IDENTITY = a => a;

module.exports = (middleware = { use: ['.neutrinorc.js'] }, options = {}) => {
  const neutrino = new Neutrino(options);
  const args = yargs.parse(process.argv);
  const mode = args.mode || 'production';

  if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = mode;
  }

  neutrino.config.mode(mode);
  neutrino.register('webpack', webpack);

  if (middleware) {
    neutrino.use(middleware);
  }

  const adapter = {
    output(name, override = IDENTITY) {
      if (name === 'inspect') {
        console.log(stringify(sort(neutrino.config.toConfig()), null, 2));
        process.exit();
      }

      const handler = neutrino.outputHandlers.get(name);

      if (!handler) {
        throw new Error(`Unable to find an output handler named "${name}"`);
      }

      return handler(neutrino, override);
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
