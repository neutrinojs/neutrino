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

  api.requiresAndUses(['middleware']).value(v => t.is(v, 'root'));
});

test('requires middleware from root/node_modules', t => {
  const api = Neutrino();

  api.requiresAndUses(['alpha']).value(v => t.is(v, 'alpha'));
});

test('forks with error middleware contains error', async (t) => {
  const api = Neutrino();

  await t.throws(api.requiresAndUses(['errorMiddleware']).promise());
});

test('throws if middleware cannot be found', async (t) => {
  const api = Neutrino();

  await t.throws(api.requiresAndUses(['nonExistent']).promise());
});
