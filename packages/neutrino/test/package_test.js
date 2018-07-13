import test from 'ava';
import neutrino from '..';

test('throws when vendor entrypoint defined', t => {
  const err = t.throws(() => {
    const webpackConfig = neutrino(neutrino => {
      neutrino.config.entry('vendor').add('lodash');
    }).output('webpack');

    // webpackConfig is a function that is called by webpack,
    // so we need to call it to force its evaluation
    webpackConfig();
  });

  t.true(err.message.includes('Remove the manual `vendor` entrypoint'));
});

test('throws when trying to override with a non-function', t => {
  const err = t.throws(() =>
    neutrino(Function.prototype).output('webpack', { bad: 'override' })
  );

  t.true(err.message.includes('must be a function'));
});

test('throws when trying to use a non-registered output', t => {
  const err = t.throws(() =>
    neutrino(Function.prototype).output('fake')
  );

  t.true(err.message.includes('Unable to find an output handler'));
});

test('throws when trying to use a non-registered proxied method', t => {
  const err = t.throws(() =>
    neutrino(Function.prototype).fake()
  );

  t.true(err.message.includes('Unable to find an output handler'));
});

test('exposes webpack output handler', t => {
  t.notThrows(() =>
    neutrino(Function.prototype).output('webpack')
  );
});

test('exposes webpack config from output', t => {
  // The webpack handler returns a function to be used by webpack-cli
  // and webpack-command. Force evaluation by calling this function.
  const handler = neutrino(Function.prototype).output('webpack');

  t.is(typeof handler(), 'object');
});

test('exposes webpack method', t => {
  t.is(typeof neutrino(Function.prototype).webpack, 'function');
});

test('exposes webpack config from method', t => {
  // The webpack handler returns a function to be used by webpack-cli
  // and webpack-command. Force evaluation by calling this function.
  const handler = neutrino(Function.prototype).webpack();

  t.is(typeof handler(), 'object');
});
