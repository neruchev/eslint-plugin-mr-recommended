const { initialize, isInitialized, getUsageStatistics } = require('../utils');

module.exports = {
  name: 'no-incorrect-paths-in-dictionary-keys',
  defaultOptions: [],
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Disallow incorrect paths in dictionary keys',
    },
  },
  create({ filename, report, options }) {
    if (!isInitialized()) {
      initialize(filename);
    }

    const excludes = options[0] || [];

    return {
      VariableDeclarator(node) {
        node.init.properties.forEach((property) => {
          const dictionaryKey = property.key?.value;

          if (
            !dictionaryKey ||
            excludes.some((excluded) => dictionaryKey.startsWith(excluded))
          ) {
            return;
          }

          const statistics = getUsageStatistics(dictionaryKey);

          if (!statistics) {
            return;
          }

          const isCorrect = statistics.includes(true);

          if (statistics.length === 1 && isCorrect) {
            return;
          }

          statistics.forEach((file) => {
            if (file === true) {
              return;
            }

            report({
              node: property,
              message: isCorrect
                ? `The key '${dictionaryKey}' is valid, but it is also used in the file '${file}', although this is prohibited. You must remove this key from the code or create a duplicate with the correct structure`
                : `The key '${dictionaryKey}' has an invalid structure, it should be based on the path to the file '${file}'. It is necessary to rename it`,
            });
          });
        });
      },
    };
  },
};
