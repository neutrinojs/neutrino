import Neutrino = require("neutrino");
import Config = require("webpack-chain");
import webpack = require("webpack");

// Just for type-checking
const is = <A>(v: A): v is A => true;

const middleware: Neutrino.Middleware = neutrino => {
  is<Neutrino>(neutrino);
};

const config: Neutrino.Configuration = {
  options: {
    debug: false,
    extensions: ["string"],
    mains: {
      index: "index",
      other: {
        page: "string"
      }
    },
    output: "string",
    packageJson: "string",
    root: "string",
    source: "string",
    tests: "string"
  },
  use: [
    middleware, //fn
    process.env.NODE_ENV === "development" ? middleware : false,
    neutrino => {
      is<Neutrino>(neutrino);
      is<webpack.Configuration>(neutrino.webpack());
      is<Config>(neutrino.config);
    }
  ]
};

export default config;
