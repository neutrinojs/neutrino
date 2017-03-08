import test from 'ava';
import Config from '../src/Config';
import { validate } from 'webpack';

class StringifyPlugin {
  constructor(...args) {
    this.values = args;
  }

  apply() {
    return JSON.stringify(this.values);
  }
}

test('is ChainedMap', t => {
  const config = new Config();

  config.set('a', 'alpha');

  t.is(config.store.get('a'), 'alpha');
});

test('shorthand methods', t => {
  const config = new Config();
  const obj = {};

  config.shorthands.map(method => {
    obj[method] = 'alpha';
    t.is(config[method]('alpha'), config);
  });

  t.deepEqual(config.entries(), obj);
});

test('node', t => {
  const config = new Config();
  const instance = config.node
    .set('__dirname', 'mock')
    .set('__filename', 'mock')
    .end();

  t.is(instance, config);
  t.deepEqual(config.node.entries(), { __dirname: 'mock', __filename: 'mock' });
});

test('entry', t => {
  const config = new Config();

  config.entry('index')
    .add('babel-polyfill')
    .add('src/index.js');

  t.true(config.entryPoints.has('index'));
  t.deepEqual(config.entryPoints.get('index').values(), ['babel-polyfill', 'src/index.js']);
});

test('plugin empty', t => {
  const config = new Config();
  const instance = config.plugin('stringify').use(StringifyPlugin).end();

  t.is(instance, config);
  t.true(config.plugins.has('stringify'));
  t.deepEqual(config.plugins.get('stringify').get('args'), []);
});

test('plugin with args', t => {
  const config = new Config();

  config.plugin('stringify').use(StringifyPlugin, ['alpha', 'beta']);

  t.true(config.plugins.has('stringify'));
  t.deepEqual(config.plugins.get('stringify').get('args'), ['alpha', 'beta']);
});

test('toConfig empty', t => {
  const config = new Config();

  t.deepEqual(config.toConfig(), {});
});

test('toConfig with values', t => {
  const config = new Config();

  config
    .output
      .path('build')
      .end()
    .node
      .set('__dirname', 'mock')
      .end()
    .target('node')
    .plugin('stringify')
      .use(StringifyPlugin)
      .end()
    .module
      .rule('compile')
        .include
          .add('alpha')
          .add('beta')
          .end()
        .exclude
          .add('alpha')
          .add('beta')
          .end()
        .post()
        .pre()
        .test(/\.js$/)
        .use('babel')
          .loader('babel-loader')
          .options({ presets: ['alpha'] });

  t.deepEqual(config.toConfig(), {
    node: {
      __dirname: 'mock'
    },
    output: {
      path: 'build'
    },
    target: 'node',
    plugins: [new StringifyPlugin()],
    module: {
      rules: [{
        include: ['alpha', 'beta'],
        exclude: ['alpha', 'beta'],
        enforce: 'pre',
        test: /\.js$/,
        use: [{
          loader: 'babel-loader',
          options: { presets: ['alpha'] }
        }]
      }]
    }
  });
});

test('validate empty', t => {
  const config = new Config();
  const errors = validate(config.toConfig());

  t.is(errors.length, 1);
});

test('validate with entry', t => {
  const config = new Config();

  config.entry('index').add('src/index.js');

  const errors = validate(config.toConfig());

  t.is(errors.length, 0);
});

test('validate with values', t => {
  const config = new Config();

  config
    .entry('index')
      .add('babel-polyfill')
      .add('src/index.js')
      .end()
    .output
      .path('build')
      .end()
    .node
      .set('__dirname', 'mock')
      .end()
    .target('node')
    .plugin('stringify')
      .use(StringifyPlugin)
      .end()
    .module
      .rule('compile')
        .include
          .add('alpha')
          .add('beta')
          .end()
        .exclude
          .add('alpha')
          .add('beta')
          .end()
        .post()
        .pre()
        .test(/\.js$/)
        .use('babel')
          .loader('babel-loader')
          .options({ presets: ['alpha'] });

  const errors = validate(config.toConfig());

  t.is(errors.length, 0);
});
