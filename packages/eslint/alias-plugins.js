const moduleAlias = require('module-alias');
const pnpApi = process.versions.pnp ? require('pnpapi') : null; // eslint-disable-line import/no-unresolved

function toFullName(pluginName) {
  const ESLINT_PREFIX = 'eslint-plugin-';
  const ORGANIZATION_EXPRESSION = /^(@[\d.A-z-]+)\/(.+)$/;
  const nameIsFull = pluginName.indexOf(ESLINT_PREFIX) === 0;
  const nameIsOrganization = ORGANIZATION_EXPRESSION.test(pluginName);

  if (nameIsOrganization) {
    const [, organizationName, name] = pluginName.match(
      ORGANIZATION_EXPRESSION,
    );

    return `${organizationName}/${toFullName(name)}`;
  }

  return nameIsFull ? pluginName : `${ESLINT_PREFIX}${pluginName}`;
}

function aliasModuleFrom(relativeFilename = __filename) {
  return function aliasPlugin(pluginName) {
    let resolvedPluginPath;

    if (pnpApi) {
      resolvedPluginPath = pnpApi.resolveRequest(pluginName, relativeFilename);
    } else {
      resolvedPluginPath = require.resolve(pluginName, {
        paths: [relativeFilename],
      });
    }

    moduleAlias.addAlias(pluginName, resolvedPluginPath);
  };
}

module.exports = function aliasPlugins(eslintConfig, relativeFilename) {
  const { plugins = [] } = eslintConfig;

  plugins.map(toFullName).forEach(aliasModuleFrom(relativeFilename));
};
