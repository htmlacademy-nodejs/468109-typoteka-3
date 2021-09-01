'use strict';

const {Router} = require(`express`);
const asyncHandler = require(`express-async-handler`);

const {getAPI} = require(`../api`);

const categoriesRouter = new Router();
const api = getAPI();

const CATEGORIES_PER_PAGE = 8;

const getCategoriesRoute = asyncHandler(async (req, res) => {
  let {page = 1} = req.query;
  const {errors} = res.locals;
  const limit = CATEGORIES_PER_PAGE;
  const offset = (page - 1) * CATEGORIES_PER_PAGE;

  const {categories, count} = await api.getCategories({limit, offset});

  const totalPages = Math.ceil(count / CATEGORIES_PER_PAGE);

  res.render(`all-categories`, {categories, page, totalPages, errors});
});

categoriesRouter.get(`/`, getCategoriesRoute);

categoriesRouter.post(`/`, asyncHandler(async (req, res) => {
  const {body} = req;

  try {
    await api.addCategory(body);
    getCategoriesRoute(req, res);
  } catch (err) {
    res.locals.errors = err.response.data.message;
    getCategoriesRoute(req, res);
  }
}));

module.exports = categoriesRouter;
