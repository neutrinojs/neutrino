// This registration runs in a separate process along with Mocha.
// This ensures that Mocha runs the test files with the same Babel
// configuration as the other webpack files
require('babel-register')(JSON.parse(process.env.NEUTRINO_BABEL_CONFIG));
