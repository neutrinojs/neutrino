/* eslint-disable consistent-return */
const camelcase = require('camelcase');

const getIdentifierFromPackage = (pkg) => {
  const parts = pkg.split('/');

  return camelcase(parts[parts.length - 1]);
};

const getTargetAndArgs = (element) => {
  // In the use array, skip converting middleware that isn't a string
  // or an array. There may be conditional expressions prior to the actual
  // middleware usage, e.g., process.env.NODE_ENV === 'test' && <middleware>.
  if (element.type === 'Literal') {
    return [element];
  }

  if (element.type === 'ArrayExpression') {
    return [element.elements[0], element.elements.slice(1)];
  }

  if (element.type === 'LogicalExpression') {
    return getTargetAndArgs(element.right);
  }

  return [];
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
      .filter(
        ({ value }) =>
          // Find module.exports = <Object>; ignore any other export type.
          value &&
          value.left &&
          value.left.object &&
          value.left.object.name === 'module' &&
          value.left.property &&
          value.left.property.name === 'exports' &&
          value.right &&
          value.right.type === 'ObjectExpression',
      )
      .forEach((path) => {
        // Skip the use property if it isn't an array.
        const use = path.value.right.properties.find(
          ({ key, value }) =>
            key.name === 'use' && value.type === 'ArrayExpression',
        );

        if (!use) {
          return;
        }

        // Convert middleware in the use array.
        Object.assign(use.value, {
          elements: use.value.elements.map((element) => {
            // The target contains the package name, and any remaining
            // arguments should be captured to pass to the function call.
            const [target, args = []] = getTargetAndArgs(element);

            if (!target) {
              return element;
            }

            const name = getIdentifierFromPackage(target.value);

            // Capture the middleware package name to be directly required.
            requires.set(name, target.raw);

            // Convert the usage to a function call, ensuring that any
            // preceding conditionals are kept intact.
            return element.type === 'LogicalExpression'
              ? Object.assign(element, { right: callExpression(name, args) })
              : callExpression(name, args);
          }),
        });
      });

    // Convert middleware from neutrino.use.
    root
      .find(j.CallExpression, {
        callee: {
          object: { name: 'neutrino' },
          property: { name: 'use' },
        },
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
          arguments: [callExpression(name, args)],
        });
      });

    if (!requires.size) {
      return source;
    }

    // With the source now transformed, inject aggregated packages to requires
    // at the top of the file.
    return `${[...requires]
      .map(([name, pkg]) => `const ${name} = require(${pkg});`)
      .join('\n')}\n\n${root.toSource()}`;
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};
