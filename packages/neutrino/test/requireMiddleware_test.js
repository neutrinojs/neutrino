import { join } from 'path';
import { outputFile as fsOutputFile, remove as fsRemove } from 'fs-extra';
import pify from 'pify';
import test from 'ava';
import requireMiddleware from '../src/requireMiddleware';

const cwd = process.cwd();
const outputFile = pify(fsOutputFile);
const remove = pify(fsRemove);

const rootPath = join(__dirname, 'test-module');
const rootMiddlewarePath = join(rootPath, 'middleware.js');
const errorMiddlewarePath = join(rootPath, 'errorMiddleware.js');
const modulePath = join(rootPath, 'node_modules', 'mymodule');
const moduleMiddlewarePath = join(modulePath, 'index.js');

test.before(async (t) => {
  await Promise.all([
    outputFile(rootMiddlewarePath, 'module.exports = "root"'),
    outputFile(errorMiddlewarePath, '[;'),
    outputFile(moduleMiddlewarePath, 'module.exports = "mymodule"')
  ])
  process.chdir(rootPath);
});

test.after.always(async (t) => {
  await remove(rootPath);
  process.chdir(cwd);
});

test('requires middleware relative to root', t => {
  t.is(requireMiddleware('middleware')[0], 'root');
});

test('requires middleware from root/node_modules', t => {
  t.is(requireMiddleware('mymodule')[0], 'mymodule');
});

test('throws if middleware contains error', t => {
  t.throws(() => requireMiddleware('errorMiddleware'));
});

test('throws if middleware cannot be found', t => {
  t.throws(() => requireMiddleware('notExistent'));
});
