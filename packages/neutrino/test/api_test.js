const { join } = require('path');
const Neutrino = require('../Neutrino');

test('initializes with no arguments', () => {
  expect(() => new Neutrino()).not.toThrow();
});

test('initializes with options', () => {
  expect(() => new Neutrino({ testing: true })).not.toThrow();
});

test('initialization stores options', () => {
  const options = { alpha: 'a', beta: 'b', gamma: 'c' };
  const api = new Neutrino(options);

  expect(api.options.alpha).toBe(options.alpha);
  expect(api.options.beta).toBe(options.beta);
  expect(api.options.gamma).toBe(options.gamma);
});

test('options.root', () => {
  const api = new Neutrino();

  expect(api.options.root).toBe(process.cwd());
  api.options.root = './alpha';
  expect(api.options.root).toBe(join(process.cwd(), 'alpha'));
  api.options.root = '/alpha';
  expect(api.options.root).toBe('/alpha');
});

test('options.source', () => {
  const api = new Neutrino();

  expect(api.options.source).toBe(join(process.cwd(), 'src'));
  api.options.source = './alpha';
  expect(api.options.source).toBe(join(process.cwd(), 'alpha'));
  api.options.root = '/beta';
  expect(api.options.source).toBe(join('/beta', 'alpha'));
  api.options.source = '/alpha';
  expect(api.options.source).toBe('/alpha');
});

test('options.output', () => {
  const api = new Neutrino();

  expect(api.options.output).toBe(join(process.cwd(), 'build'));
  api.options.output = './alpha';
  expect(api.options.output).toBe(join(process.cwd(), 'alpha'));
  api.options.root = '/beta';
  expect(api.options.output).toBe(join('/beta', 'alpha'));
  api.options.output = '/alpha';
  expect(api.options.output).toBe('/alpha');
});

test('options.tests', () => {
  const api = new Neutrino();

  expect(api.options.tests).toBe(join(process.cwd(), 'test'));
  api.options.tests = './alpha';
  expect(api.options.tests).toBe(join(process.cwd(), 'alpha'));
  api.options.root = '/beta';
  expect(api.options.tests).toBe(join('/beta', 'alpha'));
  api.options.tests = '/alpha';
  expect(api.options.tests).toBe('/alpha');
});

test('throws when legacy options.node_modules is set', () => {
  expect(() => new Neutrino({ node_modules: 'abc' })).toThrow(
    /options\.node_modules has been removed/,
  );
});

test('throws when legacy options.host is set', () => {
  expect(() => new Neutrino({ host: 'abc' })).toThrow(
    /options\.host has been removed/,
  );
});

test('throws when legacy options.port is set', () => {
  expect(() => new Neutrino({ port: 1234 })).toThrow(
    /options\.port has been removed/,
  );
});

test('options.mains', () => {
  const api = new Neutrino();

  expect(api.options.mains.index).toEqual({
    entry: join(process.cwd(), 'src/index'),
  });
  api.options.mains.index = './alpha.js';
  expect(api.options.mains.index).toEqual({
    entry: join(process.cwd(), 'src/alpha.js'),
  });
  api.options.source = 'beta';
  expect(api.options.mains.index).toEqual({
    entry: join(process.cwd(), 'beta/alpha.js'),
  });
  api.options.root = '/gamma';
  expect(api.options.mains.index).toEqual({
    entry: join('/gamma', 'beta/alpha.js'),
  });
  api.options.mains.index = '/alpha.js';
  expect(api.options.mains.index).toEqual({ entry: '/alpha.js' });
});

