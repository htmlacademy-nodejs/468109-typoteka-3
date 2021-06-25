'use strict';

const {Router} = require(`express`);

const {getAPI} = require(`../api`);
const {getExtendedEntitiesArray} = require(`../../utils`);

const myRouter = new Router();
const api = getAPI();

myRouter.get(`/`, async (req, res) => {
  const articles = await api.getArticles();

  res.render(`my`, {articles});
});
myRouter.get(`/comments`, async (req, res) => {
  const articles = await api.getArticles();
  const preparedArticles = articles.slice(0, 3);

  const comments = getExtendedEntitiesArray(preparedArticles, `comments`, [`announce`, `createdDate`]);

  res.render(`comments`, {comments});
});

module.exports = myRouter;
