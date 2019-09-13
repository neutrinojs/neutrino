import * as webpack from "webpack";
import * as Config from "webpack-chain";

export = Neutrino;

declare class Neutrino<O extends Neutrino.Options = Neutrino.Options> {
  constructor(options?: O);
  options: O;
  config: Config;
  use(middleware: Neutrino.Middleware<O, any>): void;
  register(name: string, handler: Neutrino.OutputHandler<any, any, any>): void;
  regexFromExtensions(extensions?: string[]): RegExp;
  webpack(): webpack.Configuration;
  inspect(): void;
}

declare namespace Neutrino {
  type Middleware<O extends Options = Options, N extends Neutrino<O> = Neutrino<O>> = (neutrino: N) => void;
  type OutputHandler<R extends any = any, O extends Options = Options, N extends Neutrino<O> = Neutrino<O>> = (neutrino: N) => R;
  type Register<T extends OutputHandler<any, any, any>, O extends Options = Options> = T extends (neutrino: any) => infer R
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

  interface Configuration<O extends Options = Options> {
    options?: O;
    use?: Middleware<O, any> | (Middleware<O, any> | false)[];
  }
}
