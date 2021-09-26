'use strict';

const {Router} = require(`express`);
const asyncHandler = require(`express-async-handler`);

const {getAPI} = require(`../api`);
// const {getExtendedEntitiesArray} = require(`../../utils`);
const auth = require(`../middlewares/auth`);

const myRouter = new Router();
const api = getAPI();

myRouter.get(`/`, auth(true), asyncHandler(async (req, res) => {
  const {user} = req.session;
  const articles = await api.getArticles({});

  res.render(`my`, {articles, user});
}));

myRouter.get(`/comments`, auth(true), asyncHandler(async (req, res) => {
  const {user} = req.session;
  const comments = await api.getAllComments();

  res.render(`comments`, {comments, user});
}));

module.exports = myRouter;
