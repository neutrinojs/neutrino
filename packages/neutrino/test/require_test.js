import { join } from 'path';
import { outputFile as fsOutputFile, remove as fsRemove } from 'fs-extra';
import pify from 'pify';
import test from 'ava';
import { Neutrino } from '../src';

const cwd = process.cwd();
const outputFile = pify(fsOutputFile);
const remove = pify(fsRemove);
const rootPath = join(__dirname, 'test-module');
const rootMiddlewarePath = join(rootPath, 'middleware.js');
const errorMiddlewarePath = join(rootPath, 'errorMiddleware.js');
const modulePath = join(rootPath, 'node_modules', 'alpha');
const moduleMiddlewarePath = join(modulePath, 'index.js');

test.before(async () => {
  await Promise.all([
    outputFile(rootMiddlewarePath, 'module.exports = () => "root"'),
    outputFile(errorMiddlewarePath, '[;'),
    outputFile(moduleMiddlewarePath, 'module.exports = () => "alpha"')
  ]);
  process.chdir(rootPath);
});

test.after.always(async () => {
  await remove(rootPath);
  process.chdir(cwd);
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
