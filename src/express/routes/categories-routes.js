'use strict';

const {Router} = require(`express`);

const {getAPI} = require(`../api`);

const categoriesRouter = new Router();
const api = getAPI();

const CATEGORIES_PER_PAGE = 8;

categoriesRouter.get(`/`, async (req, res) => {
  let {page = 1} = req.query;
  const limit = CATEGORIES_PER_PAGE;
  const offset = (page - 1) * CATEGORIES_PER_PAGE;

  const {categories, count} = await api.getCategories({limit, offset});

  const totalPages = Math.ceil(count / CATEGORIES_PER_PAGE);

  res.render(`all-categories`, {categories, page, totalPages});
});

categoriesRouter.post(`/`, async (req, res) => {
  const {body} = req;


  await api.addCategory(body);

  const categories = await api.getCategories();
  res.render(`all-categories`, {categories});
});

module.exports = categoriesRouter;
