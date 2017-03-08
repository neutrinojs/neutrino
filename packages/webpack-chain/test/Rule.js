import test from 'ava';
import Rule from '../src/Rule';

test('is Chainable', t => {
  const parent = { parent: true };
  const rule = new Rule(parent);

  t.is(rule.end(), parent);
});

test('shorthand methods', t => {
  const rule = new Rule();
  const obj = {};

  rule.shorthands.map(method => {
    obj[method] = 'alpha';
    t.is(rule[method]('alpha'), rule);
  });

  t.deepEqual(rule.entries(), obj);
});

test('use', t => {
  const rule = new Rule();
  const instance = rule.use('babel').end();

  t.is(instance, rule);
  t.true(rule.uses.has('babel'));
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

test('sets methods', t => {
  const rule = new Rule();
  const instance = rule
    .include.add('alpha').add('beta').end()
    .exclude.add('alpha').add('beta').end();

  t.is(instance, rule);
  t.deepEqual(rule.include.values(), ['alpha', 'beta']);
  t.deepEqual(rule.exclude.values(), ['alpha', 'beta']);
});

test('toConfig empty', t => {
  const rule = new Rule();

  t.deepEqual(rule.toConfig(), {});
});

test('toConfig with values', t => {
  const rule = new Rule();

  rule
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
    use: {
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
    .include.add('gamma').add('delta').end()
    .use('babel')
      .loader('babel-loader')
      .options({ presets: ['alpha'] });

  rule.merge({
    test: /\.jsx$/,
    enforce: 'pre',
    include: ['alpha', 'beta'],
    exclude: ['alpha', 'beta'],
    use: {
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
