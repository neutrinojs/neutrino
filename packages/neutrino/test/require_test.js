import { join } from 'path';
import test from 'ava';
import { Neutrino } from '../src';

const cwd = process.cwd();
const testModulePath = join(__dirname, 'fixtures', 'test-module');

test.before(t => {
  process.chdir(testModulePath);
});

test('requires middleware relative to root', t => {
  const api = Neutrino();

  t.notThrows(() => api.use('middleware'));
});

test('requires middleware from root/node_modules', t => {
  const api = Neutrino();

  t.notThrows(() => api.use('alpha'));
});

test('forks with error middleware contains error', (t) => {
  const api = Neutrino();

  t.throws(() => api.use('errorMiddleware'));
});

test('throws if middleware cannot be found', (t) => {
  const api = Neutrino();

  t.throws(() => api.use('nonExistent'));
});
