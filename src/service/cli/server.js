'use strict';

const fs = require(`fs`).promises;
const express = require(`express`);

const {
  HttpCode,
  SystemError
} = require(`../../constants`);

const DEFAULT_PORT = 3000;
const FILENAME = `mocks.json`;

const runServer = (args) => {
  const [customPort] = args;
  const port = Number.parseInt(customPort, 10) || DEFAULT_PORT;
  const app = express();

  app.use(express.json());

  app.get(`/posts`, async (req, res) => {
    try {
      const fileContent = await fs.readFile(FILENAME);

      if (fileContent.length === 0) {
        return res.json([]);
      }

      const mocks = JSON.parse(fileContent);

      return res.json(mocks);
    } catch (err) {
      if (err.code === SystemError.NOT_FOUND) {
        return res.status(HttpCode.NOT_FOUND).json([]);
      }

      return res.status(HttpCode.INTERNAL_SERVER_ERROR).send(err);
    }
  });

  app.use((req, res) => res
    .status(HttpCode.NOT_FOUND)
    .send(`Not found`));

  app.listen(port);
};

module.exports = {
  name: `--server`,
  run(args) {
    runServer(args);
  }
};
