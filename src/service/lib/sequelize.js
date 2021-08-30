'use strict';

const Sequelize = require(`sequelize`);

const getSequelize = () => {
  const {DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT} = process.env;

  const somethingIsNotDefined = [DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT].some((item) => item === undefined);

  if (somethingIsNotDefined) {
    throw new Error(`One or more environmental variables are not defined`);
  }

  return new Sequelize(
      DB_NAME, DB_USER, DB_PASSWORD, {
        host: DB_HOST,
        port: DB_PORT,
        dialect: `postgres`,
        pool: {
          max: 5,
          min: 0,
          acquire: 10000,
          idle: 10000
        }
      }
  );
};

module.exports = getSequelize;
