'use strict';

const {Router} = require(`express`);

const {getAPI} = require(`../api`);

const mainRouter = new Router();
const api = getAPI();

mainRouter.get(`/`, async (req, res) => {
  const [articles, categories, comments] = await Promise.all([
    api.getArticles(true),
    api.getCategories(true),
    api.getLastComments(3)
  ]);

  res.render(`main`, {articles, categories, comments});
});

module.exports = mainRouter;
