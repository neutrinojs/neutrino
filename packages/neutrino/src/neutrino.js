const { join, isAbsolute } = require('path');
const { EventEmitter } = require('events');
const Config = require('webpack-chain');
const merge = require('deepmerge');
const { defaultTo, identity } = require('ramda');
const requireMiddleware = require('./requireMiddleware');
const build = require('./webpack/build');
const develop = require('./webpack/develop');
const watch = require('./webpack/watch');

const normalizePath = (path, root) => (isAbsolute(path) ? path : join(root, path));

module.exports = class Neutrino extends EventEmitter {
  constructor(options = {}) {
    super();

    const root = normalizePath(options.root || '', process.cwd());
    const source = normalizePath(options.source || 'src', root);
    const output = normalizePath(options.output || 'build', root);
    const tests = normalizePath(options.tests || 'test', root);
    const node_modules = normalizePath(options.node_modules || 'node_modules', root); // eslint-disable-line camelcase
    const entry = normalizePath(options.entry || 'index.js', source);

    this.config = new Config();
    this.options = merge(options, { root, source, output, tests, node_modules, entry });
  }

  use(middleware, options = {}) {
    middleware(this, options);
  }

  import(middleware) {
    this.require(middleware).forEach(middleware => this.use(middleware));
  }

  require(middleware) {
    return requireMiddleware(middleware, this.options);
  }

  getWebpackConfig() {
    return this.config.toConfig();
  }

  emitForAll(eventName, payload) {
    return Promise.all(this.listeners(eventName).map(fn => fn(payload)));
  }

  build(args) {
    return this.runCommand('build', args, build);
  }

  start(args) {
    return this.runCommand('start', args, this.getWebpackConfig().devServer ? develop : watch);
  }

  test(args) {
    return this.runCommand('test', args);
  }

  runCommand(command, args = {}, fn = identity) {
    process.env.NODE_ENV = defaultTo({
      build: 'production',
      start: 'development',
      test: 'test'
    }[command], args.env);

    return this
      .emitForAll(`pre${command}`, args)
      .then(() => fn(this.getWebpackConfig()))
      .then(() => this.emitForAll(command, args));
  }
}
