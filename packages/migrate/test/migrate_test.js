import test from 'ava';
import eol from 'eol';
import { execSync } from 'child_process';
import { readFileSync } from 'fs';
import { join, resolve } from 'path';

const jscodeshift = join(
  execSync('yarn bin')
    .toString()
    .trim(),
  'jscodeshift',
);
const fixture = join(__dirname, 'fixtures/.neutrinorc.js');
const transform = resolve(__dirname, '../transforms/middleware.js');
const snapshot = eol.auto(
  readFileSync(join(__dirname, 'fixtures/.neutrinorc.js.txt'))
    .toString()
    .trim(),
);

test('performs valid transformation', t => {
  const output = eol.auto(
    execSync(`${jscodeshift} ${fixture} -t ${transform} -d -p -s`)
      .toString()
      .trim(),
  );

  t.is(output, snapshot);
});
