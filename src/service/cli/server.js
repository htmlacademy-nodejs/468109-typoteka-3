'use strict';

const express = require(`express`);
const {StatusCodes, ReasonPhrases} = require(`http-status-codes`);

const getSequelize = require(`../lib/sequelize`);
const getApiRoutes = require(`../api/api`);
const {getLogger} = require(`../lib/logger`);

const DEFAULT_PORT = 3000;
const API_PREFIX = `/api`;
const logger = getLogger({name: `api`});

const runServer = async (args) => {
  try {
    logger.info(`Trying to connect to database...`);

    await getSequelize().authenticate();
  } catch (err) {
    logger.error(`An error occurred: ${err.message}`);

    process.exit(1);
  }

  logger.info(`Connection to database established`);

  const [customPort] = args;
  const port = Number.parseInt(customPort, 10) || DEFAULT_PORT;
  const app = express();

  app.use(express.json());

  app.use((req, res, next) => {
    logger.debug(`Request on route ${req.url}`);
    res.on(`finish`, () => {
      logger.info(`Response status code ${res.statusCode}`);
    });
    next();
  });

  app.use(API_PREFIX, getApiRoutes());

  app.use((req, res) => {
    res.status(StatusCodes.NOT_FOUND).send(ReasonPhrases.NOT_FOUND);

    logger.error(`Route not found: ${req.url}`);
  });

  app.use((err, _req, _res, _next) => {
    logger.error(`An error occured on processing request: ${err.message}`);
  });

  try {
    app.listen(port, (err) => {
      if (err) {
        return logger.error(`An error occured on server creation: ${err.message}`);
      }

      return logger.info(`Listening to connections on ${port}`);
    });

  } catch (err) {
    logger.error(`An error occured: ${err.message}`);
    process.exit(1);
  }
};

module.exports = {
  name: `--server`,
  run(args) {
    return runServer(args);
  }
};
