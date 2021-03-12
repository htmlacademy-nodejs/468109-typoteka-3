'use strict';

const {Router} = require(`express`);
const {StatusCodes} = require(`http-status-codes`);

const route = new Router();

module.exports = (app, service) => {
  app.use(`/search`, route);

  route.get(
      `/`,
      (req, res) => {
        const {query} = req.query;

        const results = service.findAll(query);
        res.status(StatusCodes.OK)
          .json(results);
      });
};
