const unitTesting = process.env.npm_lifecycle_event !== 'test:create-project';

export default {
  failFast: unitTesting,
  verbose: !unitTesting,
  files: [
    'packages/*/test/**/*_test.js',
    unitTesting && '!packages/create-project/test/**/*_test.js',
  ].filter(Boolean),
};
