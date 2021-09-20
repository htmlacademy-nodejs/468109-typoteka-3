'use strict';

const {Router} = require(`express`);
const asyncHandler = require(`express-async-handler`);

const {getAPI} = require(`../api`);
const {HttpMethod} = require(`../constants`);
const auth = require(`../middlewares/auth`);

const categoriesRouter = new Router();
const api = getAPI();

const CATEGORIES_PER_PAGE = 8;

const renderCategories = asyncHandler(async (req, res, meta = {}) => {
  const {user} = req.session;
  let {page = 1, referer} = req.query;
  const {errors} = meta;
  const limit = CATEGORIES_PER_PAGE;
  const offset = (page - 1) * CATEGORIES_PER_PAGE;

  const {categories, count} = await api.getCategories({limit, offset});

  const totalPages = Math.ceil(count / CATEGORIES_PER_PAGE);

  res.render(`all-categories`, {categories, page, totalPages, errors, referer, user});
});

categoriesRouter.get(`/`, auth(true), renderCategories);

categoriesRouter.post(`/`, auth(true), asyncHandler(async (req, res) => {
  const {body, query} = req;
  const {referer} = query;

  try {
    await api.addCategory(body);

    if (referer) {
      res.redirect(`${referer}`);
    } else {
      renderCategories(req, res);
    }
  } catch (err) {
    renderCategories(req, res, {errors: err.response.data.message});
  }
}));

categoriesRouter.post(`/:id`, auth(true), asyncHandler(async (req, res) => {
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
