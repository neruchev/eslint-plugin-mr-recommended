const { readdirSync } = require('fs');
const { basename, join } = require('path');

const getFiles = (dir) =>
  Object.fromEntries(
    readdirSync(join(__dirname, dir)).map((file) => [
      basename(file, '.js'),
      require(dir + file),
    ])
  );

module.exports = {
  rules: getFiles('./rules/'),
  configs: getFiles('./configs/'),
};
