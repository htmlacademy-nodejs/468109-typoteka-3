'use strict';

const {Router} = require(`express`);
const asyncHandler = require(`express-async-handler`);

const {getAPI} = require(`../api`);
const {HttpMethod} = require(`../constants`);

const categoriesRouter = new Router();
const api = getAPI();

const CATEGORIES_PER_PAGE = 8;

const renderCategories = asyncHandler(async (req, res, meta) => {
  let {page = 1} = req.query;
  const {errors} = meta;
  const limit = CATEGORIES_PER_PAGE;
  const offset = (page - 1) * CATEGORIES_PER_PAGE;

  const {categories, count} = await api.getCategories({limit, offset});

  const totalPages = Math.ceil(count / CATEGORIES_PER_PAGE);

  res.render(`all-categories`, {categories, page, totalPages, errors});
});

categoriesRouter.get(`/`, renderCategories);

categoriesRouter.post(`/`, asyncHandler(async (req, res) => {
  const {body} = req;

  try {
    await api.addCategory(body);
    renderCategories(req, res);
  } catch (err) {
    renderCategories(req, res, {errors: err.response.data.message});
  }
}));

categoriesRouter.post(`/:id`, asyncHandler(async (req, res) => {
  const {body, params} = req;
  const {id} = params;
  const {action} = body;

  switch (action) {
    case HttpMethod.DELETE:
      await api.deleteCategory(id);

      return res.redirect(`/categories`);
    case HttpMethod.PUT:
      const updatedCategory = {
        name: body.name
      };

      await api.updateCategory(id, updatedCategory);

      return res.redirect(`/categories`);
    default:
      return null;
  }
}));

module.exports = categoriesRouter;
