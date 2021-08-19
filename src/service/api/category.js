'use strict';

const {Router} = require(`express`);
const {StatusCodes} = require(`http-status-codes`);

const {categoryKeys, entityNames} = require(`../constants/entities`);
const entityValidator = require(`../middlewares/entityValidator`);

module.exports = (app, service) => {
  const route = new Router();

  app.use(`/category`, route);

  route.get(`/`, async (req, res) => {
    const {count} = req.query;

    const categories = await service.findAll(count);
    res.status(StatusCodes.OK)
      .json(categories);
  });

  route.get(`/:id`, async (req, res) => {
    const {id} = req.params;
    const category = await service.findOne(id);
    res.status(StatusCodes.OK)
      .json(category);
  });

  route.post(`/`, entityValidator(categoryKeys, entityNames.CATEGORY), async (req, res) => {
    const {body} = req;

    const newCategory = await service.createCategory(body);

    res.status(StatusCodes.OK)
      .json(newCategory);
  });
};
