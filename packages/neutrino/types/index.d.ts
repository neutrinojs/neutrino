import * as webpack from "webpack";
import * as Config from "webpack-chain";

export = Neutrino;

declare class Neutrino<O extends Neutrino.Options = Neutrino.Options> {
  constructor(options?: O);
  options: O;
  config: Config;
  use(middleware: Neutrino.Middleware): void;
  register(name: string, handler: Neutrino.OutputHandler): void;
  regexFromExtensions(extensions?: string[]): RegExp;
  webpack(): webpack.Configuration;
  inspect(): void;
}

declare namespace Neutrino {
  type Middleware = (neutrino: Neutrino) => void;
  type Use = Middleware[];
  type OutputHandler<R extends unknown = unknown> = (neutrino: Neutrino) => R;
  type Register<T extends OutputHandler> = T extends (arg: Neutrino) => infer R
    ? () => R
    : never;

  interface Options {
    debug?: boolean;
    root?: string;
    source?: string;
    output?: string;
    tests?: string;
    mains?: Record<string, string | Record<string, string>>;
    packageJson?: string | null;
    extensions?: string[];
  }

  interface Configuration {
    options?: Options;
    use?: Middleware | (Middleware | false)[];
  }
}
