const {
  createSourceFile,
  forEachChild,
  isStringLiteral,
  isObjectLiteralElement,
} = require('typescript');
const { readFileSync, readdirSync } = require('fs');
const { extname, resolve, join, dirname, sep } = require('path');

const cache = {
  dictionariesKeys: [],
  usedKeys: {},
};
const extensions = ['.ts', '.js', '.tsx', '.jsx'];
const regExp = new RegExp(sep === '/' ? /\/index.*|\..*$/ : /\\index.*|\..*$/);

const findDictionaryLiterals = (parsed) => {
  if (!isObjectLiteralElement(parsed)) {
    return forEachChild(parsed, findDictionaryLiterals);
  }

  if (!cache.dictionariesKeys.includes(parsed.name.text)) {
    cache.dictionariesKeys.push(parsed.name.text);
  }
};

const getFileText = (fileName) => {
  let content = '';

  try {
    content = readFileSync(fileName, { encoding: 'utf8' });
  } catch (e) {}

  return content;
};

const fileNameToKey = (fileName, root) =>
  fileName
    .replace(root + sep, '')
    .replace(regExp, '')
    .replaceAll(sep, '.') + '.';

const handleFile = (fileName, roots, isProject) => {
  const extension = extname(fileName).toLowerCase();

  if (
    !extensions.includes(extension) ||
    (isProject && fileName.includes(roots.dictionaries))
  ) {
    return;
  }

  const text = getFileText(fileName);

  if (!text) {
    return;
  }

  try {
    const parsed = createSourceFile(`temp${extension}`, text);

    if (!parsed) {
      return;
    }

    const scheme = isProject ? fileNameToKey(fileName, roots.project) : '';

    const findProjectLiterals = (parsed) => {
      if (!isStringLiteral(parsed)) {
        return forEachChild(parsed, findProjectLiterals);
      }

      const key = parsed.text;

      if (!cache.dictionariesKeys.includes(key)) {
        return;
      }

      if (!cache.usedKeys[key]) {
        cache.usedKeys[key] = [];
      }

      if (fileName.endsWith('.stories.tsx')) {
        return;
      }

      const result = key.startsWith(scheme) || fileName;

      if (!cache.usedKeys[key].includes(result)) {
        cache.usedKeys[key].push(result);
      }
    };

    const handler = isProject ? findProjectLiterals : findDictionaryLiterals;

    handler(parsed);
  } catch (e) {}
};

const handleDirectory = (root, roots, isProject) =>
  readdirSync(root, { withFileTypes: true }).forEach((item) => {
    const fileName = join(root, item.name);
    const handler = item.isDirectory() ? handleDirectory : handleFile;

    handler(fileName, roots, isProject);
  });

module.exports = {
  initialize: (fileName) => {
    const root = {
      project: resolve(process.cwd(), 'src'),
      dictionaries: resolve(dirname(fileName), '..'),
    };

    handleDirectory(root.dictionaries, root);
    handleDirectory(root.project, root, true);
  },
  isInitialized: () => !!cache.dictionariesKeys.length,
  getUsageStatistics: (key) => cache.usedKeys[key],
};
