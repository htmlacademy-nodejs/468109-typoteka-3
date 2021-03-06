'use strict';

const {Router} = require(`express`);

const {getAPI} = require(`../api`);

const categoriesRouter = new Router();
const api = getAPI();

categoriesRouter.get(`/`, async (req, res) => {
  const categories = await api.getCategories();

  res.render(`all-categories`, {categories});
});

module.exports = categoriesRouter;
