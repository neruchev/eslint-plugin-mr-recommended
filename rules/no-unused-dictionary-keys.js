const { initialize, isInitialized, getUsageStatistics } = require('../utils');

module.exports = {
  name: 'no-unused-dictionary-keys',
  defaultOptions: [],
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Disallow unused dictionary keys',
    },
  },
  create({ filename, report }) {
    if (!isInitialized()) {
      initialize(filename);
    }

    return {
      VariableDeclarator(node) {
        node.init.properties.forEach((property) => {
          const dictionaryKey = property.key?.value;

          if (dictionaryKey && !getUsageStatistics(dictionaryKey)) {
            report({
              node: property,
              message: `Unused dictionary key: '${dictionaryKey}'`,
            });
          }
        });
      },
    };
  },
};
