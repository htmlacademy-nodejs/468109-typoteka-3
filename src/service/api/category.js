'use strict';

const {Router} = require(`express`);
const {StatusCodes} = require(`http-status-codes`);
const asyncHandler = require(`express-async-handler`);

const {entityNames} = require(`../constants/entities`);
const entityValidator = require(`../middlewares/entity-validator`);
const categorySchema = require(`../schemas/category`);
const routeParamsValidator = require(`../middlewares/route-params-validator`);
const categoryExists = require(`../middlewares/category-exists`);

module.exports = (app, service) => {
  const route = new Router();

  app.use(`/category`, route);

  route.get(`/`, asyncHandler(async (req, res) => {
    const {count, offset, limit} = req.query;
    let categories;

    if (offset || limit) {
      categories = await service.findPage({limit, offset});
    } else {
      categories = await service.findAll(count);
    }

    res.status(StatusCodes.OK)
      .json(categories);
  }));

  route.get(`/used`, asyncHandler(async (req, res) => {
    const categories = await service.findUsedCategories();

    res.status(StatusCodes.OK)
      .json(categories);
  }));

  route.get(`/:categoryId`, [routeParamsValidator], asyncHandler(async (req, res) => {
    const {articles} = req.query;
    const {categoryId} = req.params;
    const category = await service.findOne({id: categoryId, articles});
    res.status(StatusCodes.OK)
      .json(category);
  }));

  route.delete(`/:categoryId`, [routeParamsValidator, categoryExists(service)], asyncHandler(async (req, res) => {
    const {categoryId} = req.params;
    const category = await service.drop(categoryId);

    if (!category) {
      return res.status(StatusCodes.NOT_FOUND)
        .send(`Not found`);
    }

    return res.status(StatusCodes.OK)
      .json(category);
  }));

  route.put(`/:categoryId`, [routeParamsValidator, categoryExists(service), entityValidator(categorySchema, entityNames.CATEGORY)], asyncHandler(async (req, res) => {
    const {body, params} = req;
    const {categoryId} = params;

    const updatedCategory = await service.update(categoryId, body);

    if (!updatedCategory) {
      return res.status(StatusCodes.NOT_FOUND)
        .send(`Not found`);
    }

    return res.status(StatusCodes.OK)
      .json(updatedCategory);
  }));

  route.post(`/`, entityValidator(categorySchema, entityNames.CATEGORY), asyncHandler(async (req, res) => {
    const {body} = req;

    const newCategory = await service.createCategory(body);

    res.status(StatusCodes.OK)
      .json(newCategory);
  }));
};
