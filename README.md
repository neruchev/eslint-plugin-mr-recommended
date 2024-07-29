# eslint-plugin-nka

[![NPM version](https://img.shields.io/npm/v/eslint-plugin-nka.svg?style=flat)](https://www.npmjs.com/package/eslint-plugin-nka)

## Installation

Install it with yarn:

```shell
yarn add eslint-plugin-nka
```

Or with npm:

```shell
npm install eslint-plugin-nka
```

## Configuration example

Use `.eslintrc.js` file to configure rules. See also about eslint configuring [here](https://eslint.org/docs/user-guide/configuring).

Add `plugin:nka/recommended` to the extends section of your `.eslintrc` configuration file. Note that we can omit the `eslint-plugin-` prefix:

```diff
module.exports = {
  parserOptions: { project: './tsconfig.json' },
+ extends: ['plugin:nka/recommended'],
  env: {
    browser: true,
    commonjs: true,
    es6: true,
    node: true,
  },
  settings: {
    react: { version: '18.3.0' },
  },
};
```

### Configurable rules

```diff
module.exports = {
  parserOptions: { project: './tsconfig.json' },
+ extends: ['plugin:nka/recommended'],
+ rules: {
+   'nka/no-full-import-of-libraries': ['error', ['antd', 'antd/lib']],
+   'nka/no-selective-import-of-libraries': ['error', ['shared', 'src/components/icons']],
+ },
};
```

### Check dictionaries

```diff
module.exports = {
  parserOptions: { project: './tsconfig.json' },
+ extends: ['plugin:nka/recommended'],
+ overrides: [
+   {
+     files: ['src/i18n/dictionaries/**/*.ts'],
+     rules: {
+       'nka/no-incorrect-paths-in-dictionary-keys': ['error', ['error.', 'success.']],
+       'nka/no-unused-dictionary-keys': 'error',
+     },
+   },
+ ],
};
```

## License

**MIT**
