import Neutrino = require("neutrino");
import Config = require("webpack-chain");
import webpack = require("webpack");

// Just for type-checking
const is = <A>(v: A): v is A => true;

const options: Neutrino.Options = {
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
};

const neutrino = new Neutrino(options);

is<Neutrino>(neutrino);
is<Neutrino.Options>(neutrino.options);
is<boolean | undefined>(neutrino.options.debug);
is<string | undefined>(neutrino.options.root);
is<string | undefined>(neutrino.options.source);
is<string | undefined>(neutrino.options.output);
is<string | undefined>(neutrino.options.tests);
is<Record<string, string | Record<string, string>> | undefined>(
  neutrino.options.mains
);
is<string | undefined | null>(neutrino.options.packageJson);
is<string[] | undefined>(neutrino.options.extensions);
is<Config>(neutrino.config);
is<void>(neutrino.inspect());
is<webpack.Configuration>(neutrino.webpack());
is<RegExp>(neutrino.regexFromExtensions());

neutrino.use(api => {
  is<Neutrino>(api);
});
neutrino.register("something", api => {
  is<Neutrino>(api);
});

// With custom options
interface CustomOptions extends Neutrino.Options {
  other: number;
}
const neutrinoWithCustomOpts = new Neutrino<CustomOptions>({ other: 123 });

is<Neutrino.Options>(neutrinoWithCustomOpts.options);
is<CustomOptions>(neutrinoWithCustomOpts.options);
is<number>(neutrinoWithCustomOpts.options.other);

// With output handlers
const handler1: Neutrino.OutputHandler<string> = neutrino => {
  is<Neutrino>(neutrino);
  return "string";
};
const handler2 = (neutrino: Neutrino) => {
  is<Neutrino>(neutrino);
  return Number(123);
};

type NeutrinoWithHandlers = Neutrino & {
  handler1: Neutrino.Register<typeof handler1>;
  handler2: Neutrino.Register<typeof handler2>;
};

const neutrinoWithHandlers = new Neutrino() as NeutrinoWithHandlers;
neutrinoWithHandlers.register("handler1", handler1);
neutrinoWithHandlers.register("handler2", handler2);

is<() => string>(neutrinoWithHandlers.handler1);
is<() => number>(neutrinoWithHandlers.handler2);
