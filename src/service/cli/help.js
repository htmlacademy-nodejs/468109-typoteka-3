'use strict';

const runShowHelpInfo = () => {
  console.info(`Программа запускает http-сервер и формирует файл с данными для API.`);
  console.info(``);
  console.info(`    Гайд:`);
  console.info(`    service.js <command>`);
  console.info(``);
  console.info(`    Команды:`);
  console.info(`    --version:            выводит номер версии`);
  console.info(`    --help:               выводит информацию о доступных командах`);
  console.info(`    --generate <count>    формирует файл mocks.json`);
};

module.exports = {
  name: `--help`,
  run() {
    runShowHelpInfo();
  }
};
