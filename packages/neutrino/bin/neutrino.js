#!/usr/bin/env node

// TODO: Remove this once babel-loader updates
// https://github.com/babel/babel-loader/pull/391
process.noDeprecation = true;

const yargs = require('yargs');
const {
  cond, equals, map, omit, T
} = require('ramda');
const build = require('./build');
const inspect = require('./inspect');
const start = require('./start');
const test = require('./test');
const execute = require('./execute');
const { exists, req } = require('../src/utils');

const cwd = process.cwd();
const cli = yargs
  .usage('Usage: $0 <command> [options]')
  .help(false)
  .option('help', {
    description: 'Show help',
    boolean: true,
    default: false,
    global: true
  })
  .option('inspect', {
    description: 'Output a string representation of the configuration used by webpack and exit',
    boolean: true,
    default: false,
    global: true
  })
  .option('use', {
    description: 'A list of Neutrino middleware used to configure the build',
    array: true,
    default: [],
    global: true
  })
  .option('options', {
    description: 'Set Neutrino options, config, and environment variables, e.g. --options.env.NODE_ENV production',
    default: {},
    global: true
  })
  .option('quiet', {
    description: 'Disable console output of CLI commands',
    boolean: true,
    default: false,
    global: true
  })
  .option('debug', {
    description: 'Run in debug mode',
    boolean: true,
    default: false,
    global: true
  })
  .option('require', {
    description: 'Preload a module prior to loading Neutrino; can be used multiple times',
    array: true,
    default: [],
    global: true
  })
  .option('no-tty', {
    description: 'Disable text terminal interactions',
    boolean: true,
    default: false,
    global: true
  })
  .command('start', 'Build a project in development mode')
  .command('build', 'Compile the source directory to a bundled build')
  .command('test [files..]', 'Run all suites from the test directory or provided files', {
    coverage: {
      description: 'Collect test coverage information and generate report',
      boolean: true,
      default: false
    },
    watch: {
      description: 'Watch source files for changes and re-run tests',
      boolean: true,
      default: false
    }
  })
  .wrap(null);
const args = cli.argv;
const command = args._[0];
const rc = '.neutrinorc.js';
const cmd = args.inspect ? 'inspect' : command;
const hasRc = exists(process.cwd(), rc);
const middleware = [...new Set(hasRc ? [rc] : args.use)];

if (!middleware.length) {
  throw new Error('No middleware was found. Specify middleware with --use or create a .neutrinorc.js file.');
}

global.interactive = !args.noTty && (process.stderr && process.stderr.isTTY) && !process.env.CI;

// Merge CLI config options as last piece of middleware, e.g. options.config.devServer.port 4000
if (args.options) {
  middleware.push({
    options: omit(['config'], args.options),
    use: args.options.config && (({ config }) => {
      config.merge(args.options.config)
    })
  });
}

process.on('unhandledRejection', (err) => {
  if (!args.quiet) {
    console.error('');
    console.error(err);
  }

  process.exit(1);
});

const promises = map((moduleId) => {
  const module = req(moduleId, cwd);

  return typeof module === 'function' ? module() : module;
}, args.require);

Promise
  .all(promises)
  .then(() => cond([
    [equals('build'), () => build(middleware, args, cli)],
    [equals('start'), () => start(middleware, args, cli)],
    [equals('test'), () => test(middleware, args, cli)],
    [equals('inspect'), () => inspect(middleware, args, cli)],
    [T, () => execute(middleware, args, cli)]
  ])(cmd));
