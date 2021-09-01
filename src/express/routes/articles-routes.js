'use strict';

const {Router} = require(`express`);
const asyncHandler = require(`express-async-handler`);

const {getAPI} = require(`../api`);

const articlesRouter = new Router();
const api = getAPI();

const getNewPostRoute = (req, res) => {
  const {errors, article} = res.locals;

  res.render(`new-post`, {article, errors});
};

articlesRouter.get(`/category/:id`, asyncHandler(async (req, res) => {
  const {id} = req.params;

  const [articles, categories, category] = await Promise.all([
    api.getArticles({comments: true}),
    api.getCategories(true),
    api.getCategory(id)
  ]);

  return res.render(`articles-by-category`, {articles, categories, category});
}));

articlesRouter.get(`/add`, getNewPostRoute);

articlesRouter.post(`/add`, asyncHandler(async (req, res) => {
  const {body} = req;

  const articleData = {
    publicationDate: body.date,
    title: body.title,
    announce: body.announce,
    fullText: body[`full-text`],
    categories: body.category
  };

  try {
    await api.createArticle(articleData);
    res.redirect(`/my`);
  } catch (err) {
    res.locals.errors = err.response.data.message;
    res.locals.article = articleData;

    getNewPostRoute(req, res);
  }
}));

articlesRouter.get(`/edit/:id`, asyncHandler(async (req, res) => {
  const {id} = req.params;
  const article = await api.getArticle(id);

  res.render(`new-post`, {article, editMode: true});
}));

articlesRouter.post(`/edit/:id`, asyncHandler(async (req, res) => {
  const {body} = req;
  const articleData = {
    createdDate: body.date,
    title: body.title,
    announce: body.announcement,
    fullText: body[`full-text`],
  };
  const {id} = req.params;

  try {
    await api.updateArticle(articleData, id);
    res.redirect(`/my`);
  } catch (e) {
    res.redirect(`back`);
  }
}));

articlesRouter.get(`/:id`, asyncHandler(async (req, res) => {
  const {id} = req.params;
  const article = await api.getArticle(id);

  res.render(`post`, {article});
}));

module.exports = articlesRouter;
