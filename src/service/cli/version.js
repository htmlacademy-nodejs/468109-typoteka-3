'use strict';

const packageJsonFile = require(`../../../package.json`);

const runShowVersionInfo = () => {
  const version = packageJsonFile.version;
  console.info(version);
};

module.exports = {
  name: `--version`,
  run() {
    runShowVersionInfo();
  }
};
