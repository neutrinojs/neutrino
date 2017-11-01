import { join } from 'path';
import test from 'ava';
import { Neutrino } from '../src';

const cwd = process.cwd();
const testModulePath = join(__dirname, 'fixtures', 'test-module');

test.before(t => {
  process.chdir(testModulePath);
});

test('requires middleware relative to root', t => {
  t.notThrows(() => Neutrino().use('middleware'));
});

test('requires middleware from root/node_modules', t => {
  t.notThrows(() => Neutrino().use('alpha'));
});

test('forks with error middleware contains error', (t) => {
  t.throws(() => Neutrino().use('errorMiddleware'));
});

test('throws if middleware cannot be found', (t) => {
  t.throws(() => Neutrino().use('nonExistent'));
});