test('override options.mains', () => {
  const api = new Neutrino({
    mains: {
      alpha: 'beta',
      gamma: {
        entry: 'delta',
        title: 'Gamma Page',
      },
    },
  });

  expect(api.options.mains.alpha).toEqual({
    entry: join(process.cwd(), 'src/beta'),
  });
  api.options.mains.alpha = { entry: './alpha.js', minify: false };
  expect(api.options.mains.alpha).toEqual({
    entry: join(process.cwd(), 'src/alpha.js'),
    minify: false,
  });
  api.options.source = 'epsilon';
  expect(api.options.mains.alpha).toEqual({
    entry: join(process.cwd(), 'epsilon/alpha.js'),
    minify: false,
  });
  api.options.root = '/zeta';
  expect(api.options.mains.alpha).toEqual({
    entry: join('/zeta', 'epsilon/alpha.js'),
    minify: false,
  });
  api.options.mains.alpha = '/alpha.js';
  expect(api.options.mains.alpha).toEqual({ entry: '/alpha.js' });

  expect(api.options.mains.gamma).toEqual({
    entry: join('/zeta', 'epsilon/delta'),
    title: 'Gamma Page',
  });
  api.options.mains.gamma = './alpha.js';
  expect(api.options.mains.gamma).toEqual({
    entry: join('/zeta', 'epsilon/alpha.js'),
  });
  api.options.source = 'src';
  expect(api.options.mains.gamma).toEqual({
    entry: join('/zeta', 'src/alpha.js'),
  });
  api.options.root = process.cwd();
  expect(api.options.mains.gamma).toEqual({
    entry: join(process.cwd(), 'src/alpha.js'),
  });
  api.options.mains.gamma = '/alpha.js';
  expect(api.options.mains.gamma).toEqual({ entry: '/alpha.js' });
});

test('override options.mains.index template', () => {
  const api = new Neutrino({
    mains: {
      index: {
        template: 'alpha.eps',
      },
    },
  });

  expect(api.options.mains.index).toEqual({
    entry: join(process.cwd(), 'src/index'),
    template: 'alpha.eps',
  });
});

test('creates an instance of webpack-chain', () => {
  expect(typeof new Neutrino().config.toConfig).toBe('function');
});

test('middleware receives API instance', () => {
  const api = new Neutrino();

  api.use((n) => expect(n).toBe(api));
});

test('middleware fails on more than one argument', () => {
  const api = new Neutrino();
  const errorMatch = /middleware only accepts a single argument/;

  /* eslint-disable no-unused-vars */
  expect(() => api.use(function good() {})).not.toThrow();
  expect(() => api.use(function good(neutrino) {})).not.toThrow();
  expect(() => api.use(function bad(neutrino, options) {})).toThrow(errorMatch);
  /* eslint-enable no-unused-vars */
});

test('middleware only accepts functions', () => {
  const api = new Neutrino();
  const errorMatch = /middleware can only be passed as functions/;

  expect(() => api.use(function good() {})).not.toThrow();
  expect(() => api.use('bad')).toThrow(errorMatch);
  expect(() => api.use(['bad', { alpha: 'beta' }])).toThrow(errorMatch);
  expect(() => api.use({ alpha: 'beta' })).toThrow(errorMatch);
});

test('creates a webpack config', () => {
  const api = new Neutrino();

  api.use((api) => {
    api.config.module.rule('compile').test(api.regexFromExtensions(['js']));
  });

  expect(api.config.toConfig()).not.toEqual({});
});

test('regexFromExtensions', () => {
  const api = new Neutrino();

  expect(String(api.regexFromExtensions())).toBe('/\\.(mjs|jsx|js)$/');
  expect(String(api.regexFromExtensions(['js']))).toBe('/\\.js$/');
  expect(String(api.regexFromExtensions(['js', 'css']))).toBe('/\\.(js|css)$/');
  expect(String(api.regexFromExtensions(['worker.js', 'worker.jsx']))).toBe(
    '/\\.(worker\\.js|worker\\.jsx)$/',
  );
});

test('getDependencyVersion', () => {
  const api = new Neutrino();

  api.options.packageJson = {
    devDependencies: {
      neutrino: '^9',
    },
    dependencies: {
      'core-js': '^3',
    },
  };

  expect(api.getDependencyVersion('neutrino').major).toBe(9);
  expect(api.getDependencyVersion('core-js').major).toBe(3);
  expect(api.getDependencyVersion('eslint')).toBe(false);
});

test('extensions option overrides defaults', () => {
  const extensions = ['ts'];
  const api = new Neutrino({ extensions });

  expect(api.options.extensions).toEqual(extensions);
});
