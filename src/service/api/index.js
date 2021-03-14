'use strict';

const {Router} = require(`express`);

const {getMockData} = require(`../lib/get-mock-data`);
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

  const mockData = getMockData();

  category(app, new CategoryService(mockData));
  search(app, new SearchService(mockData));
  article(app, new ArticleService(mockData));

  return app;
};

module.exports = getAppRoutes;
