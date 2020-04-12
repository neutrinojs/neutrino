const { resolve } = require('path');

const { validate } = require('webpack');

const lint = require('../../eslint');
const Neutrino = require('../../neutrino/Neutrino');

const mw = (...args) => require('..')(...args);
const expectedExtensions = ['.wasm', '.mjs', '.jsx', '.js', '.json'];
const originalNodeEnv = process.env.NODE_ENV;

afterEach(() => {
  // Restore the original NODE_ENV after each test (which Jest defaults to 'test').
  process.env.NODE_ENV = originalNodeEnv;
});

test('loads preset', () => {
  expect(() => require('..')).not.toThrow();
});

test('uses preset', () => {
  expect(() => new Neutrino().use(mw())).not.toThrow();
});

test('valid preset production', () => {
  process.env.NODE_ENV = 'production';
  const api = new Neutrino();
  api.use(mw());
  const config = api.config.toConfig();

  // Common
  expect(config.target).toBe('web');
  expect(config.resolve.extensions).toEqual(expectedExtensions);
  expect(config.optimization.runtimeChunk).toBe('single');
  expect(config.optimization.splitChunks.chunks).toBe('all');
  expect(config.stats).toEqual({
    children: false,
    entrypoints: false,
    modules: false,
  });

  // NODE_ENV/command specific
  expect(config.optimization.minimize).toBe(true);
  expect(config.optimization.splitChunks.name).toBe(false);
  expect(config.output.publicPath).toBe('/');
  expect(config.devtool).toBeUndefined();
  expect(config.devServer).toBeUndefined();

  const errors = validate(config);
  expect(errors).toHaveLength(0);
});

test('valid preset development', () => {
  process.env.NODE_ENV = 'development';
  const api = new Neutrino();
  api.use(mw());
  const config = api.config.toConfig();

  // Common
  expect(config.target).toBe('web');
  expect(config.resolve.extensions).toEqual(expectedExtensions);
  expect(config.optimization.runtimeChunk).toBe('single');
  expect(config.optimization.splitChunks.chunks).toBe('all');
  expect(config.output.publicPath).toBe('/');
  expect(config.stats).toEqual({
    children: false,
    entrypoints: false,
    modules: false,
  });

  // NODE_ENV/command specific
  expect(config.optimization.minimize).toBe(false);
  expect(config.optimization.splitChunks.name).toBe(true);
  expect(config.devtool).toBe('cheap-module-eval-source-map');
  expect(config.devServer).toEqual({
    historyApiFallback: true,
    hot: true,
    overlay: true,
    port: 5000,
    stats: {
      all: false,
      errors: true,
      timings: true,
      warnings: true,
    },
  });

  const errors = validate(config);
  expect(errors).toHaveLength(0);
});

test('valid preset test', () => {
  process.env.NODE_ENV = 'test';
  const api = new Neutrino();
  api.use(mw());
  const config = api.config.toConfig();

  // Common
  expect(config.target).toBe('web');
  expect(config.resolve.extensions).toEqual(expectedExtensions);
  expect(config.optimization.runtimeChunk).toBe('single');
  expect(config.optimization.splitChunks.chunks).toBe('all');
  expect(config.output.publicPath).toBe('/');
  expect(config.stats).toEqual({
    children: false,
    entrypoints: false,
    modules: false,
  });

  // NODE_ENV/command specific
  expect(config.optimization.minimize).toBe(false);
  expect(config.optimization.splitChunks.name).toBe(true);
  expect(config.devtool).toBe('source-map');
  expect(config.devServer).toBeUndefined();

  const errors = validate(config);
  expect(errors).toHaveLength(0);
});

test('devtool string option production', () => {
  process.env.NODE_ENV = 'production';
  const api = new Neutrino();
  api.use(mw({ devtool: 'source-map' }));
  const config = api.config.toConfig();

  expect(config.devtool).toBe('source-map');
});

test('devtool object option production', () => {
  process.env.NODE_ENV = 'production';
  const api = new Neutrino();
  api.use(
    mw({
      devtool: {
        production: 'source-map',
      },
    }),
  );
  const config = api.config.toConfig();

  expect(config.devtool).toBe('source-map');
});

test('devtool string option development', () => {
  process.env.NODE_ENV = 'development';
  const api = new Neutrino();
  api.use(mw({ devtool: 'source-map' }));
  const config = api.config.toConfig();

  expect(config.devtool).toBe('source-map');
});

test('devtool object option development', () => {
  process.env.NODE_ENV = 'development';
  const api = new Neutrino();
  api.use(
    mw({
      devtool: {
        development: 'source-map',
      },
    }),
  );
  const config = api.config.toConfig();

  expect(config.devtool).toBe('source-map');
});

test('devtool string option test', () => {
  process.env.NODE_ENV = 'test';
  const api = new Neutrino();
  api.use(mw({ devtool: 'cheap-eval-source-map' }));
  const config = api.config.toConfig();

  expect(config.devtool).toBe('cheap-eval-source-map');
});

