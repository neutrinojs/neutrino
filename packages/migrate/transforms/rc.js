/* eslint-disable consistent-return */
const camelcase = require('camelcase');

const getIdentifierFromPackage = (pkg) => {
  const parts = pkg.split('/');

  return camelcase(parts[parts.length - 1]);
};

/**
 * Transform .neutrinorc.js files to remove legacy middleware string-based
 * formats in module.exports.use and neutrino.use(). Will move string formats
 * as require()s to top of file.
 * use: ['@neutrinojs/react'] -> use: [react()]
 * use: [['@neutrinojs/react', { options }]] -> use: [react({ options })]
 * neutrino.use('@neutrinojs/react') -> neutrino.use(react())
 * neutrino.use('@neutrinojs/react', options) -> neutrino.use(react(options))
 */
module.exports = ({ source }, { jscodeshift: j }) => {
  try {
    const root = j(source);
    const requires = new Map();
    const callExpression = (name, args) =>
      j.callExpression(j.identifier(name), args);

    root
      .find(j.AssignmentExpression)
      .filter(({ value }) =>
        // Find module.exports = <Object>; ignore any other export type.
        value &&
        value.left &&
        value.left.object &&
        value.left.object.name === 'module' &&
        value.left.property &&
        value.left.property.name === 'exports' &&
        value.right &&
        value.right.type === 'ObjectExpression'
      )
      .forEach(path => {
        // Skip the use property if it isn't an array.
        const use = path.value.right.properties.find(({ key, value }) =>
          key.name === 'use' && value.type === 'ArrayExpression');

        if (!use) {
          return;
        }

        // Convert middleware in the use array.
        use.value.elements = use.value.elements
          .map(element => {
            // In the use array, skip converting middleware that isn't a string
            // or an array.
            if (
              element.type !== 'ArrayExpression' &&
              typeof element.value !== 'string'
            ) {
              return element;
            }

            const target = element.elements
              ? element.elements[0]
              : element;
            const name = getIdentifierFromPackage(target.value);
            // The first argument was the package name, so any remaining
            // arguments should be captured to pass to the function call.
            const args = element.elements ? element.elements.slice(1) : [];

            // Capture the middleware package name to be directly required.
            requires.set(name, target.raw);

            // Convert to function call.
            return callExpression(name, args);
          });

        // Convert middleware from neutrino.use.
        j(path)
          .find(j.CallExpression, {
            callee: {
              object: { name: 'neutrino' },
              property: { name: 'use' }
            }
          })
          .forEach(({ node }) => {
            // The first argument was the package name, so any remaining
            // arguments should be captured to pass to the function call.
            const [use, ...args] = node.arguments;

            if (typeof use.value !== 'string') {
              return;
            }

            const name = getIdentifierFromPackage(use.value);

            // Capture the middleware package name to be directly required.
            requires.set(name, use.raw);
            Object.assign(node, {
              // Convert to function call.
              arguments: [callExpression(name, args)]
            });
          });
      });

    // With the source now transformed, inject aggregated packages to requires
    // at the top of the file.
    return `${[...requires].map(([name, pkg]) =>
      `const ${name} = require(${pkg});`).join('\n')
    }\n\n${root.toSource()}`;
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};
