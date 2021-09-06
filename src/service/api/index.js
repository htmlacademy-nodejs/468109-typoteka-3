'use strict';

const {Router} = require(`express`);

const getSequelize = require(`../lib/sequelize`);
const defineModels = require(`../models`);
const category = require(`./category`);
const search = require(`./search`);
const article = require(`./article`);
const user = require(`./user`);

const {
  CategoryService,
  SearchService,
  ArticleService,
  UserService
} = require(`../data-service`);

const getAppRoutes = () => {
  const app = new Router();
  const sequelize = getSequelize();
  defineModels(sequelize);

  category(app, new CategoryService(sequelize));
  search(app, new SearchService(sequelize));
  article(app, new ArticleService(sequelize));
  user(app, new UserService(sequelize));

  return app;
};

module.exports = getAppRoutes;