test('devtool object option test', () => {
  process.env.NODE_ENV = 'test';
  const api = new Neutrino();
  api.use(
    mw({
      devtool: {
        test: 'cheap-eval-source-map',
      },
    }),
  );
  const config = api.config.toConfig();

  expect(config.devtool).toBe('cheap-eval-source-map');
});

test('supports env option using array form', () => {
  const api = new Neutrino();

  const env = ['VAR1', 'VAR2'];
  api.use(mw({ env }));
  expect(api.config.plugin('env').get('args')).toEqual([env]);
});

test('supports env option using object form', () => {
  const api = new Neutrino();

  const env = { VAR: 'default-value' };
  api.use(mw({ env }));
  expect(api.config.plugin('env').get('args')).toEqual([env]);
});

test('supports multiple mains with custom html-webpack-plugin options', () => {
  const mains = {
    index: './index',
    admin: {
      entry: './admin',
      title: 'Admin Dashboard',
    },
  };
  const api = new Neutrino({ mains });

  api.use(mw({ html: { title: 'Default Title', minify: false } }));

  const templatePath = resolve(__dirname, '../../html-template/template.ejs');

  expect(api.config.plugin('html-index').get('args')).toEqual([
    {
      appMountId: 'root',
      chunks: ['index'],
      filename: 'index.html',
      lang: 'en',
      meta: {
        viewport: 'width=device-width, initial-scale=1',
      },
      minify: false,
      template: templatePath,
      title: 'Default Title',
    },
  ]);

  expect(api.config.plugin('html-admin').get('args')).toEqual([
    {
      appMountId: 'root',
      chunks: ['admin'],
      filename: 'admin.html',
      lang: 'en',
      meta: {
        viewport: 'width=device-width, initial-scale=1',
      },
      minify: false,
      template: templatePath,
      title: 'Admin Dashboard',
    },
  ]);
});

test('throws when used twice', () => {
  const api = new Neutrino();
  api.use(mw());
  expect(() => api.use(mw())).toThrow(
    /@neutrinojs\/web is being used when a `compile` rule already exists/,
  );
});

test('throws when minify.babel defined', () => {
  const api = new Neutrino();
  expect(() => api.use(mw({ minify: { babel: false } }))).toThrow(
    /The minify\.babel option has been removed/,
  );
});

test('throws when minify.image defined', () => {
  const api = new Neutrino();
  expect(() => api.use(mw({ minify: { image: true } }))).toThrow(
    /The minify\.image option has been removed/,
  );
});

test('throws when minify.style defined', () => {
  const api = new Neutrino();
  expect(() => api.use(mw({ minify: { style: false } }))).toThrow(
    /The minify\.style option has been removed/,
  );
});

test('throws when polyfills defined', () => {
  const api = new Neutrino();
  expect(() => api.use(mw({ polyfills: {} }))).toThrow(
    /The polyfills option has been removed/,
  );
});

test('throws when manifest defined', () => {
  const api = new Neutrino();
  expect(() => api.use(mw({ manifest: {} }))).toThrow(
    /The manifest option has been removed/,
  );
});

test('throws when hotEntries defined', () => {
  const api = new Neutrino();
  expect(() => api.use(mw({ hotEntries: [] }))).toThrow(
    /The hotEntries option has been removed/,
  );
});

test('throws when devServer.proxy is the deprecated string shorthand', () => {
  const api = new Neutrino();
  expect(() => api.use(mw({ devServer: { proxy: 'foo' } }))).toThrow(
    /setting `devServer.proxy` to a string is no longer supported/,
  );
});

test('throws when style.extract is true', () => {
  const api = new Neutrino();
  expect(() => api.use(mw({ style: { extract: true } }))).toThrow(
    /Setting `style.extract` to `true` is no longer supported/,
  );
});

test('targets option test', () => {
  const api = new Neutrino();
  const targets = {
    browsers: ['last 2 iOS versions'],
  };
  api.use(mw({ targets }));

  expect(
    api.config.module.rule('compile').use('babel').get('options').presets[0][1]
      .targets,
  ).toEqual(targets);
});

test('targets false option test', () => {
  const api = new Neutrino();
  api.use(mw({ targets: false }));

  expect(
    api.config.module.rule('compile').use('babel').get('options').presets[0][1]
      .targets,
  ).toEqual({});
});

test('updates lint config by default', () => {
  const api = new Neutrino();
  api.use(lint());
  api.use(mw());
  const options = api.config.module.rule('lint').use('eslint').get('options');
  expect(options.baseConfig.env).toEqual({
    browser: true,
    commonjs: true,
    es6: true,
  });
});

test('does not update lint config if useEslintrc true', () => {
  const api = new Neutrino();
  api.use(lint({ eslint: { useEslintrc: true } }));
  api.use(mw());
  const options = api.config.module.rule('lint').use('eslint').get('options');
  expect(options.baseConfig).toEqual({});
});
