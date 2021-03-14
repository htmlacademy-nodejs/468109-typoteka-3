'use strict';

const {Router} = require(`express`);
const {StatusCodes} = require(`http-status-codes`);

module.exports = (app, service) => {
  const route = new Router();

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
