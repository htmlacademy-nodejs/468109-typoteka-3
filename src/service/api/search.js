'use strict';

const {Router} = require(`express`);
const {StatusCodes} = require(`http-status-codes`);

const searchValidator = require(`../middlewares/searchValidator`);

module.exports = (app, service) => {
  const route = new Router();

  app.use(`/search`, route);

  route.get(`/`, searchValidator, async (req, res) => {
    const {query} = req.query;

    const results = await service.findAll(query);

    if (!results || results.length === 0) {
      return res.status(StatusCodes.NOT_FOUND)
        .json([]);
    }

    return res.status(StatusCodes.OK)
      .json(results);
  });
};
