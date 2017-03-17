/* eslint-disable global-require*/
const { join } = require('path');

const castToArray = val => (Array.isArray(val) ? val : [val]);

function requirePath(path, middleware) {
  try {
    return require(path);
  } catch (exception) {
    if (!/Cannot find module/.test(exception.message)) {
      exception.message = `Neutrino was unable to load the module '${middleware}'. ` +
        `Ensure this module exports a function and is free from errors.\n${exception.message}`;
      throw exception;
    }

    return undefined;
  }
}

module.exports = function requireMiddleware(middleware, options = {}) {
  const root = options.root || process.cwd();

  return castToArray(middleware).map((middleware) => {
    const path = [
      join(root, middleware),
      join(root, 'node_modules', middleware)
    ].find(path => requirePath(path));

    if (!path) {
      throw new Error(`Neutrino cannot find a module with the name or path '${middleware}'. ` +
        'Ensure this module can be found relative to the root of the project.');
    }

    return require(path);
  });
};
