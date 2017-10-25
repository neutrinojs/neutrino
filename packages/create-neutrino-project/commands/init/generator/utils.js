module.exports.VERSIONS = {
  NEUTRINO: '^7.2.1',
  REACT: '^16.0.0',
  REACT_COMPONENTS: '^3.0.0',
  REACT_ADDONS_CSS_TRANSITION_GROUP: '^15.6.2',
  REACT_HOT_LOADER: '^3.1.1',
  REACT_ROUTER_DOM: '^4.2.2',
  REACT_ASYNC: '^1.0.2',
  AIRBNB: '^4.0.0',
  STANDARDJS: '^1.0.1',
  ASSERT: '^1.4.1',
  WEB_LIBRARY: '^2.0.0'
};

module.exports.PROJECTS = {
  REACT: 'react',
  REACT_COMPONENTS: 'react-components',
  WEB: 'web',
  NODE: 'node',
  WEB_LIBRARY: 'taskcluster-web-library'
};

module.exports.LINTERS = {
  AIRBNB: 'airbnb',
  STANDARDJS: 'standardjs'
};

module.exports.isObjectEmpty = obj => Object.keys(obj).length === 0 && obj.constructor === Object;
