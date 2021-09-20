'use strict';

const {Router} = require(`express`);
const asyncHandler = require(`express-async-handler`);

const {getAPI} = require(`../api`);

const mainRouter = new Router();
const api = getAPI();

const ARTICLES_PER_PAGE = 8;

mainRouter.get(`/`, asyncHandler(async (req, res) => {
  const {user} = req.session;
  let {page = 1} = req.query;
  const limit = ARTICLES_PER_PAGE;
  const offset = (page - 1) * ARTICLES_PER_PAGE;

  const [{count, articles}, mostPopularArticles, categories, comments] = await Promise.all([
    api.getArticles({comments: true, limit, offset}),
    api.getMostPopularArticles(4),
    api.getUsedCategories(),
    api.getLastComments(4)
  ]);

  const totalPages = Math.ceil(count / ARTICLES_PER_PAGE);

  res.render(`main`, {articles, mostPopularArticles, categories, comments, page, totalPages, user});
}));

mainRouter.get(`/404`, asyncHandler(async (req, res) => {
  const {user} = req.session;

  res.render(`errors/404`, {user});
}));

mainRouter.get(`/500`, asyncHandler(async (req, res) => {
  const {user} = req.session;

  res.render(`errors/500`, {user});
}));

module.exports = mainRouter;
