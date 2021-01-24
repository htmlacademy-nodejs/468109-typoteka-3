'use strict';

const chalk = require(`chalk`);

const runShowHelpInfo = () => {
  console.info(chalk.gray(`
    Программа запускает http-сервер и формирует файл с данными для API.
    
      Гайд:
      service.js <command>
      Команды:
      --version:            выводит номер версии
      --help:               выводит список команд
      --generate <count>    формирует файл mocks.json
  `));
};

module.exports = {
  name: `--help`,
  run() {
    runShowHelpInfo();
  }
};
