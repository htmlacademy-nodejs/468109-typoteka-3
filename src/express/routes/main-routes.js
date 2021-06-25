'use strict';

const {Router} = require(`express`);

const {getAPI} = require(`../api`);

const mainRouter = new Router();
const api = getAPI();

mainRouter.get(`/`, async (req, res) => {
  const [articles, categories] = await Promise.all([
    api.getArticles(),
    api.getCategories()
  ]);

  res.render(`main`, {articles, categories});
});

module.exports = mainRouter;
