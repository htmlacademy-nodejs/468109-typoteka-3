'use strict';

const {Router} = require(`express`);
const asyncHandler = require(`express-async-handler`);

const {getAPI} = require(`../api`);

const mainRouter = new Router();
const api = getAPI();

const ARTICLES_PER_PAGE = 8;

mainRouter.get(`/`, asyncHandler(async (req, res) => {
  let {page = 1} = req.query;
  const limit = ARTICLES_PER_PAGE;
  const offset = (page - 1) * ARTICLES_PER_PAGE;

  const [{count, articles}, categories, comments] = await Promise.all([
    api.getArticles({comments: true, limit, offset}),
    api.getCategories(true),
    api.getLastComments(3)
  ]);

  const totalPages = Math.ceil(count / ARTICLES_PER_PAGE);

  res.render(`main`, {articles, categories, comments, page, totalPages});
}));

module.exports = mainRouter;
