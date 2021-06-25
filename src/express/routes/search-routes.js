'use strict';

const {Router} = require(`express`);
const chalk = require(`chalk`);

const {getAPI} = require(`../api`);

const searchRouter = new Router();
const api = getAPI();

searchRouter.get(`/`, async (req, res) => {
  try {
    const {search} = req.query;
    const results = await api.search(search);

    res.render(`search`, {
      results
    });
  } catch (error) {
    console.error(chalk.red(`Can't find anything`));

    res.render(`search`, {
      results: []
    });
  }
});

module.exports = searchRouter;
