module.exports = {
  name: 'no-full-import-of-libraries',
  defaultOptions: [],
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow full import of large libraries',
    },
  },
  create(context) {
    const libraries = context.options[0] || [];

    return {
      ImportDeclaration(node) {
        const path = node.source.value;

        if (libraries.includes(path)) {
          context.report({
            node,
            message: `Importing from a '${path}' instead of a '${path}/..' increases the size of the bundle`,
          });
        }
      },
    };
  },
};
