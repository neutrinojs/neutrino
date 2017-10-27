module.exports.PROJECTS = {
  REACT: 'react',
  REACT_COMPONENTS: 'react-components',
  WEB: 'web',
  NODE: 'node',
  WEB_LIBRARY: 'taskcluster-web-library'
};

module.exports.LIBRARY = {
  REACT: 'react',
  REACT_DOM: 'react-dom',
  WEB_LIBRARY: 'taskcluster-web-library',
  REACT_ADDONS_CSS_TRANSITION_GROUP: 'react-addons-css-transition-group',
  ASSERT: 'assert',
  NEUTRINO: 'neutrino',
  NEUTRINO_PRESET_REACT_COMPONENTS: 'neutrino-preset-react-components',
  NEUTRINO_PRESET_REACT: 'neutrino-preset-react',
  NEUTRINO_PRESET_WEB: 'neutrino-preset-web',
  NEUTRINO_PRESET_NODE: 'neutrino-preset-node',
  NEUTRINO_PRESET_TASKCLUSTER_WEB_LIBRARY: 'neutrino-preset-taskcluster-web-library',
  NEUTRINO_PRESET_AIRBNB_BASE: 'neutrino-preset-airbnb-base',
  NEUTRINO_PRESET_AIRBNB: 'neutrino-preset-airbnb',
  NEUTRINO_MIDDLEWARE_STANDARDJS: 'neutrino-middleware-standardjs',
  REACT_ROUTER_DOM: 'react-router-dom',
  REACT_HOT_LOADER: 'react-hot-loader',
  REACT_ASYNC_COMPONENT: 'react-async-component'
};

module.exports.LINTERS = {
  AIRBNB: 'airbnb',
  STANDARDJS: 'standardjs'
};

module.exports.isObjectEmpty = obj => Object.keys(obj).length === 0 && obj.constructor === Object;

module.exports.isYarn = process.env.npm_config_user_agent && process.env.npm_config_user_agent.includes('yarn');
