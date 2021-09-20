'use strict';

const {Router} = require(`express`);
const chalk = require(`chalk`);
const asyncHandler = require(`express-async-handler`);

const {getAPI} = require(`../api`);

const searchRouter = new Router();
const api = getAPI();

searchRouter.get(`/`, asyncHandler(async (req, res) => {
  const {user} = req.session;

  try {
    const {search} = req.query;
    const results = await api.search(search);

    res.render(`search`, {
      results,
      user
    });
  } catch (error) {
    console.error(chalk.red(`Can't find anything`));

    res.render(`search`, {
      results: [],
      user
    });
  }
}));

module.exports = searchRouter;
