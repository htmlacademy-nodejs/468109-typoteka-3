'use strict';

const express = require(`express`);
const {StatusCodes, ReasonPhrases} = require(`http-status-codes`);

const apiRoutes = require(`../api`);

const DEFAULT_PORT = 3000;
const API_PREFIX = `/api`;

const runServer = (args) => {
  const [customPort] = args;
  const port = Number.parseInt(customPort, 10) || DEFAULT_PORT;
  const app = express();

  app.use(express.json());

  app.use(API_PREFIX, apiRoutes);

  app.use((req, res) => res
    .status(StatusCodes.NOT_FOUND)
    .send(ReasonPhrases.NOT_FOUND));

  app.listen(port);
};

module.exports = {
  name: `--server`,
  run(args) {
    runServer(args);
  }
};
