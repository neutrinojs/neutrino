import test from 'ava';
import Rule from '../src/Rule';
import merge from 'deepmerge';

test('is Chainable', t => {
  const parent = { parent: true };
  const rule = new Rule(parent);

  t.is(rule.end(), parent);
});

test('create loader', t => {
  const rule = new Rule();
  const instance = rule.loader('babel', 'babel-loader', { presets: ['alpha'] });

  t.is(instance, rule);
  t.true(rule.loaders.has('babel'));
  t.is(rule.loaders.get('babel').loader, 'babel-loader');
  t.deepEqual(rule.loaders.get('babel').options, { presets: ['alpha'] });
});

test('override loader', t => {
  const rule = new Rule();
  const instance = rule.loader('babel', 'babel-loader', { presets: ['alpha'] });

  t.is(instance, rule);

  rule.loader('babel', options => {
    t.deepEqual(options, { presets: ['alpha'] });

    return merge(options, { presets: ['beta'] });
  });

  t.is(rule.loaders.get('babel').loader, 'babel-loader');
  t.deepEqual(rule.loaders.get('babel').options, { presets: ['alpha', 'beta'] });
});

test('test', t => {
  const rule = new Rule();
  const instance = rule.test(/\.js?/);

  t.is(instance, rule);
  t.deepEqual(rule.get('test'), /\.js?/);
});

test('pre', t => {
  const rule = new Rule();
  const instance = rule.pre();

  t.is(instance, rule);
  t.deepEqual(rule.get('enforce'), 'pre');
});

test('post', t => {
  const rule = new Rule();
  const instance = rule.post();

  t.is(instance, rule);
  t.deepEqual(rule.get('enforce'), 'post');
});

test('include', t => {
  const rule = new Rule();
  const instance = rule.include('alpha', 'beta');

  t.is(instance, rule);
  t.deepEqual([...rule._include], ['alpha', 'beta']);
});

test('exclude', t => {
  const rule = new Rule();
  const instance = rule.exclude('alpha', 'beta');

  t.is(instance, rule);
  t.deepEqual([...rule._exclude], ['alpha', 'beta']);
});

test('toConfig empty', t => {
  const rule = new Rule();

  t.deepEqual(rule.toConfig(), {});
});

test('toConfig with values', t => {
  const rule = new Rule();

  rule
    .include('alpha', 'beta')
    .exclude('alpha', 'beta')
    .post()
    .pre()
    .test(/\.js$/)
    .loader('babel', 'babel-loader', { presets: ['alpha'] });

  t.deepEqual(rule.toConfig(), {
    test: /\.js$/,
    enforce: 'pre',
    include: ['alpha', 'beta'],
    exclude: ['alpha', 'beta'],
    use: [{
      loader: 'babel-loader',
      options: {
        presets: ['alpha']
      }
    }]
  });
});

test('merge empty', t => {
  const rule = new Rule();
  const obj = {
    enforce: 'pre',
    test: /\.js$/,
    include: ['alpha', 'beta'],
    exclude: ['alpha', 'beta'],
    loader: {
      babel: {
        loader: 'babel-loader',
        options: {
          presets: ['alpha']
        }
      }
    }
  };
  const instance = rule.merge(obj);

  t.is(instance, rule);
  t.deepEqual(rule.toConfig(), {
    enforce: 'pre',
    test: /\.js$/,
    include: ['alpha', 'beta'],
    exclude: ['alpha', 'beta'],
    use: [{
      loader: 'babel-loader',
      options: {
        presets: ['alpha']
      }
    }]
  });
});

test('merge with values', t => {
  const rule = new Rule();

  rule
    .test(/\.js$/)
    .post()
    .include('gamma', 'delta')
    .loader('babel', 'babel-loader', { presets: ['alpha'] });

  rule.merge({
    test: /\.jsx$/,
    enforce: 'pre',
    include: ['alpha', 'beta'],
    exclude: ['alpha', 'beta'],
    loader: {
      babel: {
        options: {
          presets: ['beta']
        }
      }
    }
  });

  t.deepEqual(rule.toConfig(), {
    test: /\.jsx$/,
    enforce: 'pre',
    include: ['gamma', 'delta', 'alpha', 'beta'],
    exclude: ['alpha', 'beta'],
    use: [{
      loader: 'babel-loader',
      options: {
        presets: ['alpha', 'beta']
      }
    }]
  });
});
