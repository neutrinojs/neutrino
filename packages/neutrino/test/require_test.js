import { join } from 'path';
import test from 'ava';
import Neutrino from '../Neutrino';

const testModulePath = join(__dirname, 'fixtures', 'test-module');

test.before(() => {
  process.chdir(testModulePath);
});

test('requires middleware relative to root', t => {
  t.notThrows(() => new Neutrino().use('middleware'));
});

test('requires middleware from root/node_modules', t => {
  t.notThrows(() => new Neutrino().use('alpha'));
});

test('throws if middleware contains error', (t) => {
  t.throws(() => new Neutrino().use('errorMiddleware'), SyntaxError);
});

test('throws if middleware cannot be found', (t) => {
  t.throws(() => new Neutrino().use('nonExistent'), 'Cannot find module \'nonExistent\'');
});
