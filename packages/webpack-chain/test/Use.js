import test from 'ava';
import Use from '../src/Use';

test('is Chainable', t => {
  const parent = { parent: true };
  const use = new Use(parent);

  t.is(use.end(), parent);
});

test('shorthand methods', t => {
  const use = new Use();
  const obj = {};

  use.shorthands.map(method => {
    obj[method] = 'alpha';
    t.is(use[method]('alpha'), use);
  });

  t.deepEqual(use.entries(), obj);
});

test('tap', t => {
  const use = new Use();

  use
    .loader('babel-loader')
    .options({ presets: ['alpha'] });

  use.tap(options => {
    t.deepEqual(options, { presets: ['alpha'] });
    return { presets: ['beta'] };
  });

  t.deepEqual(use.store.get('options'), { presets: ['beta'] });
});
