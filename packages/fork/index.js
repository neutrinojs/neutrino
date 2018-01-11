const { gray } = require('chalk');
const { fork } = require('child_process');
const { join } = require('path');
const { createInterface } = require('readline');
const serialize = require('serialize-javascript');

module.exports = (neutrino, options = {}) => {
  global.interactive = false;

  neutrino.on(`pre${neutrino.options.command}`, () => {
    const registeredCommand = neutrino.commands[neutrino.options.command];

    neutrino.register(neutrino.options.command, (config, neutrino) => {
      if (Object.keys(config).length === 0) {
        // The fork middleware was the only middleware used by Neutrino prior
        // to running anything. We need to now prevent the default actions from
        // doing anything else.
        return Promise.resolve();
      }

      return registeredCommand(config, neutrino);
    });

    const children = Object
      .keys(options.configs || {})
      .map((namespace) => {
        const middleware = options.configs[namespace];
        const script = join(__dirname, './neutrino-child');
        const child = fork(script, [], { stdio: ['pipe', 'pipe', 'pipe', 'ipc'] });
        const stdout = createInterface({ input: child.stdout });
        const stderr = createInterface({ input: child.stderr });

        stdout.on('line', message => console.log(gray(`[${namespace}]`), message));
        stderr.on('line', message => console.error(gray(`[${namespace}]`), message));
        child.on('message', ([type, args]) => neutrino.emit(`${namespace}:${type}`, ...args));
        child.send(serialize([middleware, neutrino.options.args]));

        return child;
      });

    process.on('exit', () => {
      children.forEach(child => child.kill('SIGINT'));
    });
  });
};
