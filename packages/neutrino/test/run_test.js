import test from 'ava';
import commands from '../src';

test('run::build uses "production" NODE_ENV', t => {
  commands.run('build');
  t.is(process.env.NODE_ENV, 'production');
});

test('build uses "production" NODE_ENV', t => {
  commands.build();
  t.is(process.env.NODE_ENV, 'production');
});

test('start uses "development" NODE_ENV', t => {
  commands.start();
  t.is(process.env.NODE_ENV, 'development');
});

test('test uses "test" NODE_ENV', t => {
  commands.test();
  t.is(process.env.NODE_ENV, 'test');
});

test('inspect uses "development" NODE_ENV by default', t => {
  commands.inspect();
  t.is(process.env.NODE_ENV, 'development');
});

test('inspect uses overridden NODE_ENV', t => {
  commands.inspect([], { args: { env: 'production' } });
  t.is(process.env.NODE_ENV, 'production');
});
