module.exports = {
  name: 'no-selective-import-of-libraries',
  defaultOptions: [],
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow selective import of libraries',
    },
  },
  create(context) {
    const libraries = context.options[0] || [];

    return {
      ImportDeclaration(node) {
        const path = node.source.value;

        libraries.forEach((library) => {
          if (path.startsWith(`${library}/`)) {
            context.report({
              node,
              message: `Importing from a '${path}' is disallow, use '${library}'`,
            });
          }
        });
      },
    };
  },
};
