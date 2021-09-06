'use strict';

const passwordUtils = require(`../lib/password`);

module.exports.getMockUsers = async () => ([
  {
    name: `Иван`,
    surname: `Иванов`,
    email: `ivanov@example.com`,
    passwordHash: await passwordUtils.hash(`ivanov`),
  },
  {
    name: `Пётр`,
    surname: `Петров`,
    email: `petrov@example.com`,
    passwordHash: await passwordUtils.hash(`petrov`),
  }
]);
