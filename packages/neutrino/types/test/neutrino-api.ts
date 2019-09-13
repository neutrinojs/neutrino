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
  alpha: number;
  beta: boolean;
  gamma: string;
}
const neutrinoWithCustomOpts = new Neutrino<CustomOptions>({
  alpha: 123,
  beta: true,
  gamma: '123',
});

is<Neutrino.Options>(neutrinoWithCustomOpts.options);
is<CustomOptions>(neutrinoWithCustomOpts.options);
is<number>(neutrinoWithCustomOpts.options.alpha);
is<boolean>(neutrinoWithCustomOpts.options.beta);
is<string>(neutrinoWithCustomOpts.options.gamma);

// With output handlers & custom options
type CustomNeutrino = Neutrino<CustomOptions> & {
  handler1: Neutrino.Register<typeof handler1>
  handler2: Neutrino.Register<typeof handler2>
}

const handler1: Neutrino.OutputHandler<string, CustomOptions, CustomNeutrino> = neutrino => { // using Neutrino.OutputHandler
  is<Neutrino>(neutrino);
  is<CustomNeutrino>(neutrino);
  is<() => string>(neutrino.handler1); // self
  is<() => number>(neutrino.handler2);
  is<CustomOptions>(neutrino.options);
  return "string";
};
const handler2 = (neutrino: CustomNeutrino) => {
  is<Neutrino>(neutrino);
  is<CustomNeutrino>(neutrino);
  is<() => string>(neutrino.handler1);
  is<() => number>(neutrino.handler2); // self
  return Number(123);
};

const neutrinoWithHandlers = new Neutrino() as CustomNeutrino;
neutrinoWithHandlers.register("handler1", handler1);
neutrinoWithHandlers.register("handler2", handler2);

const middleware = (neutrino: CustomNeutrino) => {
  is<string>(neutrino.handler1())
  is<number>(neutrino.handler2())
}

neutrinoWithHandlers.use(middleware)

is<() => string>(neutrinoWithHandlers.handler1);
is<() => number>(neutrinoWithHandlers.handler2);
