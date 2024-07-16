const conditions = ['index', 'index.ts', 'index.js'];

module.exports = {
  name: 'no-index-imports',
  defaultOptions: [],
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow imports from index files',
    },
  },
  create(context) {
    return {
      ImportDeclaration: (node) => {
        const path = node.source.value;

        conditions.forEach((condition) => {
          if (path.endsWith(condition)) {
            context.report({
              node,
              message: 'Import from index files is not allowed',
            });
          }
        });
      },
    };
  },
};
