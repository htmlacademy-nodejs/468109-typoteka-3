'use strict';

const {Router} = require(`express`);

const sequelize = require(`../lib/sequelize`);
const defineModels = require(`../models`);
const category = require(`./category`);
const search = require(`./search`);
const article = require(`./article`);

const {
  CategoryService,
  SearchService,
  ArticleService,
} = require(`../data-service`);

const getAppRoutes = () => {
  const app = new Router();
  defineModels(sequelize);

  category(app, new CategoryService(sequelize));
  search(app, new SearchService(sequelize));
  article(app, new ArticleService(sequelize));

  return app;
};

module.exports = getAppRoutes;
