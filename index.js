module.exports = {
  rules: {
    'no-full-import-of-libraries': require('./rules/no-full-import-of-libraries'),
    'no-incorrect-paths-in-dictionary-keys': require('./rules/no-incorrect-paths-in-dictionary-keys'),
    'no-index-imports': require('./rules/no-index-imports'),
    'no-selective-import-of-libraries': require('./rules/no-selective-import-of-libraries'),
    'no-unused-dictionary-keys': require('./rules/no-unused-dictionary-keys'),
  },
  configs: {
    recommended: require('./configs/recommended'),
  },
};
