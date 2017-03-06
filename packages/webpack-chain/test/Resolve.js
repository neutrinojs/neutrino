import test from 'ava';
import Resolve from '../src/Resolve';

test('is Chainable', t => {
  const parent = { parent: true };
  const resolve = new Resolve(parent);

  t.is(resolve.end(), parent);
});

test('shorthand methods', t => {
  const resolve = new Resolve();
  const obj = {};

  resolve.shorthands.map(method => {
    obj[method] = 'alpha';
    t.is(resolve[method]('alpha'), resolve);
  });

  t.deepEqual(resolve.entries(), obj);
});

test('sets methods', t => {
  const resolve = new Resolve();
  const instance = resolve
    .modules.add('src').end()
    .extensions.add('.js').end();

  t.is(instance, resolve);
});

test('toConfig empty', t => {
  const resolve = new Resolve();

  t.deepEqual(resolve.toConfig(), {});
});

test('toConfig with values', t => {
  const resolve = new Resolve();

  resolve
    .modules.add('src').end()
    .extensions.add('.js').end()
    .alias.set('React', 'src/react');

  t.deepEqual(resolve.toConfig(), {
    modules: ['src'],
    extensions: ['.js'],
    alias: { React: 'src/react' }
  });
});

test('merge empty', t => {
  const resolve = new Resolve();
  const obj = {
    modules: ['src'],
    extensions: ['.js'],
    alias: { React: 'src/react' }
  };
  const instance = resolve.merge(obj);

  t.is(instance, resolve);
  t.deepEqual(resolve.toConfig(), obj);
});

test('merge with values', t => {
  const resolve = new Resolve();

  resolve
    .modules.add('src').end()
    .extensions.add('.js').end()
    .alias.set('React', 'src/react');

  resolve.merge({
    modules: ['dist'],
    extensions: ['.jsx'],
    alias: { ReactDOM: 'src/react-dom' }
  });

  t.deepEqual(resolve.toConfig(), {
    modules: ['src', 'dist'],
    extensions: ['.js', '.jsx'],
    alias: { React: 'src/react', ReactDOM: 'src/react-dom' }
  });
});
